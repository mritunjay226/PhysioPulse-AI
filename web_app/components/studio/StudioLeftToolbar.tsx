'use client';

import React from 'react';
import {
  PenTool,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Layers,
  Hand,
  Maximize2
} from 'lucide-react';

export interface StudioLeftToolbarProps {
  activeTool: 'pointer' | 'zoom' | 'pan' | 'layers';
  setActiveTool: (tool: 'pointer' | 'zoom' | 'pan' | 'layers') => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  setRotationAngle: React.Dispatch<React.SetStateAction<number>>;
}

export function StudioLeftToolbar({
  activeTool,
  setActiveTool,
  zoomLevel,
  setZoomLevel,
  setRotationAngle
}: StudioLeftToolbarProps) {
  return (
    <div className="absolute left-6 top-6 z-20 hidden lg:flex flex-col items-center bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-md border border-slate-200/80 gap-1 select-none">
      <button
        onClick={() => setActiveTool('pointer')}
        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
          activeTool === 'pointer'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Pointer (Select Kinetic Chains)"
      >
        <PenTool className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          setActiveTool('zoom');
          setZoomLevel((prev) => Math.min(prev + 0.1, 1.4));
        }}
        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
          activeTool === 'zoom'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title={`Zoom In (${Math.round(zoomLevel * 100)}%)`}
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <button
        onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.8))}
        className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <button
        onClick={() => setRotationAngle((prev) => (prev + 45) % 360)}
        className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
        title="Rotate Anatomy 45°"
      >
        <RotateCw className="w-4 h-4" />
      </button>

      <button
        onClick={() => setActiveTool('layers')}
        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
          activeTool === 'layers'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Toggle Musculoskeletal Layers"
      >
        <Layers className="w-4 h-4" />
      </button>

      <button
        onClick={() => setActiveTool('pan')}
        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
          activeTool === 'pan'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Pan Viewport"
      >
        <Hand className="w-4 h-4" />
      </button>

      <div className="w-5 h-[1px] bg-slate-200 my-1" />

      <button
        onClick={() => {
          setZoomLevel(1);
          setRotationAngle(15);
        }}
        className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
        title="Reset Stage View"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}
