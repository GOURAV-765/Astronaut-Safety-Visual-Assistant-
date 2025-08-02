import React, { useEffect, useRef } from 'react';

const CameraFeed: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 640;
    canvas.height = 480;

    // Simulate space station interior
    const drawSpaceStationView = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw metallic walls with panels
      ctx.fillStyle = '#2d2d44';
      ctx.fillRect(0, 0, canvas.width, 80);
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

      // Draw grid pattern on walls
      ctx.strokeStyle = '#404066';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 80);
        ctx.moveTo(i, canvas.height - 80);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw some equipment/machinery silhouettes
      ctx.fillStyle = '#333355';
      ctx.fillRect(50, 100, 60, 80);
      ctx.fillRect(400, 120, 80, 100);
      ctx.fillRect(250, 200, 40, 60);

      // Add some lighting effects
      const gradient = ctx.createRadialGradient(320, 240, 0, 320, 240, 200);
      gradient.addColorStop(0, 'rgba(100, 150, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some floating particles to simulate space station atmosphere
      const time = Date.now() * 0.001;
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time + i) * 50 + canvas.width / 2 + i * 30) % canvas.width;
        const y = (Math.cos(time * 0.7 + i) * 30 + canvas.height / 2 + i * 20) % canvas.height;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(time + i) * 0.05})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw tool shadows/placeholders where tools might be
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      
      // Fire extinguisher shadow
      ctx.fillRect(150, 290, 70, 150);
      
      // Oxygen tank shadow
      ctx.fillRect(320, 250, 85, 140);
      
      // Toolbox shadow
      ctx.fillRect(480, 330, 90, 70);

      // Request next frame
      animationRef.current = requestAnimationFrame(drawSpaceStationView);
    };

    drawSpaceStationView();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ maxHeight: '480px' }}
      />
      
      {/* Camera overlay elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-green-500 shadow-lg"></div>
        <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-green-500 shadow-lg"></div>
        <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-green-500 shadow-lg"></div>
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-green-500 shadow-lg"></div>
        
        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-2 border-green-500 opacity-75 shadow-lg">
            <div className="absolute top-1/2 left-1/2 w-4 h-1 bg-green-500 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-green-500 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;