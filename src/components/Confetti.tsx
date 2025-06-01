
import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const Confetti = ({ trigger, onComplete }: ConfettiProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    speedX: number;
    speedY: number;
  }>>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#dc2626', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 4,
      speedX: (Math.random() - 0.5) * 4,
      speedY: Math.random() * 3 + 2,
    }));

    setParticles(newParticles);

    const animationTimeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(animationTimeout);
  }, [trigger, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bounce"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            animation: `fall 3s linear forwards`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
