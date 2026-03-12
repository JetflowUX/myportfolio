'use client';

export function SpatialCanvas() {
  return (
    <div className="bento-card p-6 sm:p-8 flex flex-col justify-between bg-black overflow-hidden relative group h-full min-h-[280px] sm:min-h-[420px] lg:min-h-[500px]">
      <div className="relative z-10">
        <span className="text-xs text-gray-500 font-mono">{'// Precision_Engine'}</span>
        <h3 className="text-xl font-bold mt-2">Math-to-Design</h3>
      </div>

      {/* Rotating SVG geometry */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-500">
        <svg
          className="w-48 h-48 animate-spin-slow"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="45" fill="none" stroke="#00FFC2" strokeWidth="0.5" strokeDasharray="1 4" />
          <path d="M 50 5 L 95 50 L 50 95 L 5 50 Z" fill="none" stroke="#00FFC2" strokeWidth="1" />
          <circle cx="50" cy="50" r="2" fill="#00FFC2" />
        </svg>
      </div>

      <p className="relative z-10 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
        Applying Euclidean principles to Layout Systems
      </p>
    </div>
  );
}
