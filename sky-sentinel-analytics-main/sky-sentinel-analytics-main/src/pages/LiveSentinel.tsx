import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { StatusBadge } from "@/components/StatusBadge";
import { RiskGauge } from "@/components/RiskGauge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateFuzzyRisk, FuzzyResult } from "@/utils/fuzzyEngine";
import { MALAYSIA_STATIONS, WeatherData, fetchWeatherData } from "@/utils/weatherApi";
import { Radar, RefreshCw, MapPin, Wind, Droplets, Thermometer, Wifi, WifiOff, Clock, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const LiveSentinel = () => {
  const [selectedStation, setSelectedStation] = useState<string>("putrajaya");
  const [weatherData, setWeatherData] = useState<Map<string, WeatherData>>(new Map());
  const [results, setResults] = useState<Map<string, FuzzyResult>>(new Map());
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [connected, setConnected] = useState(false);

  // Fetch data for all stations
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    
    const newWeatherData = new Map<string, WeatherData>();
    const newResults = new Map<string, FuzzyResult>();
    
    for (const station of MALAYSIA_STATIONS) {
      const data = await fetchWeatherData(station);
      newWeatherData.set(station.id, data);
      
      const result = calculateFuzzyRisk({
        wind: data.windSpeed,
        humidity: data.humidity,
        temperature: data.temperature,
      });
      newResults.set(station.id, result);
    }
    
    setWeatherData(newWeatherData);
    setResults(newResults);
    setLastSync(new Date());
    setConnected(true);
    setLoading(false);
  }, []);

  // No auto-fetch - start with static state

  const currentStation = MALAYSIA_STATIONS.find(s => s.id === selectedStation);
  const currentWeather = weatherData.get(selectedStation);
  const currentResult = results.get(selectedStation);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6 space-y-6 animate-fade-in-up">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Radar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold tracking-wider uppercase">
                Live Sentinel
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                Real-Time Malaysia Weather Monitoring
              </p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              {connected ? (
                <>
                  <Wifi className="w-4 h-4 text-status-safe" />
                  <span className="text-status-safe">CONNECTED</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-status-critical" />
                  <span className="text-status-critical">OFFLINE</span>
                </>
              )}
            </div>
            {lastSync && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Clock className="w-4 h-4" />
                {lastSync.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="space-y-6">
            <GlassPanel className="p-6">
              <h3 className="text-sm text-primary font-display uppercase tracking-widest border-b border-border/50 pb-2 mb-4">
                MET Control
              </h3>
              
              {/* Station Selector */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 block font-mono">
                    Active Station
                  </label>
                  <Select value={selectedStation} onValueChange={setSelectedStation}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MALAYSIA_STATIONS.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{station.name}</span>
                            <span className="text-muted-foreground">({station.location})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={fetchAllData}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                  {loading ? "Syncing..." : "Fetch Live Data"}
                </Button>
              </div>
            </GlassPanel>

            {/* Sensor Data */}
            {currentWeather && (
              <GlassPanel className="p-6">
                <h3 className="text-sm text-primary font-display uppercase tracking-widest border-b border-border/50 pb-2 mb-4">
                  Live Sensors
                </h3>
                <div className="space-y-4">
                  {/* Wind */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-primary" />
                        <span className="text-xs text-primary uppercase font-mono">Wind Speed</span>
                      </div>
                      <span className="text-sm font-mono text-foreground">
                        {currentWeather.windSpeed} km/h
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary data-bar"
                        style={{ width: `${Math.min(currentWeather.windSpeed, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Humidity */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-blue-400 uppercase font-mono">Humidity</span>
                      </div>
                      <span className="text-sm font-mono text-foreground">
                        {currentWeather.humidity}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 data-bar"
                        style={{ width: `${currentWeather.humidity}%` }}
                      />
                    </div>
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-orange-400 uppercase font-mono">Temperature</span>
                      </div>
                      <span className="text-sm font-mono text-foreground">
                        {currentWeather.temperature}°C
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 data-bar"
                        style={{ width: `${(currentWeather.temperature / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Forecast */}
                <div className="mt-6 p-3 bg-background/50 rounded-lg border border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">
                    Forecast
                  </p>
                  <p className="text-sm text-foreground">{currentWeather.forecast}</p>
                </div>
              </GlassPanel>
            )}

            {/* Risk Result */}
            {currentResult && (
              <GlassPanel variant="strong" className="p-6 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-mono">
                  SkySentinel Risk Analysis
                </p>
                <StatusBadge status={currentResult.status} size="lg" />
                <div className="mt-4">
                  <RiskGauge value={currentResult.dangerPercentage} size={150} />
                </div>
              </GlassPanel>
            )}
          </div>

          {/* Map - Interactive Station Overview */}
          <div className="lg:col-span-2">
            <GlassPanel className="p-6 h-[600px] overflow-auto">
              <h3 className="text-sm text-primary font-display uppercase tracking-widest border-b border-border/50 pb-2 mb-6">
                Malaysia Station Network
              </h3>
              
              {/* Station Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MALAYSIA_STATIONS.map((station) => {
                  const stationWeather = weatherData.get(station.id);
                  const stationResult = results.get(station.id);
                  const isSelected = selectedStation === station.id;
                  
                  return (
                    <button
                      key={station.id}
                      onClick={() => setSelectedStation(station.id)}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all duration-300",
                        isSelected 
                          ? "border-primary bg-primary/10 shadow-glow" 
                          : "border-border/50 bg-background/30 hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Navigation className={cn(
                            "w-4 h-4",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className="font-display font-bold text-foreground">
                            {station.name}
                          </span>
                        </div>
                        {stationResult && (
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            stationResult.status === "Stable" && "bg-status-safe shadow-glow-safe",
                            stationResult.status === "Caution" && "bg-status-caution shadow-glow-caution",
                            stationResult.status === "Critical" && "bg-status-critical shadow-glow-critical animate-pulse-critical"
                          )} />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3 font-mono">
                        {station.location}
                      </p>
                      
                      {stationWeather && stationResult ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Temp</span>
                            <span className="text-orange-400 font-mono">{stationWeather.temperature}°C</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Humidity</span>
                            <span className="text-blue-400 font-mono">{stationWeather.humidity}%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Wind</span>
                            <span className="text-primary font-mono">{stationWeather.windSpeed} km/h</span>
                          </div>
                          <div className="pt-2 mt-2 border-t border-border/30">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk</span>
                              <span className={cn(
                                "text-sm font-mono font-bold",
                                stationResult.status === "Stable" && "text-status-safe",
                                stationResult.status === "Caution" && "text-status-caution",
                                stationResult.status === "Critical" && "text-status-critical"
                              )}>
                                {stationResult.dangerPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-4">
                          <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Coordinates Display */}
              {currentStation && (
                <div className="mt-6 p-4 bg-background/30 rounded-lg border border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                        Coordinates
                      </span>
                    </div>
                    <span className="font-mono text-sm text-foreground">
                      {currentStation.coordinates[0].toFixed(4)}°N, {currentStation.coordinates[1].toFixed(4)}°E
                    </span>
                  </div>
                </div>
              )}
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSentinel;
