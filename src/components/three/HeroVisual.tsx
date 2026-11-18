"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import type { SculptureQuality } from "./GlassSculpture";

// The 3D scene loads after hydration and never blocks the hero copy.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

/**
 * Real-time glass (transmission) is expensive on phones, and the spec's
 * LCP ≤ 2.5s / INP ≤ 200ms targets take priority. Below the desktop layout the
 * hero shows the static render of the same sculpture. Flip to `true` to run
 * the simplified ("low") 3D scene on mobile and tablet instead.
 */
const MOBILE_3D = false;

type Mode = "pending" | "static" | SculptureQuality;

function detectMode(): Mode {
  const params = new URLSearchParams(window.location.search);
  if (params.get("webgl") === "0") return "static"; // QA switch for the fallback

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return "static";

  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return "static";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return "static";
  }

  const desktop =
    window.matchMedia("(min-width: 1024px)").matches &&
    window.matchMedia("(pointer: fine)").matches;
  if (desktop) return "high";
  return MOBILE_3D ? "low" : "static";
}

export function HeroVisual({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduceMotion = usePrefersReducedMotion();
  const markReady = useCallback(() => setReady(true), []);

  // Detect capability, then start the scene only once the page has loaded and
  // the browser is idle, so WebGL setup never competes with first paint.
  useEffect(() => {
    const detected = detectMode();
    if (detected === "static") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- capability detection needs the browser
      setMode("static");
      return;
    }
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      const run = () => setMode(detected);
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(run, { timeout: 2500 });
      else timeoutId = setTimeout(run, 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showCanvas = (mode === "high" || mode === "low") && !failed;

  return (
    <div
      ref={containerRef}
      className={cn("hero-feather relative isolate overflow-hidden", className)}
    >
      {/* Static fallback: shown before WebGL is ready, and instead of it when unsupported. */}
      <Image
        src="/images/hero-sculpture.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        // On mobile this image is the LCP element.
        loading="eager"
        fetchPriority="high"
        className={cn(
          "object-contain transition-opacity duration-700 ease-editorial",
          ready && showCanvas ? "opacity-0" : "opacity-100",
        )}
      />

      {showCanvas && (
        <CanvasErrorBoundary onError={() => setFailed(true)}>
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-editorial",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <HeroCanvas
              quality={mode}
              animate={!reduceMotion}
              active={visible}
              onReady={markReady}
            />
          </div>
        </CanvasErrorBoundary>
      )}
    </div>
  );
}
