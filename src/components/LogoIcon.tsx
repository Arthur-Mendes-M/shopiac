import { cn } from '@/lib/utils';
import React from 'react';

interface LogoIconProps {
  className?: string;
}

// Favicon version - just the shield icon
export const LogoIcon: React.FC<LogoIconProps> = ({ className = "" }) => {
  // return (
  //   <svg
  //     viewBox="0 0 80 100"
  //     className={`fill-current ${className}`}
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     {/* Shield Background */}
  //     <path
  //       d="M40 5 L10 20 Q10 30 10 50 Q10 85 40 95 Q70 85 70 50 Q70 30 70 20 Z"
  //       fill="#1a1a1a"
  //       stroke="#dc2626"
  //       strokeWidth="2"
  //     />
      
  //     {/* Inner Shield */}
  //     <path
  //       d="M40 10 L15 22 Q15 30 15 50 Q15 80 40 88 Q65 80 65 50 Q65 30 65 22 Z"
  //       fill="#f5f5f5"
  //     />
      
  //     {/* Chief Head Silhouette */}
  //     <g transform="translate(40, 35)">
  //       {/* Head */}
  //       <circle cx="0" cy="0" r="12" fill="#1a1a1a" />
        
  //       {/* Feathers */}
  //       <path
  //         d="M-8 -10 Q-12 -15 -10 -18 Q-8 -15 -6 -12"
  //         fill="#dc2626"
  //       />
  //       <path
  //         d="M-2 -12 Q-4 -17 -2 -20 Q0 -17 2 -14"
  //         fill="#dc2626"
  //       />
  //       <path
  //         d="M6 -11 Q4 -16 6 -19 Q8 -16 10 -13"
  //         fill="#dc2626"
  //       />
        
  //       {/* Face details */}
  //       <path
  //         d="M-6 -2 Q0 -6 6 -2 Q4 2 0 4 Q-4 2 -6 -2 Z"
  //         fill="#f5f5f5"
  //       />
  //     </g>
      
  //     {/* Shield Bottom Pattern */}
  //     <path
  //       d="M20 60 L40 65 L60 60 L55 75 L40 80 L25 75 Z"
  //       fill="#6b7280"
  //       stroke="#1a1a1a"
  //       strokeWidth="1"
  //     />
  //   </svg>
  // );

  return (
    <img src="/cropped_logo.png" alt="Logo do Itaquá Athlético Clube" className={cn("", className)} />
  )
};