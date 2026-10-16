import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RiskGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const RiskGauge = ({
  value,
  size = 200,
  strokeWidth = 12,
  className,
}: RiskGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animate the value
  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(startValue + (value - startValue) * easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 1.5; // 270 degrees
  const offset = circumference - (displayValue / 100) * circumference;
  
  const getColor = () => {
    if (displayValue < 35) return "hsl(var(--status-safe))";
    if (displayValue < 70) return "hsl(var(--status-caution))";
    return "hsl(var(--status-critical))";
  };
  
  const getGlowClass = () => {
    if (displayValue < 35) return "drop-shadow-[0_0_10px_hsl(var(--status-safe))]";
    if (displayValue < 70) return "drop-shadow-[0_0_10px_hsl(var(--status-caution))]";
    return "drop-shadow-[0_0_15px_hsl(var(--status-critical))]";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className={cn("-rotate-[135deg]", getGlowClass())}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        
        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset + circumference * 0.25}
          strokeLinecap="round"
          className="gauge-ring"
        />
        
        {/* Tick Marks */}
        {[0, 25, 50, 75, 100].map((tick, i) => {
          const angle = ((tick / 100) * 270 - 135) * (Math.PI / 180);
          const x1 = size / 2 + (radius - 15) * Math.cos(angle);
          const y1 = size / 2 + (radius - 15) * Math.sin(angle);
          const x2 = size / 2 + (radius + 5) * Math.cos(angle);
          const y2 = size / 2 + (radius + 5) * Math.sin(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      
      {/* Center Value Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold text-foreground">
          {Math.round(displayValue)}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          Risk %
        </span>
      </div>
    </div>
  );
};
