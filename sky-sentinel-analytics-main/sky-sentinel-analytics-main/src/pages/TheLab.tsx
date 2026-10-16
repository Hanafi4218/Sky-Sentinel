import { useState, useMemo, useCallback } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { StatusBadge } from "@/components/StatusBadge";
import { RiskGauge } from "@/components/RiskGauge";
import { HudSlider } from "@/components/HudSlider";
import { MembershipChart } from "@/components/MembershipChart";
import { RulesList } from "@/components/RulesList";
import { calculateFuzzyRisk, FuzzyResult } from "@/utils/fuzzyEngine";
import { Beaker, Info, Cpu } from "lucide-react";

const TheLab = () => {
  // Input states
  const [wind, setWind] = useState(15);
  const [humidity, setHumidity] = useState(50);
  const [temperature, setTemperature] = useState(28);

  // Calculate fuzzy result
  const result: FuzzyResult = useMemo(
    () => calculateFuzzyRisk({ wind, humidity, temperature }),
    [wind, humidity, temperature]
  );

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6 space-y-6 animate-fade-in-up">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Beaker className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold tracking-wider uppercase">
              The Lab
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              Fuzzy Logic Visualization Playground
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Manual Controls */}
            <GlassPanel className="p-6">
              <h3 className="text-sm text-primary font-display uppercase tracking-widest border-b border-border/50 pb-2 mb-6">
                Manual Control
              </h3>
              <div className="space-y-8">
                <HudSlider
                  label="Wind Speed"
                  value={wind}
                  min={0}
                  max={100}
                  unit="km/h"
                  color="primary"
                  onChange={setWind}
                />
                <HudSlider
                  label="Humidity"
                  value={humidity}
                  min={0}
                  max={100}
                  unit="%"
                  color="blue"
                  onChange={setHumidity}
                />
                <HudSlider
                  label="Temperature"
                  value={temperature}
                  min={0}
                  max={50}
                  unit="°C"
                  color="orange"
                  onChange={setTemperature}
                />
              </div>
            </GlassPanel>

            {/* Membership Visualization */}
            <GlassPanel className="p-6">
              <h3 className="text-sm text-primary font-display uppercase tracking-widest border-b border-border/50 pb-2 mb-4">
                Membership Functions
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-mono">
                    Wind (km/h)
                  </p>
                  <MembershipChart
                    type="wind"
                    currentValue={wind}
                    membership={result.windMembership}
                    height={80}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-mono">
                    Humidity (%)
                  </p>
                  <MembershipChart
                    type="humidity"
                    currentValue={humidity}
                    membership={result.humidityMembership}
                    height={80}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-mono">
                    Temperature (°C)
                  </p>
                  <MembershipChart
                    type="temperature"
                    currentValue={temperature}
                    membership={result.temperatureMembership}
                    height={80}
                  />
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Center Column - Results */}
          <div className="lg:col-span-4 space-y-6">
            {/* Main Output */}
            <GlassPanel variant="strong" className="p-6 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4 font-mono">
                Fuzzy Risk Assessment
              </p>
              <StatusBadge status={result.status} size="lg" />
              <div className="mt-6">
                <RiskGauge value={result.dangerPercentage} size={180} />
              </div>
            </GlassPanel>

            {/* Aggregation Display */}
            <GlassPanel className="p-6">
              <h3 className="text-sm text-primary font-display uppercase tracking-widest border-b border-border/50 pb-2 mb-4">
                Aggregated Strengths
              </h3>
              <div className="space-y-4">
                {/* Stable */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-status-safe font-mono uppercase">Stable</span>
                    <span className="text-xs text-status-safe font-mono">
                      {(result.aggregatedStrengths.stable * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-status-safe transition-all duration-500"
                      style={{ width: `${result.aggregatedStrengths.stable * 100}%` }}
                    />
                  </div>
                </div>
                {/* Caution */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-status-caution font-mono uppercase">Caution</span>
                    <span className="text-xs text-status-caution font-mono">
                      {(result.aggregatedStrengths.caution * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-status-caution transition-all duration-500"
                      style={{ width: `${result.aggregatedStrengths.caution * 100}%` }}
                    />
                  </div>
                </div>
                {/* Critical */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-status-critical font-mono uppercase">Critical</span>
                    <span className="text-xs text-status-critical font-mono">
                      {(result.aggregatedStrengths.critical * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-status-critical transition-all duration-500"
                      style={{ width: `${result.aggregatedStrengths.critical * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Defuzzification Info */}
              <div className="mt-6 p-3 bg-background/50 rounded-lg border border-border/30">
                <div className="flex items-start gap-2">
                  <Cpu className="w-4 h-4 text-primary mt-0.5" />
                  <div className="text-[10px] font-mono text-muted-foreground">
                    <p className="mb-1">Weighted Average Defuzzification:</p>
                    <p className="text-foreground">
                      ({(result.aggregatedStrengths.stable * 100).toFixed(0)}% × 15 + 
                      {(result.aggregatedStrengths.caution * 100).toFixed(0)}% × 50 + 
                      {(result.aggregatedStrengths.critical * 100).toFixed(0)}% × 85) ÷ Total = 
                      <span className="text-primary font-bold ml-1">
                        {result.dangerPercentage.toFixed(1)}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Right Column - Rules */}
          <div className="lg:col-span-4">
            <GlassPanel className="p-6 h-full">
              <RulesList rules={result.firedRules} maxHeight={600} />
            </GlassPanel>
          </div>
        </div>

        {/* Info Box */}
        <GlassPanel variant="subtle" className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground font-mono">
              <p className="text-foreground mb-1">How it works:</p>
              <p>
                The fuzzy engine converts crisp inputs into fuzzy membership degrees (0-1), 
                evaluates 27 IF-THEN rules using MIN-MAX inference, then defuzzifies using 
                weighted averages with output centers (Stable=15, Caution=50, Critical=85).
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default TheLab;
