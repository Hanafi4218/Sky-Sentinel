import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, XOctagon } from "lucide-react";

interface StatusBadgeProps {
  status: "Stable" | "Caution" | "Critical";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  animate?: boolean;
}

export const StatusBadge = ({
  status,
  size = "md",
  showIcon = true,
  animate = true,
}: StatusBadgeProps) => {
  const Icon = status === "Stable" 
    ? CheckCircle2 
    : status === "Caution" 
    ? AlertTriangle 
    : XOctagon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-display font-bold uppercase tracking-wider",
        size === "sm" && "text-sm",
        size === "md" && "text-lg",
        size === "lg" && "text-3xl",
        status === "Stable" && "status-safe",
        status === "Caution" && "status-caution",
        status === "Critical" && [
          "status-critical",
          animate && "animate-pulse-critical",
        ]
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            size === "sm" && "w-4 h-4",
            size === "md" && "w-5 h-5",
            size === "lg" && "w-8 h-8"
          )}
        />
      )}
      <span>{status}</span>
    </div>
  );
};
