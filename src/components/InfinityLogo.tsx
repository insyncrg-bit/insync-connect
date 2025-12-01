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
      height={size * 0.5} 
      viewBox="0 0 100 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Slightly asymmetrical hollow infinity symbol */}
      <path 
        d="M 15,25 C 15,15 20,10 28,10 C 36,10 42,15 50,25 C 58,35 64,40 72,40 C 80,40 85,35 85,25 C 85,15 80,10 72,10 C 64,10 58,15 50,25 C 42,35 36,40 28,40 C 20,40 15,35 15,25 Z" 
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
