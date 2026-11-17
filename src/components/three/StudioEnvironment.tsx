"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

type Strip = {
  position: [number, number, number];
  size: [number, number];
  intensity: number;
};

// A dark studio with narrow strip softboxes: the glass picks up crisp dark
// edges and bright highlights, which is what makes it read on a light page.
const STRIPS: Strip[] = [
  { position: [0, 6, 0], size: [9, 1.4], intensity: 6 }, // overhead
  { position: [-6, 0.5, 1], size: [0.9, 10], intensity: 4 }, // key, left
  { position: [6, -0.5, 2], size: [0.7, 9], intensity: 2.5 }, // rim, right
  { position: [2.5, 2.5, 7], size: [1.6, 1.6], intensity: 4 }, // front kicker
  { position: [-3, -6, 2], size: [10, 6], intensity: 0.6 }, // floor bounce
];

/**
 * Bakes a procedural studio into a PMREM environment map once. Using
 * PMREMGenerator.fromScene directly is more predictable across GPUs than a
 * live cube camera.
 */
export function StudioEnvironment() {
  const gl = useThree((s) => s.gl);

  const envMap = useMemo(() => {
    const studio = new THREE.Scene();
    studio.background = new THREE.Color("#0d0d0f");
    const geometry = new THREE.PlaneGeometry(1, 1);
    const materials: THREE.Material[] = [];

    for (const strip of STRIPS) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, 1, 1).multiplyScalar(strip.intensity),
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      materials.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...strip.position);
      mesh.scale.set(strip.size[0], strip.size[1], 1);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
    }

    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(studio, 0.02).texture;
    pmrem.dispose();
    geometry.dispose();
    materials.forEach((m) => m.dispose());
    return texture;
  }, [gl]);

  useEffect(() => () => envMap.dispose(), [envMap]);

  return <primitive object={envMap} attach="environment" />;
}
