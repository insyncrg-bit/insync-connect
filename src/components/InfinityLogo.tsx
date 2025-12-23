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
      height={size * 0.5} 
      viewBox="0 0 200 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer larger infinity loop */}
      <path 
        d="M 100,50 
           C 100,50 70,10 35,10 
           C 10,10 5,35 5,50 
           C 5,65 10,90 35,90 
           C 70,90 100,50 100,50 
           C 100,50 130,10 165,10 
           C 190,10 195,35 195,50 
           C 195,65 190,90 165,90 
           C 130,90 100,50 100,50 Z" 
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner smaller infinity loop */}
      <path 
        d="M 100,50 
           C 100,50 78,25 55,25 
           C 38,25 32,38 32,50 
           C 32,62 38,75 55,75 
           C 78,75 100,50 100,50 
           C 100,50 122,25 145,25 
           C 162,25 168,38 168,50 
           C 168,62 162,75 145,75 
           C 122,75 100,50 100,50 Z" 
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
