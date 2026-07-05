'use client';

import React, { useEffect, useRef } from 'react';

interface AsciiAnimationProps {
  side: 'left' | 'right';
}

export default function AsciiAnimation({ side }: AsciiAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ASCII characters from dark to light
    const chars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];
    
    let animationFrameId: number;
    let A = 0; // rotation X
    let B = 0; // rotation Z

    const renderAscii = () => {
      // Clear canvas
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#9ca3af'; // text-gray-400
      ctx.font = '10px monospace';
      
      const width = 40; // number of characters horizontally
      const height = 40; // number of characters vertically
      
      const zBuffer: number[] = new Array(width * height).fill(0);
      const output: string[] = new Array(width * height).fill(' ');

      // Render a torus (donut) for the left side, and a sphere for the right side to make them different
      if (side === 'left') {
        // Torus math
        for (let j = 0; j < 6.28; j += 0.07) {
          for (let i = 0; i < 6.28; i += 0.02) {
            const c = Math.sin(i);
            const d = Math.cos(j);
            const e = Math.sin(A);
            const f = Math.sin(j);
            const g = Math.cos(A);
            const h = d + 2;
            const D = 1 / (c * h * e + f * g + 5);
            const l = Math.cos(i);
            const m = Math.cos(B);
            const n = Math.sin(B);
            const t = c * h * g - f * e;
            
            const x = Math.floor(width / 2 + 15 * D * (l * h * m - t * n));
            const y = Math.floor(height / 2 + 10 * D * (l * h * n + t * m));
            const o = x + width * y;
            const N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));
            
            if (y > 0 && y < height && x > 0 && x < width && D > zBuffer[o]) {
              zBuffer[o] = D;
              output[o] = chars[Math.max(0, N)];
            }
          }
        }
      } else {
        // Sphere math for the right side
        for (let j = 0; j < 6.28; j += 0.1) {
          for (let i = 0; i < 3.14; i += 0.05) {
            const sinI = Math.sin(i);
            const cosI = Math.cos(i);
            const sinJ = Math.sin(j);
            const cosJ = Math.cos(j);
            
            const x3d = sinI * cosJ;
            const y3d = sinI * sinJ;
            const z3d = cosI;
            
            // Rotate around X and Z
            const xRot = x3d * Math.cos(B) - y3d * Math.sin(B);
            const yRot = x3d * Math.sin(B) + y3d * Math.cos(B);
            const zRot = yRot * Math.sin(A) + z3d * Math.cos(A);
            const yRot2 = yRot * Math.cos(A) - z3d * Math.sin(A);
            
            const D = 1 / (zRot + 3);
            const x = Math.floor(width / 2 + 20 * D * xRot);
            const y = Math.floor(height / 2 + 10 * D * yRot2);
            const o = x + width * y;
            
            // Calculate luminance
            const N = Math.floor(8 * (xRot * 0.5 + yRot2 * 0.5 - zRot * 0.7));
            
            if (y > 0 && y < height && x > 0 && x < width && D > zBuffer[o]) {
              zBuffer[o] = D;
              output[o] = chars[Math.max(0, N)];
            }
          }
        }
      }

      // Draw output
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const char = output[i * width + j];
          if (char !== ' ') {
            ctx.fillText(char, j * 6, i * 10);
          }
        }
      }

      A += 0.04;
      B += 0.02;
      animationFrameId = requestAnimationFrame(renderAscii);
    };

    renderAscii();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [side]);

  return (
    <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-700 select-none pointer-events-none">
      <canvas 
        ref={canvasRef} 
        width={240} 
        height={400} 
        className="block"
      />
    </div>
  );
}
