import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* SVG Logo - Shield with Chief */}
      <svg
        viewBox="0 0 80 100"
        className="w-10 h-12 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield Background */}
        <path
          d="M40 5 L10 20 Q10 30 10 50 Q10 85 40 95 Q70 85 70 50 Q70 30 70 20 Z"
          className="fill-muted stroke-border stroke-2"
        />
        
        {/* Inner Shield */}
        <path
          d="M40 10 L15 22 Q15 30 15 50 Q15 80 40 88 Q65 80 65 50 Q65 30 65 22 Z"
          className="fill-card"
        />
        
        {/* Chief Head Silhouette */}
        <g transform="translate(40, 35)">
          {/* Head */}
          <circle cx="0" cy="0" r="12" className="fill-foreground" />
          
          {/* Feathers */}
          <path
            d="M-8 -10 Q-12 -15 -10 -18 Q-8 -15 -6 -12"
            className="fill-destructive"
          />
          <path
            d="M-2 -12 Q-4 -17 -2 -20 Q0 -17 2 -14"
            className="fill-destructive"
          />
          <path
            d="M6 -11 Q4 -16 6 -19 Q8 -16 10 -13"
            className="fill-destructive"
          />
          
          {/* Face details */}
          <path
            d="M-6 -2 Q0 -6 6 -2 Q4 2 0 4 Q-4 2 -6 -2 Z"
            className="fill-card"
          />
        </g>
        
        {/* Shield Bottom Pattern */}
        <path
          d="M20 60 L40 65 L60 60 L55 75 L40 80 L25 75 Z"
          className="fill-muted stroke-border stroke-1"
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-xl text-foreground">
            SHOP <span className="text-destructive">IAC</span>
          </span>
          <span className="text-xs text-muted-foreground leading-tight">
            ITAQUÁ ATLÉTICO CLUBE
          </span>
        </div>
      )}
    </div>
  );
};