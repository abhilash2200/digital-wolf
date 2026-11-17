"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { GlassSculpture, type SculptureQuality } from "./GlassSculpture";
import { StudioEnvironment } from "./StudioEnvironment";

const PAPER = "#F8F8F6";
const INITIAL_ROTATION: [number, number, number] = [0.42, 0.6, 0.18];

export type HeroCanvasProps = {
  quality: SculptureQuality;
  /** False when the user prefers reduced motion: render a still frame. */
  animate: boolean;
  /** False when the hero is offscreen: stop rendering entirely. */
  active: boolean;
  onReady?: () => void;
};

export default function HeroCanvas({
  quality,
  animate,
  active,
  onReady,
}: HeroCanvasProps) {
  const maxDpr = quality === "high" ? 2 : 1.5;
  const [dpr, setDpr] = useState(maxDpr);

  // Build the scene over several idle slices (canvas → lighting → sculpture)
  // instead of one long main-thread task, which would hurt responsiveness.
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= 2) return;
    return whenIdle(() => setStage((n) => n + 1));
  }, [stage]);

  return (
    <Canvas
      dpr={dpr}
      frameloop={!active ? "never" : animate ? "always" : "demand"}
      camera={{ position: [0, 0, 6.6], fov: 34 }}
      gl={{
        antialias: true,
        alpha: false,
        // Not "high-performance": on dual-GPU laptops that forces a switch to the
        // discrete GPU, which blocked the main thread for ~1s in testing and
        // drains battery. The integrated GPU renders this scene comfortably.
        powerPreference: "default",
        // Neutral keeps whites white; ACES greys the glass against the paper backdrop.
        toneMapping: THREE.NeutralToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.transmissionResolutionScale = quality === "high" ? 1 : 0.5;
      }}
      aria-hidden="true"
    >
      <color attach="background" args={[PAPER]} />

      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
        flipflops={2}
      />

      <Backdrop />

      {stage >= 1 && <StudioEnvironment />}

      {stage >= 2 && (
        <>
          <Rig animate={animate}>
            <GlassSculpture quality={quality} />
          </Rig>
          <ReadySignal onReady={onReady} />
        </>
      )}
    </Canvas>
  );
}

/** Run `fn` when the browser is idle (or soon); returns a cancel function. */
function whenIdle(fn: () => void) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout: 400 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 32);
  return () => clearTimeout(id);
}

/** Fires once the sculpture has compiled and drawn (two frames after mount). */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    let second = 0;
    const first = requestAnimationFrame(() => {
      invalidate();
      second = requestAnimationFrame(() => onReady?.());
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [invalidate, onReady]);
  return null;
}

/**
 * Slow ambient rotation, damped pointer response and restrained scroll parallax.
 */
function Rig({
  animate,
  children,
}: {
  animate: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    if (!animate) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const onPointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1.5);
    };

    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [animate]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || !animate) return;
    const dt = Math.min(delta, 0.05);
    const spin = g.userData.spin ?? INITIAL_ROTATION[1];
    g.userData.spin = spin + dt * 0.12;

    const targetX = INITIAL_ROTATION[0] + pointer.current.y * 0.18 + scroll.current * 0.35;
    const targetY = g.userData.spin + pointer.current.x * 0.3;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, scroll.current * 0.45, 4, dt);
  });

  return (
    <group ref={group} rotation={INITIAL_ROTATION} scale={0.92}>
      {children}
    </group>
  );
}

/**
 * Fine vertical rules behind the sculpture: refraction bends them, which is
 * what makes the glass read as optical glass on a light background.
 */
function Backdrop() {
  const texture = useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, size, size);

    const step = 26;
    for (let x = step / 2; x < size; x += step) {
      ctx.fillStyle = "rgba(17,17,17,0.24)";
      ctx.fillRect(x, 0, 1.6, size);
    }

    // Fade the rules out towards the edges so the canvas melts into the page.
    // Only the centre ~half of the plane is in view, so fade well inside that.
    const fade = ctx.createRadialGradient(size / 2, size / 2, size * 0.06, size / 2, size / 2, size * 0.25);
    fade.addColorStop(0, "rgba(248,248,246,0)");
    fade.addColorStop(1, "rgba(248,248,246,1)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[11, 11]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
