interface InfinityLogoProps {
  size?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export const InfinityLogo = ({ 
  size = 48, 
  className = "", 
  strokeColor = "currentColor",
  strokeWidth = 2 
}: InfinityLogoProps) => {
  return (
    <svg 
      width={size} 
      height={size * 0.4} 
      viewBox="0 0 240 96" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer larger infinity loop */}
      <path 
        d="M 15,48 Q 15,15 45,15 Q 75,15 95,35 Q 115,55 120,48 Q 125,41 145,21 Q 165,1 195,1 Q 225,1 225,34 Q 225,67 195,67 Q 165,67 145,47 Q 125,27 120,34 Q 115,41 95,61 Q 75,81 45,81 Q 15,81 15,48 Z" 
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner smaller infinity loop */}
      <path 
        d="M 50,48 Q 50,30 65,30 Q 80,30 92,42 Q 104,54 107,48 Q 110,42 122,30 Q 134,18 149,18 Q 164,18 164,33 Q 164,48 149,48 Q 134,48 122,36 Q 110,24 107,30 Q 104,36 92,48 Q 80,60 65,60 Q 50,60 50,48 Z" 
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.85}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
