/**
 * Liquid effect helpers (desktop only). SVG filters live in one hidden <svg>
 * so CSS `filter` / `backdrop-filter` can reference them by id.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
let defs: SVGDefsElement | null = null;
let counter = 0;

function getDefs() {
  if (defs?.isConnected) return defs;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.pointerEvents = "none";
  defs = document.createElementNS(SVG_NS, "defs");
  svg.appendChild(defs);
  document.body.appendChild(svg);
  return defs;
}

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

export type LiquidFilter = {
  id: string;
  turbulence: SVGFETurbulenceElement;
  displacement: SVGFEDisplacementMapElement;
  remove: () => void;
};

/** A turbulence-driven displacement filter: animate `displacement.scale` to melt/ripple. */
export function createLiquidFilter(baseFrequency = "0.012 0.035", scale = 0): LiquidFilter {
  const id = `liquid-${++counter}`;
  const filter = el("filter", { id, x: "-10%", y: "-10%", width: "120%", height: "120%", "color-interpolation-filters": "sRGB" });
  const turbulence = el("feTurbulence", { type: "fractalNoise", baseFrequency, numOctaves: 2, seed: counter, result: "noise" });
  const displacement = el("feDisplacementMap", { in: "SourceGraphic", in2: "noise", scale, xChannelSelector: "R", yChannelSelector: "G" });
  filter.append(turbulence, displacement);
  getDefs().appendChild(filter);
  return { id, turbulence, displacement, remove: () => filter.remove() };
}

/**
 * Displacement map for a rounded-rect glass lens: neutral (no shift) in the
 * middle, bending strongly towards the rim — the "liquid glass" refraction.
 */
function lensMap(w: number, h: number, radius: number, bezel: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(w, h);
  const hx = w / 2, hy = h / 2, r = Math.min(radius, hx, hy);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Signed distance to the rounded rect (negative inside) and its outward normal.
      const px = x + 0.5 - hx, py = y + 0.5 - hy;
      const qx = Math.abs(px) - (hx - r), qy = Math.abs(py) - (hy - r);
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      const outside = Math.hypot(ox, oy);
      const sd = outside + Math.min(Math.max(qx, qy), 0) - r;
      let nx: number, ny: number;
      if (qx > 0 && qy > 0) { nx = ox / (outside || 1); ny = oy / (outside || 1); }
      else if (qx > qy) { nx = 1; ny = 0; } else { nx = 0; ny = 1; }
      nx *= Math.sign(px) || 1;
      ny *= Math.sign(py) || 1;
      const depth = -sd; // distance inside from the rim
      const k = depth >= 0 && depth < bezel ? (1 - depth / bezel) ** 2 : 0;
      const i = (y * w + x) * 4;
      image.data[i] = 128 - nx * k * 127;
      image.data[i + 1] = 128 - ny * k * 127;
      image.data[i + 2] = 128;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

/**
 * Build (or rebuild) a refraction filter sized to `element` and return its id,
 * for use as `backdrop-filter: url(#id)`. Chromium only — callers gate on that.
 */
export function createLensFilter(element: HTMLElement, { bezel = 22, strength = 38 } = {}) {
  const id = `liquid-lens-${++counter}`;
  let filter: SVGFilterElement | null = null;

  let built = "";
  const build = () => {
    const w = Math.max(1, Math.round(element.offsetWidth));
    const h = Math.max(1, Math.round(element.offsetHeight));
    const radius = parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
    const key = `${w}x${h}r${radius}`;
    if (key === built) return; // ResizeObserver fires once on observe; skip no-op rebuilds
    built = key;
    filter?.remove();
    filter = el("filter", { id, x: 0, y: 0, width: w, height: h, filterUnits: "userSpaceOnUse", primitiveUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB" });
    // The map is smooth, so compute it at half resolution and let feImage stretch it.
    const half = (n: number) => Math.max(1, Math.round(n / 2));
    const href = lensMap(half(w), half(h), radius / 2, Math.min(bezel, h / 2) / 2);
    const map = el("feImage", { href, x: 0, y: 0, width: w, height: h, preserveAspectRatio: "none", result: "map" });
    // Slight chromatic split at the rim: displace each channel by a different amount.
    const red = el("feDisplacementMap", { in: "SourceGraphic", in2: "map", scale: strength * 1.04, xChannelSelector: "R", yChannelSelector: "G", result: "dr" });
    const redOnly = el("feColorMatrix", { in: "dr", type: "matrix", values: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", result: "r" });
    const green = el("feDisplacementMap", { in: "SourceGraphic", in2: "map", scale: strength, xChannelSelector: "R", yChannelSelector: "G", result: "dg" });
    const greenOnly = el("feColorMatrix", { in: "dg", type: "matrix", values: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", result: "g" });
    const blue = el("feDisplacementMap", { in: "SourceGraphic", in2: "map", scale: strength * 0.96, xChannelSelector: "R", yChannelSelector: "G", result: "db" });
    const blueOnly = el("feColorMatrix", { in: "db", type: "matrix", values: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0", result: "b" });
    const rg = el("feBlend", { in: "r", in2: "g", mode: "screen", result: "rg" });
    const rgb = el("feBlend", { in: "rg", in2: "b", mode: "screen" });
    filter.append(map, red, redOnly, green, greenOnly, blue, blueOnly, rg, rgb);
    getDefs().appendChild(filter);
  };

  build();
  return { id, rebuild: build, remove: () => filter?.remove() };
}

/**
 * Give one glass element a refraction lens (`--lens`) sized to it, rebuilt on
 * resize. Built on idle so it never competes with first paint. Returns cleanup.
 */
export function attachLens(node: HTMLElement) {
  let lens: ReturnType<typeof createLensFilter> | null = null;
  // Rebuild once the size has settled. A rebuild re-renders the lens map
  // (canvas → PNG → new SVG filter); doing it on every frame of a size
  // transition (the header pill animating in) cost ~800ms of main thread.
  let settle: ReturnType<typeof setTimeout> | undefined;
  const resize = new ResizeObserver(() => {
    clearTimeout(settle);
    settle = setTimeout(() => lens?.rebuild(), 160);
  });
  const start = () => {
    lens = createLensFilter(node, {
      bezel: Number(node.dataset.liquidBezel) || 22,
      strength: Number(node.dataset.liquidStrength) || 38,
    });
    node.style.setProperty("--lens", `url(#${lens.id})`);
    resize.observe(node);
  };
  const hasIdle = typeof window.requestIdleCallback === "function";
  const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 1500 }) : 0;
  const timer = hasIdle ? undefined : setTimeout(start, 200);

  return () => {
    if (hasIdle) window.cancelIdleCallback(idle);
    clearTimeout(timer);
    clearTimeout(settle);
    resize.disconnect();
    node.style.removeProperty("--lens");
    lens?.remove();
  };
}

/** Chromium is the only engine that renders SVG filters inside backdrop-filter. */
export function supportsLiquidRefraction() {
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands;
  return Boolean(brands?.some((b) => b.brand === "Chromium"));
}

/** Desktop, fine pointer, motion allowed. */
export const LIQUID_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
