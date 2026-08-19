import React from 'react';

/**
 * SentinelSketchLogo — White outline/sketch version of the Sentinel mask
 * for use in the top-left logo. Lightweight SVG, no WebGL.
 */
export const SentinelSketchLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 52,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {/* Left Ear / Antenna Horn */}
      <path
        d="M14 8 L8 28 L20 30 L24 22 Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right Ear / Antenna Horn */}
      <path
        d="M50 8 L56 28 L44 30 L40 22 Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Crown / Forehead Crest */}
      <path
        d="M20 30 L32 18 L44 30 L38 28 L32 24 L26 28 Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Forehead Diamond Jewel */}
      <path
        d="M32 24 L29 28 L32 32 L35 28 Z"
        stroke="white"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Visor / Eye Slit */}
      <path
        d="M14 32 L26 30 L32 33 L38 30 L50 32 L44 36 L38 34 L32 37 L26 34 L20 36 Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left Cheek Plate */}
      <path
        d="M14 32 L20 36 L22 46 L10 40 Z"
        stroke="white"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right Cheek Plate */}
      <path
        d="M50 32 L44 36 L42 46 L54 40 Z"
        stroke="white"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center Face / Nose Bridge */}
      <path
        d="M26 34 L32 37 L38 34 L36 44 L32 48 L28 44 Z"
        stroke="white"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Chin Guard */}
      <path
        d="M22 46 L28 44 L32 48 L36 44 L42 46 L38 54 L32 58 L26 54 Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Chin Highlight / Bottom Detail */}
      <path
        d="M30 52 L32 56 L34 52"
        stroke="white"
        strokeWidth="1.0"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
