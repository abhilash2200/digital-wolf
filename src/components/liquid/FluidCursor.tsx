"use client";

import { useEffect, useRef } from "react";

/**
 * Monochrome fluid trail that follows the mouse (desktop only; mounted by
 * LiquidEffects). A small stable-fluids simulation in WebGL2: velocity is
 * advected, given vorticity, made divergence-free, and carries a grey "ink"
 * that's drawn with mix-blend-mode: difference so it reads on light and dark.
 * Rendering stops a few seconds after the pointer stops moving.
 */

const SIM_RES = 128;
const DYE_RES = 512;
const PRESSURE_ITERATIONS = 16;
const IDLE_STOP_MS = 4000;

const VERT = `#version 300 es
in vec2 aPosition;
out vec2 vUv, vL, vR, vT, vB;
uniform vec2 texelSize;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG = {
  splat: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTarget; uniform float aspectRatio, radius; uniform vec3 color; uniform vec2 point;
void main() {
  vec2 p = vUv - point; p.x *= aspectRatio;
  o = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0);
}`,
  advection: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity, uSource; uniform vec2 texelSize; uniform float dt, dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  o = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: `#version 300 es
precision highp float;
in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `#version 300 es
precision highp float;
in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `#version 300 es
precision highp float;
in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uVelocity, uCurl; uniform float curl, dt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C; force.y *= -1.0;
  o = vec4(texture(uVelocity, vUv).xy + force * dt, 0.0, 1.0);
}`,
  pressure: `#version 300 es
precision highp float;
in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uPressure, uDivergence;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4((L + R + B + T - texture(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `#version 300 es
precision highp float;
in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uPressure, uVelocity;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4(texture(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
}`,
  scale: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTexture; uniform float value;
void main() { o = value * texture(uTexture, vUv); }`,
  display: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTexture;
void main() {
  float ink = clamp(texture(uTexture, vUv).r, 0.0, 0.32);
  o = vec4(vec3(ink), ink);
}`,
};

type Program = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> };
type FBO = { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number };
type DoubleFBO = { read: FBO; write: FBO; swap: () => void };

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!canvas || !gl || !gl.getExtension("EXT_color_buffer_float")) return;

    // ---------- setup ----------
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    // Compile and link everything up front, but don't query any program until
    // the GPU reports it's done (KHR_parallel_shader_compile). Querying earlier
    // blocks the main thread for the whole compile — ~0.7s in testing.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    const vertex = compile(gl.VERTEX_SHADER, VERT);
    const linking = Object.entries(FRAG).map(([name, frag]) => {
      const program = gl.createProgram()!;
      gl.attachShader(program, vertex);
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(program, 0, "aPosition");
      gl.linkProgram(program);
      return [name, program] as const;
    });
    const linked = () =>
      !parallel || linking.every(([, program]) => gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR));
    const collect = (program: WebGLProgram): Program => {
      const uniforms: Program["uniforms"] = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(program, i)!.name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return { program, uniforms };
    };

    let disposed = false;
    let cleanup = () => {};
    let poll = 0;
    const waitForLink = () => {
      if (disposed) return;
      if (!linked()) { poll = window.setTimeout(waitForLink, 50); return; }
      if (linking.some(([, program]) => !gl.getProgramParameter(program, gl.LINK_STATUS))) return;
      const programs = Object.fromEntries(linking.map(([name, program]) => [name, collect(program)])) as Record<keyof typeof FRAG, Program>;
      cleanup = begin(programs);
    };
    const begin = (programs: Record<keyof typeof FRAG, Program>) => {

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const createFBO = (width: number, height: number, internal: number, format: number): FBO => {
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { texture, fbo, width, height };
    };
    const createDouble = (w: number, h: number, internal: number, format: number): DoubleFBO => {
      const pair = { read: createFBO(w, h, internal, format), write: createFBO(w, h, internal, format), swap() { [pair.read, pair.write] = [pair.write, pair.read]; } };
      return pair;
    };

    let velocity: DoubleFBO, dye: DoubleFBO, pressure: DoubleFBO, divergence: FBO, curl: FBO;
    const resolution = (base: number) => {
      const aspect = canvas.width / canvas.height;
      return aspect > 1 ? [Math.round(base * aspect), base] : [base, Math.round(base / aspect)];
    };
    const resize = () => {
      // The ink is soft, so a half-resolution canvas is visually identical and much cheaper.
      canvas.width = Math.max(1, Math.round(window.innerWidth * 0.5));
      canvas.height = Math.max(1, Math.round(window.innerHeight * 0.5));
      const [sw, sh] = resolution(SIM_RES);
      const [dw, dh] = resolution(DYE_RES);
      velocity = createDouble(sw, sh, gl.RG16F, gl.RG);
      dye = createDouble(dw, dh, gl.R16F, gl.RED);
      pressure = createDouble(sw, sh, gl.R16F, gl.RED);
      divergence = createFBO(sw, sh, gl.R16F, gl.RED);
      curl = createFBO(sw, sh, gl.R16F, gl.RED);
    };
    resize();

    const activate = (p: Program) => { gl.useProgram(p.program); return p.uniforms; };
    const bind = (unit: number, fbo: FBO) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, fbo.texture); return unit; };
    const draw = (target: FBO | null) => {
      if (target) { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
      else { gl.viewport(0, 0, canvas.width, canvas.height); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // ---------- simulation step ----------
    const step = (dt: number) => {
      const sim = velocity.read;
      const texel = [1 / sim.width, 1 / sim.height] as const;

      let u = activate(programs.curl);
      gl.uniform2f(u.texelSize, ...texel); gl.uniform1i(u.uVelocity, bind(0, velocity.read)); draw(curl);

      u = activate(programs.vorticity);
      gl.uniform2f(u.texelSize, ...texel); gl.uniform1i(u.uVelocity, bind(0, velocity.read)); gl.uniform1i(u.uCurl, bind(1, curl));
      gl.uniform1f(u.curl, 12); gl.uniform1f(u.dt, dt); draw(velocity.write); velocity.swap();

      u = activate(programs.divergence);
      gl.uniform2f(u.texelSize, ...texel); gl.uniform1i(u.uVelocity, bind(0, velocity.read)); draw(divergence);

      u = activate(programs.scale);
      gl.uniform1i(u.uTexture, bind(0, pressure.read)); gl.uniform1f(u.value, 0.8); draw(pressure.write); pressure.swap();

      u = activate(programs.pressure);
      gl.uniform2f(u.texelSize, ...texel); gl.uniform1i(u.uDivergence, bind(0, divergence));
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) { gl.uniform1i(u.uPressure, bind(1, pressure.read)); draw(pressure.write); pressure.swap(); }

      u = activate(programs.gradient);
      gl.uniform2f(u.texelSize, ...texel); gl.uniform1i(u.uPressure, bind(0, pressure.read)); gl.uniform1i(u.uVelocity, bind(1, velocity.read));
      draw(velocity.write); velocity.swap();

      u = activate(programs.advection);
      gl.uniform2f(u.texelSize, ...texel); gl.uniform1f(u.dt, dt);
      gl.uniform1i(u.uVelocity, bind(0, velocity.read)); gl.uniform1i(u.uSource, bind(0, velocity.read));
      gl.uniform1f(u.dissipation, 1.6); draw(velocity.write); velocity.swap();
      gl.uniform1i(u.uVelocity, bind(0, velocity.read)); gl.uniform1i(u.uSource, bind(1, dye.read));
      gl.uniform1f(u.dissipation, 3.2); draw(dye.write); dye.swap();

      u = activate(programs.display);
      gl.uniform1i(u.uTexture, bind(0, dye.read)); draw(null);
    };

    const splat = (x: number, y: number, dx: number, dy: number) => {
      const aspect = canvas.width / canvas.height;
      let u = activate(programs.splat);
      gl.uniform1i(u.uTarget, bind(0, velocity.read)); gl.uniform1f(u.aspectRatio, aspect);
      gl.uniform2f(u.point, x, y); gl.uniform3f(u.color, dx, dy, 0); gl.uniform1f(u.radius, 0.0009);
      draw(velocity.write); velocity.swap();
      u = activate(programs.splat);
      gl.uniform1i(u.uTarget, bind(0, dye.read)); gl.uniform1f(u.aspectRatio, aspect);
      gl.uniform2f(u.point, x, y); gl.uniform3f(u.color, 0.11, 0, 0); gl.uniform1f(u.radius, 0.0005);
      draw(dye.write); dye.swap();
    };

    // ---------- loop, driven by pointer movement ----------
    let frame = 0, running = false, last = performance.now(), lastMove = 0;
    let pointer: { x: number; y: number } | null = null;
    const pending: [number, number, number, number][] = [];

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      for (const s of pending.splice(0)) splat(...s);
      step(dt);
      if (now - lastMove > IDLE_STOP_MS || document.hidden) { running = false; return; }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      if (pointer) {
        const dx = (x - pointer.x) * 2600, dy = (y - pointer.y) * 2600;
        if (Math.abs(dx) + Math.abs(dy) > 0.5) pending.push([x, y, dx, dy]);
      }
      pointer = { x, y };
      lastMove = performance.now();
      if (!running) { running = true; last = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const onLeave = () => { pointer = null; };
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
    };
    waitForLink();

    return () => {
      disposed = true;
      clearTimeout(poll);
      cleanup();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 size-full mix-blend-difference"
    />
  );
}
