"use client";

import { useRef, useEffect } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let drawing = false;

    const startDraw = (e: MouseEvent) => {
      drawing = true;
      draw(e);
    };
    const endDraw = () => (drawing = false);
    const draw = (e: MouseEvent) => {
      if (!drawing || !ctx) return;
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mousemove", draw);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="border shadow rounded-md bg-white" />
  );
}
