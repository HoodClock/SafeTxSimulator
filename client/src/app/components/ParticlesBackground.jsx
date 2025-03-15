"use client";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Use loadSlim for lighter bundle

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine); // Initialize with loadSlim
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: "#4FD1C5" }, // Cyan-400
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            move: {
              enable: true,
              speed: 3,
              direction: "none",
              random: true,
              out_mode: "bounce"
            },
            links: {
              enable: true,
              color: "#4FD1C5", // Cyan-400
              opacity: 0.3,
              width: 1
            }
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" }
            }
          }
        }}
      />
    </div>
  );
};

export default ParticlesBackground;