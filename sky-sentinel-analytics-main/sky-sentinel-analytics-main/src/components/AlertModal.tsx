import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Send, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { sendTelegramAlert, TelegramResponse } from "@/utils/telegramService";
import { useToast } from "@/hooks/use-toast";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  dangerLevel: number;
  location?: string;
  wind?: number;
  humidity?: number;
  temperature?: number;
}

export const AlertModal = ({
  open,
  onClose,
  dangerLevel,
  location = "Unknown Location",
  wind = 0,
  humidity = 0,
  temperature = 0,
}: AlertModalProps) => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendAlert = async () => {
    setSending(true);
    
    const result: TelegramResponse = await sendTelegramAlert({
      location,
      wind,
      humidity,
      temperature,
      riskPercentage: dangerLevel,
    });

    setSending(false);

    if (result.success) {
      toast({
        title: "Alert Sent!",
        description: "Telegram notification delivered successfully.",
      });
      onClose();
    } else {
      toast({
        title: "Failed to Send",
        description: result.error || "Could not send Telegram alert.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel-strong border-status-critical/50 max-w-md">
        <div className="absolute inset-0 bg-status-critical/5 rounded-xl animate-pulse-critical pointer-events-none" />
        
        <DialogHeader className="relative">
          <div className="mx-auto w-16 h-16 bg-status-critical/20 rounded-full flex items-center justify-center mb-4 animate-pulse-critical">
            <AlertTriangle className="w-8 h-8 text-status-critical" />
          </div>
          
          <DialogTitle className="text-center font-display text-2xl status-critical">
            CRITICAL ALERT
          </DialogTitle>
          
          <div className="text-center space-y-2">
            <span className="text-foreground block">
              Danger level has reached <span className="text-status-critical font-bold">{dangerLevel.toFixed(1)}%</span>
            </span>
            <span className="text-muted-foreground text-sm block">
              Location: {location}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Warning Message */}
          <div className="p-4 rounded-lg bg-status-critical/10 border border-status-critical/30">
            <span className="text-sm text-status-critical font-mono block">
              ⚠️ Environmental conditions are hazardous. UAV/Drone operations NOT recommended. 
              Outdoor activities should be suspended.
            </span>
          </div>

          {/* Telemetry Summary */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-background/30 rounded border border-border/30">
              <span className="text-[10px] text-muted-foreground uppercase block">Wind</span>
              <span className="text-sm font-mono text-foreground block">{wind} km/h</span>
            </div>
            <div className="p-2 bg-background/30 rounded border border-border/30">
              <span className="text-[10px] text-muted-foreground uppercase block">Humidity</span>
              <span className="text-sm font-mono text-foreground block">{humidity}%</span>
            </div>
            <div className="p-2 bg-background/30 rounded border border-border/30">
              <span className="text-[10px] text-muted-foreground uppercase block">Temp</span>
              <span className="text-sm font-mono text-foreground block">{temperature}°C</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-border hover:border-primary"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              Dismiss
            </Button>
            
            <Button
              className="flex-1 bg-status-critical hover:bg-status-critical/90 text-white"
              onClick={handleSendAlert}
              disabled={sending}
            >
              {sending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {sending ? "Sending..." : "Send Alert"}
            </Button>
          </div>
          
          <span className="text-[10px] text-center text-muted-foreground font-mono uppercase tracking-wider block">
            Sends to Telegram Bot
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
