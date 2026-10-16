import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface HudSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  color?: "primary" | "blue" | "orange" | "green";
  onChange: (value: number) => void;
  liveValue?: number;
  showLiveIndicator?: boolean;
}

export const HudSlider = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  color = "primary",
  onChange,
  liveValue,
  showLiveIndicator = false,
}: HudSliderProps) => {
  const colorClasses = {
    primary: "text-primary",
    blue: "text-blue-400",
    orange: "text-orange-400",
    green: "text-status-safe",
  };

  const percentage = ((value - min) / (max - min)) * 100;
  const livePercentage = liveValue !== undefined 
    ? ((liveValue - min) / (max - min)) * 100 
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <label className={cn("text-xs uppercase tracking-widest font-mono", colorClasses[color])}>
          {label}
        </label>

        <div className="flex flex-col items-end leading-none">
          <span className={cn("font-mono text-sm", colorClasses[color])}>
            {value} {unit}
          </span>

          {showLiveIndicator && liveValue !== undefined && (
            <span className="mt-1 text-[10px] text-muted-foreground font-mono whitespace-nowrap">
              LIVE {Math.round(liveValue)} {unit}
            </span>
          )}
        </div>
      </div>
      
      <div className="relative">
        {/* Background Bar with Gradient */}
        <div className="absolute inset-0 h-2 mt-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              color === "primary" && "bg-primary/50",
              color === "blue" && "bg-blue-500/50",
              color === "orange" && "bg-orange-500/50",
              color === "green" && "bg-status-safe/50"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Live Value Marker */}
        {showLiveIndicator && livePercentage !== null && (
          <div
            className="absolute top-2 w-0.5 h-6 bg-foreground/60 transition-all duration-500"
            style={{ left: `${livePercentage}%` }}
          />
        )}
        
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(v)}
          className={cn(
            "[&_[role=slider]]:h-5 [&_[role=slider]]:w-5",
            "[&_[role=slider]]:border-2",
            color === "primary" && "[&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:shadow-glow",
            color === "blue" && "[&_[role=slider]]:border-blue-400 [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:shadow-[0_0_15px_hsl(217_91%_60%/0.5)]",
            color === "orange" && "[&_[role=slider]]:border-orange-400 [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:shadow-[0_0_15px_hsl(25_95%_53%/0.5)]",
            color === "green" && "[&_[role=slider]]:border-status-safe [&_[role=slider]]:bg-status-safe [&_[role=slider]]:shadow-glow-safe"
          )}
        />
      </div>
    </div>
  );
};
