import { Zap, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "The Lab" },
  { path: "/sentinel", label: "Live Sentinel" },
  { path: "/simulator", label: "Simulator" },
];

export const Header = () => {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:shadow-glow transition-shadow">
            <Zap className="w-6 h-6 text-primary-foreground" />
            <div className="absolute inset-0 bg-primary rounded-lg animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-wider">
              <span className="text-primary">SKY</span>
              <span className="text-foreground">SENTINEL</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono tracking-[0.15em] uppercase">
              Fuzzy Logic Risk System
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-button",
                location.pathname === item.path && "active"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <Activity className="w-4 h-4 text-status-safe animate-pulse" />
            <span className="text-muted-foreground font-mono">ONLINE</span>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm text-foreground">
              {time.toLocaleTimeString('en-MY', { 
                timeZone: 'Asia/Kuala_Lumpur',
                hour12: false 
              })}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              UTC+8 MYT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
