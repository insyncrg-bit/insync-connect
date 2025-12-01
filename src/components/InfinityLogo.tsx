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
      height={size * 0.45} 
      viewBox="0 0 200 90" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer infinity loop */}
      <path 
        d="M 10,45 C 10,20 25,5 45,5 C 65,5 80,20 100,45 C 120,70 135,85 155,85 C 175,85 190,70 190,45 C 190,20 175,5 155,5 C 135,5 120,20 100,45 C 80,70 65,85 45,85 C 25,85 10,70 10,45 Z" 
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner infinity loop (slightly offset) */}
      <path 
        d="M 35,45 C 35,32 42,25 52,25 C 62,25 69,32 80,45 C 91,58 98,65 108,65 C 118,65 125,58 125,45 C 125,32 118,25 108,25 C 98,25 91,32 80,45 C 69,58 62,65 52,65 C 42,65 35,58 35,45 Z" 
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
    </svg>
  );
};
