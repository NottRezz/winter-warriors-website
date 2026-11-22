"use client";

import { useEffect, useRef } from "react";

const FLAKES = 70;
const FLAKES_ON_PHONES = 28;

/** Light snowfall on a canvas. Stays off for visitors who prefer reduced motion. */
export function Snow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const small = window.matchMedia("(max-width: 64rem)").matches;
    const flakes = Array.from({ length: small ? FLAKES_ON_PHONES : FLAKES }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 0.6 + Math.random() * 1.6,
      speed: 0.00025 + Math.random() * 0.0005,
      sway: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(238, 243, 247, 0.55)";
      for (const flake of flakes) {
        flake.y += flake.speed;
        flake.sway += 0.006;
        if (flake.y > 1.02) {
          flake.y = -0.02;
          flake.x = Math.random();
        }
        context.beginPath();
        context.arc(
          flake.x * width + Math.sin(flake.sway) * 14,
          flake.y * height,
          flake.radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    // Stops once it's scrolled away, to save batteries over a long day at the rink.
    const visibility = new IntersectionObserver((entries) => {
      cancelAnimationFrame(frame);
      if (entries[entries.length - 1].isIntersecting) frame = requestAnimationFrame(draw);
    });
    visibility.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
