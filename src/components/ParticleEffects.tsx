import { useEffect, useState } from "react";

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: "spark" | "smoke" | "flash" | "tracer" | "explosion";
}

interface ParticleEffectsProps {
  active: boolean;
  type: "muzzle-flash" | "hit-impact" | "explosion" | "bullet-tracer";
  x?: number;
  y?: number;
  onComplete?: () => void;
}

const ParticleEffects = ({ active, type, x = 50, y = 50, onComplete }: ParticleEffectsProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const newParticles = generateParticles(type, x, y);
    setParticles(newParticles);

    const animationInterval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5, // gravity
            life: p.life - 1,
            vx: p.vx * 0.98, // friction
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    const timeout = setTimeout(() => {
      clearInterval(animationInterval);
      setParticles([]);
      onComplete?.();
    }, 1000);

    return () => {
      clearInterval(animationInterval);
      clearTimeout(timeout);
    };
  }, [active, type, x, y]);

  const generateParticles = (
    effectType: string,
    centerX: number,
    centerY: number
  ): Particle[] => {
    const particles: Particle[] = [];

    switch (effectType) {
      case "muzzle-flash":
        // Bright flash particles
        for (let i = 0; i < 30; i++) {
          const angle = (Math.PI * 2 * i) / 30;
          const speed = 3 + Math.random() * 4;
          particles.push({
            id: `flash-${i}`,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 4,
            color: i % 3 === 0 ? "#FF6B00" : i % 3 === 1 ? "#FFD700" : "#FF0000",
            life: 20 + Math.random() * 10,
            maxLife: 30,
            type: "flash",
          });
        }
        // Smoke particles
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 2;
          particles.push({
            id: `smoke-${i}`,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: 4 + Math.random() * 6,
            color: `rgba(150, 150, 150, ${0.5 + Math.random() * 0.3})`,
            life: 40 + Math.random() * 20,
            maxLife: 60,
            type: "smoke",
          });
        }
        break;

      case "bullet-tracer":
        // Tracer line particles
        for (let i = 0; i < 15; i++) {
          particles.push({
            id: `tracer-${i}`,
            x: centerX + i * 10,
            y: centerY - i * 2,
            vx: 8,
            vy: -0.5,
            size: 2,
            color: "#FFD700",
            life: 15 - i,
            maxLife: 15,
            type: "tracer",
          });
        }
        break;

      case "hit-impact":
        // Impact sparks
        for (let i = 0; i < 25; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          particles.push({
            id: `impact-${i}`,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1 + Math.random() * 3,
            color: i % 2 === 0 ? "#FFD700" : "#FF6B00",
            life: 25 + Math.random() * 15,
            maxLife: 40,
            type: "spark",
          });
        }
        // Dust cloud
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random();
          particles.push({
            id: `dust-${i}`,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: 6 + Math.random() * 8,
            color: `rgba(100, 100, 100, ${0.4 + Math.random() * 0.3})`,
            life: 35 + Math.random() * 20,
            maxLife: 55,
            type: "smoke",
          });
        }
        break;

      case "explosion":
        // Fireball
        for (let i = 0; i < 50; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 8;
          particles.push({
            id: `fire-${i}`,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 3 + Math.random() * 8,
            color:
              i % 4 === 0
                ? "#FF0000"
                : i % 4 === 1
                ? "#FF6B00"
                : i % 4 === 2
                ? "#FFD700"
                : "#FF4500",
            life: 30 + Math.random() * 20,
            maxLife: 50,
            type: "explosion",
          });
        }
        // Shockwave smoke
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 5;
          particles.push({
            id: `explosion-smoke-${i}`,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: 8 + Math.random() * 12,
            color: `rgba(80, 80, 80, ${0.6 + Math.random() * 0.3})`,
            life: 45 + Math.random() * 25,
            maxLife: 70,
            type: "smoke",
          });
        }
        break;
    }

    return particles;
  };

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => {
        const opacity = particle.life / particle.maxLife;
        const scale = particle.type === "smoke" ? 1 + (1 - opacity) * 0.5 : 1;

        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: opacity,
              transform: `scale(${scale})`,
              boxShadow:
                particle.type === "flash" || particle.type === "explosion"
                  ? `0 0 ${particle.size * 2}px ${particle.color}`
                  : "none",
              filter: particle.type === "smoke" ? "blur(3px)" : "blur(0.5px)",
              transition: "none",
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleEffects;
