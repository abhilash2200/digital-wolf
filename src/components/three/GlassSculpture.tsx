"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

export type SculptureQuality = "high" | "low";

/**
 * Closed curve for one loop of the sculpture: an ellipse in a given plane with
 * a gentle out-of-plane wave, so the loops feel organic rather than mechanical.
 */
class WavyEllipse extends THREE.Curve<THREE.Vector3> {
  constructor(
    private a: number,
    private b: number,
    private wave: number,
    private phase: number,
    private plane: "xy" | "yz" | "zx",
  ) {
    super();
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const angle = t * Math.PI * 2;
    const u = Math.cos(angle) * this.a;
    const v = Math.sin(angle) * this.b;
    const w = Math.sin(angle * 2 + this.phase) * this.wave;
    if (this.plane === "xy") return target.set(u, v, w);
    if (this.plane === "yz") return target.set(w, u, v);
    return target.set(v, w, u);
  }
}

// Three mutually interlocking loops (a Borromean arrangement): no two loops
// link directly, but together they hold — a quiet nod to connected disciplines.
const LOOPS = [
  { plane: "xy", phase: 0 },
  { plane: "yz", phase: 1.3 },
  { plane: "zx", phase: 2.6 },
] as const;

const A = 1.62;
const B = 0.84;
const TUBE = 0.19;
const WAVE = 0.08;

export function GlassSculpture({ quality }: { quality: SculptureQuality }) {
  const tubular = quality === "high" ? 240 : 160;
  const radial = quality === "high" ? 32 : 20;

  const geometries = useMemo(
    () =>
      LOOPS.map(
        ({ plane, phase }) =>
          new THREE.TubeGeometry(
            new WavyEllipse(A, B, WAVE, phase, plane),
            tubular,
            TUBE,
            radial,
            true,
          ),
      ),
    [tubular, radial],
  );

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transmission: 1,
        thickness: 2.4,
        roughness: 0.02,
        ior: 1.45,
        dispersion: quality === "high" ? 0.6 : 0,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        attenuationColor: new THREE.Color("#f1f3f4"),
        attenuationDistance: 6,
        specularIntensity: 1,
        envMapIntensity: 1,
      }),
    [quality],
  );

  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);
  useEffect(() => () => material.dispose(), [material]);

  return (
    <group>
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry} material={material} />
      ))}
    </group>
  );
}
