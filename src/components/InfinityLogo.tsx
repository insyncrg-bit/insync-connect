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
  strokeWidth = 1.5 
}: InfinityLogoProps) => {
  return (
    <svg 
      width={size} 
      height={size * 0.55} 
      viewBox="0 0 220 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer larger infinity loop - left side goes under, right side goes over */}
      <path 
        d="M 110,60 
           C 95,35 70,8 40,8 
           C 15,8 5,30 5,60 
           C 5,90 15,112 40,112 
           C 70,112 95,85 110,60 
           C 125,35 150,8 180,8 
           C 205,8 215,30 215,60 
           C 215,90 205,112 180,112 
           C 150,112 125,85 110,60" 
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner smaller infinity loop */}
      <path 
        d="M 110,60 
           C 100,45 82,25 58,25 
           C 38,25 28,40 28,60 
           C 28,80 38,95 58,95 
           C 82,95 100,75 110,60 
           C 120,45 138,25 162,25 
           C 182,25 192,40 192,60 
           C 192,80 182,95 162,95 
           C 138,95 120,75 110,60" 
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
