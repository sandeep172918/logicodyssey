import { useEffect, useRef } from 'react';

export default function FallbackBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Procedural floating geometric crystal shards & stardust
    const shards = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 24 + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.02,
      hue: Math.random() > 0.4 ? 275 : 42, // Purple or Gold
      alpha: Math.random() * 0.4 + 0.15,
    }));

    const render = () => {
      ctx.fillStyle = '#0c0914';
      ctx.fillRect(0, 0, width, height);

      // Ambient radial gradients
      const grad1 = ctx.createRadialGradient(width * 0.8, height * 0.3, 20, width * 0.8, height * 0.3, width * 0.6);
      grad1.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
      grad1.addColorStop(1, 'rgba(12, 9, 20, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.2, height * 0.8, 20, width * 0.2, height * 0.8, width * 0.5);
      grad2.addColorStop(0, 'rgba(232, 193, 114, 0.12)');
      grad2.addColorStop(1, 'rgba(12, 9, 20, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw floating geometric diamonds
      shards.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.vRot;

        if (s.x < -40) s.x = width + 40;
        if (s.x > width + 40) s.x = -40;
        if (s.y < -40) s.y = height + 40;
        if (s.y > height + 40) s.y = -40;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        ctx.beginPath();
        ctx.moveTo(0, -s.size);
        ctx.lineTo(s.size * 0.55, 0);
        ctx.lineTo(0, s.size);
        ctx.lineTo(-s.size * 0.55, 0);
        ctx.closePath();

        const color = s.hue === 42 ? 'rgba(232, 193, 114,' : 'rgba(168, 85, 247,';
        ctx.fillStyle = `${color} ${s.alpha * 0.35})`;
        ctx.fill();
        ctx.strokeStyle = `${color} ${s.alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none w-full h-full" />;
}
