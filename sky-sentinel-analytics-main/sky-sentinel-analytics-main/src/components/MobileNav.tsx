import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Beaker, Radar, Gauge } from "lucide-react";

const navItems = [
  { path: "/", label: "Lab", icon: Beaker },
  { path: "/sentinel", label: "Live", icon: Radar },
  { path: "/simulator", label: "Sim", icon: Gauge },
];

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive && "drop-shadow-[0_0_10px_hsl(var(--primary))]"
              )} />
              <span className="text-[10px] font-mono uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
