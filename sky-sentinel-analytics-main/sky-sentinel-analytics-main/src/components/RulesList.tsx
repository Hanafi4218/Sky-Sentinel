import { cn } from "@/lib/utils";
import { RuleResult } from "@/utils/fuzzyEngine";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RulesListProps {
  rules: RuleResult[];
  maxHeight?: number;
}

export const RulesList = ({ rules, maxHeight = 400 }: RulesListProps) => {
  // Sort by firing strength (active rules first)
  const sortedRules = [...rules].sort((a, b) => b.firingStrength - a.firingStrength);
  const activeRules = sortedRules.filter(r => r.active);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs text-primary uppercase tracking-widest font-display">
          Logic Rules
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          {activeRules.length}/27 Active
        </span>
      </div>
      
      <ScrollArea className="pr-4" style={{ maxHeight }}>
        <div className="space-y-2">
          {sortedRules.map((rule) => (
            <div
              key={rule.ruleId}
              className={cn(
                "p-2 rounded-lg border transition-all duration-300 font-mono text-[10px]",
                rule.active
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/20 bg-background/30 opacity-40"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">R{rule.ruleId.toString().padStart(2, '0')}</span>
                
                <div className="flex-1 flex items-center gap-1 flex-wrap">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded",
                    rule.inputs.wind === 'Low' && "bg-status-safe/20 text-status-safe",
                    rule.inputs.wind === 'Medium' && "bg-status-caution/20 text-status-caution",
                    rule.inputs.wind === 'High' && "bg-status-critical/20 text-status-critical"
                  )}>
                    W:{rule.inputs.wind[0]}
                  </span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded",
                    rule.inputs.humidity === 'Low' && "bg-status-safe/20 text-status-safe",
                    rule.inputs.humidity === 'Medium' && "bg-status-caution/20 text-status-caution",
                    rule.inputs.humidity === 'High' && "bg-status-critical/20 text-status-critical"
                  )}>
                    H:{rule.inputs.humidity[0]}
                  </span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded",
                    rule.inputs.temperature === 'Low' && "bg-status-safe/20 text-status-safe",
                    rule.inputs.temperature === 'Medium' && "bg-status-caution/20 text-status-caution",
                    rule.inputs.temperature === 'High' && "bg-status-critical/20 text-status-critical"
                  )}>
                    T:{rule.inputs.temperature[0]}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded font-semibold",
                    rule.output === 'Stable' && "bg-status-safe/20 text-status-safe",
                    rule.output === 'Caution' && "bg-status-caution/20 text-status-caution",
                    rule.output === 'Critical' && "bg-status-critical/20 text-status-critical"
                  )}>
                    {rule.output}
                  </span>
                </div>
                
                <span className={cn(
                  "font-bold min-w-[40px] text-right",
                  rule.active ? "text-primary" : "text-muted-foreground"
                )}>
                  {(rule.firingStrength * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
