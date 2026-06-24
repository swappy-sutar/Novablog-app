import React from "react";

const Loader = ({ 
  message = "Loading...", 
  size = "md", 
  fullPage = false 
}) => {
  // Size dimensions
  const sizes = {
    sm: { logo: 40, outerRing: 64, innerRing: 52, text: "text-xs" },
    md: { logo: 64, outerRing: 96, innerRing: 80, text: "text-sm" },
    lg: { logo: 96, outerRing: 140, innerRing: 120, text: "text-base" }
  };

  const currentSize = sizes[size] || sizes.md;

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6 select-none">
      {/* Animation Container */}
      <div 
        className="relative flex items-center justify-center" 
        style={{ width: currentSize.outerRing, height: currentSize.outerRing }}
      >
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-brand-purple/15 blur-2xl opacity-70 animate-pulse" />

        {/* Outer Orbital Ring (Counter-Clockwise Spin, Dashed) */}
        <svg 
          className="absolute animate-orbit-ccw" 
          width={currentSize.outerRing} 
          height={currentSize.outerRing} 
          viewBox="0 0 100 100"
        >
          <circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="transparent" 
            stroke="rgba(139, 92, 246, 0.15)" 
            strokeWidth="1" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="transparent" 
            stroke="rgba(139, 92, 246, 0.4)" 
            strokeWidth="1.5" 
            strokeDasharray="10 30" 
            strokeLinecap="round"
          />
        </svg>

        {/* Inner Orbital Ring (Clockwise Spin, Gradient Path) */}
        <svg 
          className="absolute animate-orbit-cw" 
          width={currentSize.innerRing} 
          height={currentSize.innerRing} 
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="loaderRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B5DE5" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#5B2A9E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D6B8FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            fill="transparent" 
            stroke="url(#loaderRingGrad)" 
            strokeWidth="2.5" 
            strokeDasharray="100 180"
            strokeLinecap="round"
          />
        </svg>

        {/* Central Logo (Breathing Pulsating Icon) */}
        <div 
          className="absolute flex items-center justify-center animate-logo-breathing"
          style={{ width: currentSize.logo, height: currentSize.logo }}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 160 160" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="loaderFlareGrad" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#D6B8FF"/>
                <stop offset="50%" stopColor="#9B5DE5"/>
                <stop offset="100%" stopColor="#5B2A9E"/>
              </linearGradient>
              <radialGradient id="loaderCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F4ECFF" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#C9A6FF" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <g transform="translate(78, 80)">
              <circle cx="0" cy="0" r="38" fill="url(#loaderCoreGlow)"/>
              <path d="M -44 42 C -26 24, -8 8, 3 -4 C 12 -14, 20 -28, 28 -48 L 34 -48 C 27 -22, 16 -4, 5 6 C -8 17, -25 28, -42 46 Z" fill="url(#loaderFlareGrad)"/>
              <path d="M -32 -28 C -19 -17, -8 -8, 0 0 C -12 -2, -25 -9, -38 -18 Z" fill="url(#loaderFlareGrad)"/>
              <circle cx="1" cy="-1" r="6" fill="#FBF7FF"/>
            </g>
          </svg>
        </div>
      </div>

      {/* Message Label (Futuristic Shimmer Text) */}
      {message && (
        <p className={`font-sans font-medium tracking-wide text-center bg-gradient-to-r from-gray-400 via-[#ffffff] to-gray-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer ${currentSize.text} max-w-xs light-mode-loader-text`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#04040c]/90 backdrop-blur-md transition-opacity duration-300">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
