import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, RotateCcw } from 'lucide-react';

/**
 * PanoramaViewer - A 360° panoramic image viewer using CSS 3D transforms
 * This provides a lightweight VR-like experience without external dependencies
 */
export default function PanoramaViewer({ 
  imageUrl, 
  onHotspotClick,
  hotspots = [],
  className = '' 
}) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Auto-rotate effect
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + 0.1
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.2)),
      y: prev.y + deltaX * 0.2
    }));
    
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    
    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.2)),
      y: prev.y + deltaX * 0.2
    }));
    
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* 360 View Container */}
      <div 
        className="absolute inset-0 transition-transform duration-100"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Panoramic Image */}
        <img
          src={imageUrl}
          alt="360 View"
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
          draggable={false}
        />

        {/* Hotspots */}
        {hotspots.map((hotspot, index) => (
          <button
            key={index}
            className="absolute group"
            style={{
              left: hotspot.x,
              top: hotspot.y,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onHotspotClick?.(hotspot);
            }}
          >
            <div className="relative flex items-center justify-center w-8 h-8">
              <span className="absolute w-full h-full bg-white rounded-full opacity-30 animate-ping"></span>
              <div className="relative w-4 h-4 bg-white rounded-full shadow-lg"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {hotspot.label}
            </div>
          </button>
        ))}
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <button
          onClick={resetView}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => containerRef.current?.requestFullscreen?.()}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          title="Fullscreen"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full z-10">
        Drag to look around • Scroll to zoom
      </div>
    </div>
  );
}
