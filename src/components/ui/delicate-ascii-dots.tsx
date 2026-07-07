'use client';

import { useEffect, useRef, useCallback } from 'react';

interface DelicateAsciiDotsProps {
  backgroundColor?: string;
  textColor?: string;
  gridSize?: number;
  removeWaveLine?: boolean;
  animationSpeed?: number;
}

interface Wave {
  x: number;
  y: number;
  frequency: number;
  amplitude: number;
  phase: number;
  speed: number;
}

interface GridCell {
  char: string;
  opacity: number;
}

const DelicateAsciiDots = ({
  backgroundColor = '#F0EEE6',
  textColor = '100, 100, 100',
  gridSize = 80,
  removeWaveLine = true,
  animationSpeed = 0.75,
}: DelicateAsciiDotsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const wavesRef = useRef<Wave[]>([]);
  const timeRef = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const clickWaves = useRef<
    Array<{ x: number; y: number; time: number; intensity: number }>
  >([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const CHARS =
    '⣧⣩⣪⣫⣬⣭⣮⣯⣱⣲⣳⣴⣵⣶⣷⣹⣺⣻⣼⣽⣾⣿⣧⣩⣪⣫⣬⣭⣮⣯⣱⣲⣳⣴⣵⣶⣷⣹⣺⣻⣼⣽⣾⣿⣧⣩⣪⣫⣬⣭⣮⣯⣱⣲⣳⣴⣵⣶⣷⣹⣺⣻⣼⣽⣾⣿⣧⣩⣪⣫⣬⣭⣮⣯⣱⣲⣳⣴⣵⣶⣷⣹⣺⣻⣼⣽⣾⣿⣧⣩⣪⣫⣬⣭⣮⣯⣱⣲⣳⣴⣵⣶⣷⣹⣺⣻⣼⣽⣾⣿⣧⣩⣪⣫⣬⣭⣮⣯⣱⣲⣳⣴⣵⣶⣷⣹⣺⣻⣼⣽⣾⣿⠁⠂⠄⠈⠐⠠⡀⢀⠃⠅⠘⠨⠊⠋⠌⠍⠎⠏⠑⠒⠓⠔⠕⠖⠗⠙⠚⠛⠜⠝⠞⠟⠡⠢⠣⠤⠥⠦⠧⠩⠪⠫⠬⠭⠮⠯⠱⠲⠳⠴⠵⠶⠷⠹⠺⠻⠼⠽⠾⠿⡁⡂⡃⡄⡅⡆⡇⡉⡊⡋⡌⡍⡎⡏⡑⡒⡓⡔⡕⡖⡗⡙⡚⡛⡜⡝⡞⡟⡡⡢⡣⡤⡥⡦⡧⡩⡪⡫⡬⡭⡮⡯⡱⡲⡳⡴⡵⡶⡷⡹⡺⡻⡼⡽⡾⡿⢁⢂⢃⢄⢅⢆⢇⢉⢊⢋⢌⢍⢎⢏⢑⢒⢓⢔⢕⢖⢗⢙⢚⢛⢜⢝⢞⢟⢡⢢⢣⢤⢥⢦⢧⢩⢪⢫⢬⢭⢮⢯⢱⢲⢳⢴⢵⢶⢷⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣉⣊⣋⣌⣍⣎⣏⣑⣒⣓⣔⣕⣖⣗⣙⣚⣛⣜⣝⣞⣟⣡⣢⣣⣤⣥⣦⣧⣩⣪⣫⣬⣭⣮⣯⣱⣲⣳⣴⣵⣶⣷⣹⣺⣻⣼⣽⣾⣿';

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    // Store dimensions for coordinate calculations
    dimensionsRef.current = { width, height };

    const dpr = window.devicePixelRatio || 1;

    // Set canvas size to match container
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current = {
      x: x,
      y: y,
      isDown: mouseRef.current.isDown,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert screen coordinates to grid coordinates
      const { width, height } = dimensionsRef.current;
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;

      const gridX = x / cellWidth;
      const gridY = y / cellHeight;

      clickWaves.current.push({
        x: gridX,
        y: gridY,
        time: Date.now(),
        intensity: 2,
      });

      // Clean up old waves
      const now = Date.now();
      clickWaves.current = clickWaves.current.filter(
        (wave) => now - wave.time < 4000
      );
    },
    [gridSize]
  );

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const getClickWaveInfluence = (
    x: number,
    y: number,
    currentTime: number
  ): number => {
    let totalInfluence = 0;

    clickWaves.current.forEach((wave) => {
      const age = currentTime - wave.time;
      const maxAge = 4000;
      if (age < maxAge) {
        const dx = x - wave.x;
        const dy = y - wave.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const waveRadius = (age / maxAge) * gridSize * 0.8;
        const waveWidth = gridSize * 0.15;

        if (Math.abs(distance - waveRadius) < waveWidth) {
          const waveStrength = (1 - age / maxAge) * wave.intensity;
          const proximityToWave =
            1 - Math.abs(distance - waveRadius) / waveWidth;
          totalInfluence +=
            waveStrength *
            proximityToWave *
            Math.sin((distance - waveRadius) * 0.5);
        }
      }
    });

    return totalInfluence;
  };

  const animate = useCallback(() => {
    if (!isInViewRef.current) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentTime = Date.now();
    timeRef.current += animationSpeed * 0.016;

    const { width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const newGrid: (GridCell | null)[][] = Array(gridSize)
      .fill(0)
      .map(() => Array(gridSize).fill(null));

    // Calculate cell dimensions
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    // Convert mouse position to grid coordinates
    const mouseGridX = mouseRef.current.x / cellWidth;
    const mouseGridY = mouseRef.current.y / cellHeight;

    // Create mouse wave
    const mouseWave: Wave = {
      x: mouseGridX,
      y: mouseGridY,
      frequency: 0.3,
      amplitude: 1,
      phase: timeRef.current * 2,
      speed: 1,
    };

    const fixedWavesGrid = fixedWavesGridRef.current;

    // Calculate wave interference
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        let totalWave = 0;

        if (fixedWavesGrid && fixedWavesGrid[y] && fixedWavesGrid[y][x]) {
          const cellWaves = fixedWavesGrid[y][x];
          for (let i = 0; i < wavesRef.current.length; i++) {
            const w = wavesRef.current[i];
            const cw = cellWaves[i];
            totalWave += Math.sin(cw.phaseOffset - timeRef.current * w.speed) * cw.ampFalloff;
          }
        }

        // Add mouse wave
        const dx = x - mouseWave.x;
        const dy = y - mouseWave.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const falloff = 1 / (1 + dist * 0.1);
        totalWave += Math.sin(dist * mouseWave.frequency - timeRef.current * mouseWave.speed + mouseWave.phase) * mouseWave.amplitude * falloff;

        // Add click wave influence
        const clickInfluence = getClickWaveInfluence(x, y, currentTime);
        totalWave += clickInfluence;

        // Enhanced mouse interaction
        const mouseDistance = Math.sqrt(
          (x - mouseGridX) ** 2 + (y - mouseGridY) ** 2
        );
        if (mouseDistance < gridSize * 0.3) {
          const mouseEffect = (1 - mouseDistance / (gridSize * 0.3)) * 0.8;
          totalWave += mouseEffect * Math.sin(timeRef.current * 3);
        }

        // Map interference pattern to characters and opacity
        const normalizedWave = (totalWave + 2) / 4;
        if (Math.abs(totalWave) > 0.2) {
          const charIndex = Math.min(
            CHARS.length - 1,
            Math.max(0, Math.floor(normalizedWave * (CHARS.length - 1)))
          );
          const opacity = Math.min(
            0.9,
            Math.max(0.4, 0.4 + normalizedWave * 0.5)
          );

          newGrid[y][x] = {
            char: CHARS[charIndex] || CHARS[0],
            opacity: opacity,
          };
        }
      }
    }

    // Calculate optimal font size
    const fontSize = Math.min(cellWidth, cellHeight) * 0.8;
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw characters
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = newGrid[y][x];
        if (cell && cell.char && CHARS.includes(cell.char)) {
          ctx.fillStyle = `rgba(${textColor}, ${cell.opacity})`;
          ctx.fillText(
            cell.char,
            x * cellWidth + cellWidth / 2,
            y * cellHeight + cellHeight / 2
          );
        }
      }
    }

    // Draw click wave effects (visual ripples)
    if (!removeWaveLine) {
      clickWaves.current.forEach((wave) => {
        const age = currentTime - wave.time;
        const maxAge = 4000;
        if (age < maxAge) {
          const progress = age / maxAge;
          const radius = progress * Math.min(width, height) * 0.5;
          const alpha = (1 - progress) * 0.3 * wave.intensity;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${textColor}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.arc(
            wave.x * cellWidth,
            wave.y * cellHeight,
            radius,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        }
      });
    }

    animationFrameId.current = requestAnimationFrame(animate);
  }, [backgroundColor, textColor, gridSize, animationSpeed, removeWaveLine]);

  const fixedWavesGridRef = useRef<any>(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    // Initialize background waves
    const waves: Wave[] = [];
    const numWaves = 4;

    for (let i = 0; i < numWaves; i++) {
      waves.push({
        x: gridSize * (0.25 + Math.random() * 0.5),
        y: gridSize * (0.25 + Math.random() * 0.5),
        frequency: 0.2 + Math.random() * 0.3,
        amplitude: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
      });
    }

    wavesRef.current = waves;

    // Precalculate wave properties per cell
    const grid = [];
    for (let y = 0; y < gridSize; y++) {
      const row = [];
      for (let x = 0; x < gridSize; x++) {
        const cellWaves = waves.map(w => {
          const dx = x - w.x;
          const dy = y - w.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const falloff = 1 / (1 + dist * 0.1);
          return {
            phaseOffset: dist * w.frequency + w.phase,
            ampFalloff: w.amplitude * falloff
          };
        });
        row.push(cellWaves);
      }
      grid.push(row);
    }
    fixedWavesGridRef.current = grid;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Initial resize
    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver((entries) => {
      isInViewRef.current = entries[0].isIntersecting;
    }, { threshold: 0 });
    intersectionObserver.observe(container);

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Start animation
    animate();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      timeRef.current = 0;
      clickWaves.current = [];
      wavesRef.current = [];
    };
  }, [
    animate,
    resizeCanvas,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    gridSize,
  ]);

  return (
    <div
      ref={containerRef}
      className='absolute inset-0 w-full h-full overflow-hidden'
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className='block w-full h-full' />
    </div>
  );
};

export default DelicateAsciiDots;
