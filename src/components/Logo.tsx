import React from 'react';
import { LogoIcon } from './LogoIcon';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* SVG Logo - Shield with Chief */}
      <LogoIcon className="h-12" />

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