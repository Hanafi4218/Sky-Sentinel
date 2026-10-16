import { useEffect, useMemo, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { StatusBadge } from "@/components/StatusBadge";
import { RiskGauge } from "@/components/RiskGauge";
import { HudSlider } from "@/components/HudSlider";
import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateFuzzyRisk, FuzzyResult } from "@/utils/fuzzyEngine";
import { MALAYSIA_STATIONS, WeatherData, fetchWeatherData } from "@/utils/weatherApi";
import { sendTelegramAlert } from "@/utils/telegramService";
import { useToast } from "@/hooks/use-toast";
import { 
  Gauge, RefreshCw, MapPin, ArrowRight, RotateCcw, 
  AlertTriangle, Sparkles, TrendingUp, TrendingDown, Send, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const Simulator = () => {
  const { toast } = useToast();
  
  // Selected station
  const [selectedStation, setSelectedStation] = useState<string>("putrajaya");

  // When switching station, clear any previously fetched live overlay to avoid mixed/"stale" indicators.
  useEffect(() => {
    setLiveData(null);
    setAlertShown(false);
    setAlertOpen(false);
  }, [selectedStation]);
  
  // Live data - starts as null (static state)
  const [liveData, setLiveData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingSend, setTestingSend] = useState(false);
  
  // Simulated values - start at 0 for static state
  const [simWind, setSimWind] = useState(0);
  const [simHumidity, setSimHumidity] = useState(0);
  const [simTemperature, setSimTemperature] = useState(0);
  
  // Alert modal
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  // Calculate results
  const liveResult = useMemo<FuzzyResult | null>(() => {
    if (!liveData) return null;
    return calculateFuzzyRisk({
      wind: liveData.windSpeed,
      humidity: liveData.humidity,
      temperature: liveData.temperature,
    });
  }, [liveData]);

  const simResult = useMemo<FuzzyResult>(() => {
    return calculateFuzzyRisk({
      wind: simWind,
      humidity: simHumidity,
      temperature: simTemperature,
    });
  }, [simWind, simHumidity, simTemperature]);

  // Check for critical and show alert
  const checkCritical = (result: FuzzyResult) => {
    if (result.status === "Critical" && !alertShown) {
      setAlertOpen(true);
      setAlertShown(true);
    }
  };

  // Handle slider changes with critical check
  const handleWindChange = (value: number) => {
    setSimWind(value);
    const result = calculateFuzzyRisk({ wind: value, humidity: simHumidity, temperature: simTemperature });
    checkCritical(result);
  };

  const handleHumidityChange = (value: number) => {
    setSimHumidity(value);
    const result = calculateFuzzyRisk({ wind: simWind, humidity: value, temperature: simTemperature });
    checkCritical(result);
  };

  const handleTemperatureChange = (value: number) => {
    setSimTemperature(value);
    const result = calculateFuzzyRisk({ wind: simWind, humidity: simHumidity, temperature: value });
    checkCritical(result);
  };

  // Fetch live data
  const fetchLiveData = async () => {
    setLoading(true);
    setLiveData(null);

    try {
      const station = MALAYSIA_STATIONS.find((s) => s.id === selectedStation);
      if (!station) return;

      const data = await fetchWeatherData(station);
      setLiveData(data);
      setSimWind(Math.round(data.windSpeed));
      setSimHumidity(Math.round(data.humidity));
      setSimTemperature(Math.round(data.temperature));
      setAlertShown(false);
      setAlertOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Reset sliders: to live values if available, otherwise back to zero (default simulator state)
  const resetSimulation = () => {
    if (liveData) {
      setSimWind(Math.round(liveData.windSpeed));
      setSimHumidity(Math.round(liveData.humidity));
      setSimTemperature(Math.round(liveData.temperature));
    } else {
      setSimWind(0);
      setSimHumidity(0);
      setSimTemperature(0);
    }

    setAlertShown(false);
    setAlertOpen(false);
  };

  // Get current location name - "Simulator" before data fetch, station name after
  const getCurrentLocationName = () => {
    if (!liveData) return "Simulator";
    const station = MALAYSIA_STATIONS.find(s => s.id === selectedStation);
    return station?.name || "Unknown Location";
  };

  // Test Telegram Alert - uses current simulated values
  const handleTestAlert = async () => {
    setTestingSend(true);
    
    const result = await sendTelegramAlert({
      location: getCurrentLocationName(),
      wind: simWind,
      humidity: simHumidity,
      temperature: simTemperature,
      riskPercentage: simResult.dangerPercentage,
    });
    
    setTestingSend(false);
    
    if (result.success) {
      toast({
        title: "Test Alert Sent!",
        description: "Check your Telegram for the test message.",
      });
    } else {
      toast({
        title: "Test Failed",
        description: result.error || "Could not send test alert. Check your .env configuration.",
        variant: "destructive",
      });
    }
  };

  // Calculate deltas
  const getDelta = (sim: number, live: number | undefined) => {
    if (live === undefined) return 0;
    return sim - live;
  };

  const currentStation = MALAYSIA_STATIONS.find(s => s.id === selectedStation);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6 space-y-6 animate-fade-in-up">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold tracking-wider uppercase">
                Predictive Simulator
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                What-If Scenario Engine
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger className="w-[200px] bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MALAYSIA_STATIONS.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {station.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              onClick={fetchLiveData}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              {liveData ? "Sync" : "Fetch Data"}
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Data Panel */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm text-primary font-display uppercase tracking-widest">
                Current Conditions
              </h3>
              {liveData ? (
                <span className="text-xs text-status-safe font-mono flex items-center gap-1">
                  <span className="w-2 h-2 bg-status-safe rounded-full animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full" />
                  AWAITING DATA
                </span>
              )}
            </div>

            {liveData && liveResult ? (
              <div className="space-y-6">
                {/* Live Readings */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background/30 rounded-lg border border-border/30">
                    <p className="text-[10px] text-primary uppercase tracking-wider mb-1 font-mono">Wind</p>
                    <p className="text-2xl font-mono font-bold text-foreground">{liveData.windSpeed}</p>
                    <p className="text-xs text-muted-foreground">km/h</p>
                  </div>
                  <div className="text-center p-4 bg-background/30 rounded-lg border border-border/30">
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1 font-mono">Humidity</p>
                    <p className="text-2xl font-mono font-bold text-foreground">{liveData.humidity}</p>
                    <p className="text-xs text-muted-foreground">%</p>
                  </div>
                  <div className="text-center p-4 bg-background/30 rounded-lg border border-border/30">
                    <p className="text-[10px] text-orange-400 uppercase tracking-wider mb-1 font-mono">Temp</p>
                    <p className="text-2xl font-mono font-bold text-foreground">{liveData.temperature}</p>
                    <p className="text-xs text-muted-foreground">°C</p>
                  </div>
                </div>

                {/* Live Result */}
                <div className="text-center p-6 bg-background/20 rounded-lg border border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-mono">
                    Current Risk Level
                  </p>
                  <StatusBadge status={liveResult.status} size="md" />
                  <p className="text-3xl font-mono font-bold mt-2">
                    {liveResult.dangerPercentage.toFixed(1)}%
                  </p>
                </div>

                <p className="text-xs text-muted-foreground text-center font-mono">
                  📍 {currentStation?.name}, {currentStation?.location}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                  <Gauge className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-mono mb-2">No live data loaded</p>
                <p className="text-xs text-muted-foreground">Click "Fetch Data" to sync with weather station</p>
              </div>
            )}
          </GlassPanel>

          {/* Simulation Panel */}
          <GlassPanel variant="strong" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm text-primary font-display uppercase tracking-widest">
                Simulation Controls
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleTestAlert}
                  size="sm"
                  variant="outline"
                  className="text-xs border-status-critical/50 text-status-critical hover:bg-status-critical/10"
                  disabled={testingSend}
                >
                  {testingSend ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3 mr-1" />
                  )}
                  Test Alert
                </Button>
                <Button
                  onClick={resetSimulation}
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  disabled={loading}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              {/* Wind Slider */}
              <div className="relative">
                <HudSlider
                  label="Wind Speed"
                  value={simWind}
                  min={0}
                  max={100}
                  unit="km/h"
                  color="primary"
                  onChange={handleWindChange}
                  liveValue={liveData?.windSpeed}
                  showLiveIndicator={!!liveData}
                />
                {liveData && (
                  <DeltaIndicator delta={getDelta(simWind, liveData.windSpeed)} />
                )}
              </div>

              {/* Humidity Slider */}
              <div className="relative">
                <HudSlider
                  label="Humidity"
                  value={simHumidity}
                  min={0}
                  max={100}
                  unit="%"
                  color="blue"
                  onChange={handleHumidityChange}
                  liveValue={liveData?.humidity}
                  showLiveIndicator={!!liveData}
                />
                {liveData && (
                  <DeltaIndicator delta={getDelta(simHumidity, liveData.humidity)} />
                )}
              </div>

              {/* Temperature Slider */}
              <div className="relative">
                <HudSlider
                  label="Temperature"
                  value={simTemperature}
                  min={0}
                  max={50}
                  unit="°C"
                  color="orange"
                  onChange={handleTemperatureChange}
                  liveValue={liveData?.temperature}
                  showLiveIndicator={!!liveData}
                />
                {liveData && (
                  <DeltaIndicator delta={getDelta(simTemperature, liveData.temperature)} />
                )}
              </div>
            </div>

            {/* Current Simulation Result */}
            <div className="mt-6 p-4 bg-background/30 rounded-lg border border-border/30 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-mono">
                Simulation Risk Level
              </p>
              <div className="flex items-center justify-center gap-4">
                <RiskGauge value={simResult.dangerPercentage} size={100} />
                <div>
                  <StatusBadge status={simResult.status} size="sm" />
                  <p className="text-xl font-mono font-bold mt-1">
                    {simResult.dangerPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Comparison Results */}
        {liveResult && (
          <GlassPanel className="p-6">
            <h3 className="text-sm text-primary font-display uppercase tracking-widest border-b border-border/50 pb-2 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Comparison Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Live Result */}
              <div className="text-center p-6 bg-background/30 rounded-lg border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-mono">
                  Current (Live)
                </p>
                <StatusBadge status={liveResult.status} size="sm" animate={false} />
                <p className="text-2xl font-mono font-bold mt-2">
                  {liveResult.dangerPercentage.toFixed(1)}%
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Simulated Result */}
              <div className={cn(
                "text-center p-6 rounded-lg border",
                simResult.status === "Critical" 
                  ? "bg-status-critical/10 border-status-critical/30 animate-pulse-critical" 
                  : simResult.status === "Caution"
                  ? "bg-status-caution/10 border-status-caution/30"
                  : "bg-status-safe/10 border-status-safe/30"
              )}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-mono">
                  Simulated
                </p>
                <StatusBadge status={simResult.status} size="sm" />
                <p className="text-2xl font-mono font-bold mt-2">
                  {simResult.dangerPercentage.toFixed(1)}%
                </p>
                
                <p className={cn(
                  "text-sm font-mono mt-2",
                  simResult.dangerPercentage > liveResult.dangerPercentage 
                    ? "text-status-critical" 
                    : simResult.dangerPercentage < liveResult.dangerPercentage
                    ? "text-status-safe"
                    : "text-muted-foreground"
                )}>
                  {simResult.dangerPercentage > liveResult.dangerPercentage 
                    ? `↑ +${(simResult.dangerPercentage - liveResult.dangerPercentage).toFixed(1)}%`
                    : simResult.dangerPercentage < liveResult.dangerPercentage
                    ? `↓ ${(simResult.dangerPercentage - liveResult.dangerPercentage).toFixed(1)}%`
                    : "No Change"
                  }
                </p>
              </div>
            </div>

            {/* Warning if Critical */}
            {simResult.status === "Critical" && (
              <div className="mt-6 p-4 rounded-lg bg-status-critical/10 border border-status-critical/30 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-status-critical flex-shrink-0" />
                <div>
                  <p className="text-status-critical font-display font-bold uppercase text-sm">
                    Critical Conditions Detected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Under these simulated conditions, UAV operations are NOT recommended. 
                    Consider postponing or relocating activities.
                  </p>
                </div>
              </div>
            )}
          </GlassPanel>
        )}
      </div>

      {/* Alert Modal */}
      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        dangerLevel={simResult.dangerPercentage}
        location={getCurrentLocationName()}
        wind={simWind}
        humidity={simHumidity}
        temperature={simTemperature}
      />
    </div>
  );
};

// Delta indicator component
const DeltaIndicator = ({ delta }: { delta: number }) => {
  if (Math.abs(delta) < 0.1) return null;
  
  return (
    <div className={cn(
      "mt-1 flex justify-end text-xs font-mono items-center gap-1",
      delta > 0 ? "text-status-caution" : "text-status-safe"
    )}>
      {delta > 0 ? (
        <>
          <TrendingUp className="w-3 h-3" />
          +{delta.toFixed(1)}
        </>
      ) : (
        <>
          <TrendingDown className="w-3 h-3" />
          {delta.toFixed(1)}
        </>
      )}
    </div>
  );
};

export default Simulator;
