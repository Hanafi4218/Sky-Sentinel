import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import { getMembershipPoints, FuzzyMembership } from "@/utils/fuzzyEngine";

interface MembershipChartProps {
  type: "wind" | "humidity" | "temperature";
  currentValue: number;
  membership: FuzzyMembership;
  height?: number;
}

export const MembershipChart = ({
  type,
  currentValue,
  membership,
  height = 100,
}: MembershipChartProps) => {
  const data = useMemo(() => getMembershipPoints(type, 100), [type]);
  
  const maxX = type === "temperature" ? 50 : 100;
  
  const labels = {
    wind: { low: "Calm", medium: "Breezy", high: "Gale" },
    humidity: { low: "Dry", medium: "Moist", high: "Humid" },
    temperature: { low: "Cold", medium: "Optimal", high: "Hot" },
  };

  return (
    <div className="relative">
      <div className="flex justify-between mb-1 px-2">
        <span className="text-[10px] text-status-safe font-mono uppercase">
          {labels[type].low} ({(membership.low * 100).toFixed(0)}%)
        </span>
        <span className="text-[10px] text-status-caution font-mono uppercase">
          {labels[type].medium} ({(membership.medium * 100).toFixed(0)}%)
        </span>
        <span className="text-[10px] text-status-critical font-mono uppercase">
          {labels[type].high} ({(membership.high * 100).toFixed(0)}%)
        </span>
      </div>
      
      <div className="bg-background/50 rounded-lg border border-border/50 overflow-hidden">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`low-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--status-safe))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--status-safe))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id={`medium-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--status-caution))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--status-caution))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id={`high-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--status-critical))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--status-critical))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="x" 
              domain={[0, maxX]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              domain={[0, 1]} 
              hide 
            />
            
            <Area
              type="monotone"
              dataKey="low"
              stroke="hsl(var(--status-safe))"
              strokeWidth={2}
              fill={`url(#low-${type})`}
            />
            <Area
              type="monotone"
              dataKey="medium"
              stroke="hsl(var(--status-caution))"
              strokeWidth={2}
              fill={`url(#medium-${type})`}
            />
            <Area
              type="monotone"
              dataKey="high"
              stroke="hsl(var(--status-critical))"
              strokeWidth={2}
              fill={`url(#high-${type})`}
            />
            
            {/* Current Value Indicator */}
            <ReferenceLine
              x={currentValue}
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
