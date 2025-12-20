import { useEffect, useRef } from "react";

export const AnimatedInfinity = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawInfinity = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const scale = Math.min(w, h) * 0.35;

      // Draw multiple flowing infinity paths
      const layers = [
        { offset: 0, alpha: 0.6, width: 2, color: "6, 182, 212" },
        { offset: 0.33, alpha: 0.4, width: 1.5, color: "34, 211, 238" },
        { offset: 0.66, alpha: 0.2, width: 1, color: "103, 232, 249" },
      ];

      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${layer.color}, ${layer.alpha})`;
        ctx.lineWidth = layer.width;
        ctx.lineCap = "round";

        // Parametric infinity curve (lemniscate)
        const points = 200;
        for (let i = 0; i <= points; i++) {
          const t = (i / points) * Math.PI * 2 + time + layer.offset;
          const denominator = 1 + Math.sin(t) * Math.sin(t);
          const x = centerX + (scale * Math.cos(t)) / denominator;
          const y = centerY + (scale * Math.sin(t) * Math.cos(t)) / denominator;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Glowing particles traveling along the path
      const particleCount = 6;
      for (let p = 0; p < particleCount; p++) {
        const t = time * 1.5 + (p / particleCount) * Math.PI * 2;
        const denominator = 1 + Math.sin(t) * Math.sin(t);
        const x = centerX + (scale * Math.cos(t)) / denominator;
        const y = centerY + (scale * Math.sin(t) * Math.cos(t)) / denominator;

        // Particle glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
        gradient.addColorStop(0, "rgba(34, 211, 238, 0.8)");
        gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.3)");
        gradient.addColorStop(1, "rgba(6, 182, 212, 0)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.008;
      animationId = requestAnimationFrame(drawInfinity);
    };

    drawInfinity();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    />
  );
};
