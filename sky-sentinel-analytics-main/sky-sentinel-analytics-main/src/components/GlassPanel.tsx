import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "subtle";
  glow?: boolean;
}

export const GlassPanel = ({
  children,
  className,
  variant = "default",
  glow = false,
}: GlassPanelProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        variant === "default" && "glass-panel",
        variant === "strong" && "glass-panel-strong",
        variant === "subtle" && "bg-card/40 backdrop-blur-lg border border-border/30 rounded-xl",
        glow && "animate-glow-pulse",
        className
      )}
    >
      {children}
    </div>
  );
};
