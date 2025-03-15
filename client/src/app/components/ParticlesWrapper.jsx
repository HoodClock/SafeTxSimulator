"use client"; // Mark this as a Client Component

import dynamic from "next/dynamic";

const ParticlesBackground = dynamic(
  () => import("./ParticlesBackground"),
  { 
    ssr: false, // Disable SSR for particles
    loading: () => <div className="absolute inset-0 bg-transparent" /> // Loading state
  }
);

export default function ParticlesWrapper() {
  return <ParticlesBackground />;
}