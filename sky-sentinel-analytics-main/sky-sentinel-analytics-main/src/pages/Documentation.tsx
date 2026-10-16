import { GlassPanel } from "@/components/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Cpu,
  Gauge,
  AlertTriangle,
  MapPin,
  Send,
  Code,
  Database,
  Layers,
  Zap,
  BookOpen,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Documentation = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6 space-y-8 animate-fade-in-up max-w-5xl">
        {/* Document Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">
              Technical Documentation
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-wider uppercase">
            SkySentinel
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Fuzzy Logic Risk System — Project Documentation v1.0
          </p>
          <p className="text-xs text-muted-foreground">
            Document Prepared: January 2025 | Classification: Internal Technical Report
          </p>
        </div>

        {/* Executive Summary */}
        <GlassPanel className="p-6">
          <SectionHeader icon={BookOpen} title="Executive Summary" />
          <div className="prose prose-invert max-w-none space-y-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">SkySentinel</strong> is an advanced environmental risk assessment
              system designed specifically for UAV (Unmanned Aerial Vehicle) operators in Malaysia. The system
              employs a sophisticated fuzzy logic inference engine to evaluate weather telemetry and produce
              actionable risk assessments in real-time.
            </p>
            <p>
              The platform addresses a critical gap in drone operations safety by providing operators with
              intelligent, context-aware risk evaluations that go beyond simple threshold-based alerts. By
              utilizing fuzzy logic, the system can handle the inherent uncertainty and imprecision of
              environmental data, delivering nuanced assessments that mirror expert human judgment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <StatCard label="Monitoring Stations" value="6" sublabel="Malaysia Coverage" />
              <StatCard label="Fuzzy Rules" value="27" sublabel="IF-THEN Knowledge Base" />
              <StatCard label="Input Variables" value="3" sublabel="Wind, Humidity, Temp" />
            </div>
          </div>
        </GlassPanel>

        {/* Navigation Tabs */}
        <Tabs defaultValue="architecture" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-transparent">
            <TabsTrigger value="architecture" className="data-[state=active]:bg-primary/20">
              <Cpu className="w-4 h-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="data-[state=active]:bg-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              Algorithm
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-primary/20">
              <Layers className="w-4 h-4 mr-2" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-primary/20">
              <Code className="w-4 h-4 mr-2" />
              API & Data
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-primary/20">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alert System
            </TabsTrigger>
          </TabsList>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <GlassPanel className="p-6">
              <SectionHeader icon={Cpu} title="System Architecture" />
              <div className="space-y-6 text-sm text-muted-foreground">
                <p>
                  SkySentinel is built on a modern, component-based architecture optimized for performance,
                  maintainability, and real-time responsiveness. The system follows a clear separation of concerns
                  with dedicated layers for presentation, business logic, and data access.
                </p>

                <SubSection title="1.1 Technology Stack">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TechStackItem
                      category="Frontend Framework"
                      technology="React 18.3"
                      description="Component-based UI with hooks for state management and side effects."
                    />
                    <TechStackItem
                      category="Build Tool"
                      technology="Vite"
                      description="Next-generation frontend tooling with HMR and optimized production builds."
                    />
                    <TechStackItem
                      category="Styling"
                      technology="Tailwind CSS"
                      description="Utility-first CSS framework with custom design tokens for the HUD aesthetic."
                    />
                    <TechStackItem
                      category="Type System"
                      technology="TypeScript"
                      description="Static typing for enhanced code quality and developer experience."
                    />
                    <TechStackItem
                      category="UI Components"
                      technology="shadcn/ui + Radix"
                      description="Accessible, customizable component primitives with consistent behavior."
                    />
                    <TechStackItem
                      category="Charts"
                      technology="Recharts"
                      description="React-based charting library for membership function visualization."
                    />
                    <TechStackItem
                      category="State Management"
                      technology="React Query"
                      description="Server state management with caching, refetching, and synchronization."
                    />
                    <TechStackItem
                      category="Routing"
                      technology="React Router v6"
                      description="Declarative routing with nested routes and protected paths."
                    />
                  </div>
                </SubSection>

                <SubSection title="1.2 Project Structure">
                  <pre className="bg-background/50 p-4 rounded-lg border border-border/30 overflow-x-auto text-xs">
{`src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── GlassPanel.tsx   # Glassmorphism container
│   ├── HudSlider.tsx    # Custom slider with live overlay
│   ├── RiskGauge.tsx    # Circular risk visualization
│   ├── StatusBadge.tsx  # Risk status indicator
│   ├── AlertModal.tsx   # Critical alert modal
│   └── MembershipChart.tsx  # Fuzzy membership graphs
├── pages/               # Route-level page components
│   ├── TheLab.tsx       # Fuzzy logic visualization
│   ├── LiveSentinel.tsx # Real-time station monitoring
│   ├── Simulator.tsx    # What-if scenario engine
│   └── Documentation.tsx # This documentation
├── utils/               # Business logic & services
│   ├── fuzzyEngine.ts   # Core fuzzy inference engine
│   ├── weatherApi.ts    # Weather data fetching
│   └── telegramService.ts # Alert notification service
└── hooks/               # Custom React hooks`}
                  </pre>
                </SubSection>

                <SubSection title="1.3 Design Philosophy">
                  <p>
                    The visual design follows a "Sci-Fi Terminal" aesthetic inspired by military command interfaces
                    and cyberpunk HUD displays. Key design decisions include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-3">
                    <li>
                      <strong className="text-foreground">Dark Theme:</strong> Base background of #0f172a (Slate 900)
                      reduces eye strain during extended monitoring sessions.
                    </li>
                    <li>
                      <strong className="text-foreground">Glassmorphism:</strong> Frosted glass panels with
                      backdrop-blur create depth and visual hierarchy.
                    </li>
                    <li>
                      <strong className="text-foreground">Color Coding:</strong> Semantic colors for risk states —
                      Emerald (#10b981) for Stable, Amber (#f59e0b) for Caution, Rose (#f43f5e) for Critical.
                    </li>
                    <li>
                      <strong className="text-foreground">Typography:</strong> Orbitron for headings (futuristic),
                      Roboto Mono for data displays (technical precision).
                    </li>
                  </ul>
                </SubSection>
              </div>
            </GlassPanel>
          </TabsContent>

          {/* Algorithm Tab */}
          <TabsContent value="algorithm" className="space-y-6">
            <GlassPanel className="p-6">
              <SectionHeader icon={Zap} title="Fuzzy Logic Algorithm" />
              <div className="space-y-6 text-sm text-muted-foreground">
                <p>
                  The core intelligence of SkySentinel is powered by a Mamdani-type fuzzy inference system. This
                  approach was selected for its interpretability and ability to encode expert knowledge as
                  human-readable IF-THEN rules.
                </p>

                <SubSection title="2.1 Algorithm Pipeline">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    <PipelineStep step={1} title="Fuzzification" description="Crisp inputs → Fuzzy sets" />
                    <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
                    <PipelineStep step={2} title="Inference" description="Rule evaluation (Min-Max)" />
                    <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
                    <PipelineStep step={3} title="Aggregation" description="Combine rule outputs" />
                    <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
                    <PipelineStep step={4} title="Defuzzification" description="Fuzzy → Crisp output" />
                  </div>
                </SubSection>

                <SubSection title="2.2 Input Variables & Membership Functions">
                  <p className="mb-4">
                    Three environmental variables are monitored, each mapped to three linguistic terms (Low, Medium,
                    High) using trapezoidal and triangular membership functions:
                  </p>
                  <div className="space-y-4">
                    <MembershipTable
                      variable="Wind Speed"
                      unit="km/h"
                      range="0–100"
                      low="Trapezoidal: Full 0–0, fade 0–10"
                      medium="Triangular: 8–16.5–25 (peak at 16.5)"
                      high="Trapezoidal: Start 20, full at 60+"
                    />
                    <MembershipTable
                      variable="Humidity"
                      unit="%"
                      range="0–100"
                      low="Trapezoidal: Full 0–0, fade 0–40"
                      medium="Triangular: 30–50–70 (peak at 50)"
                      high="Trapezoidal: Start 60, full at 100"
                    />
                    <MembershipTable
                      variable="Temperature"
                      unit="°C"
                      range="0–50"
                      low="Trapezoidal: Full 0–0, fade 0–22"
                      medium="Triangular: 20–26–32 (peak at 26)"
                      high="Trapezoidal: Start 30, full at 45+"
                    />
                  </div>
                </SubSection>

                <SubSection title="2.3 Rule Base (27 IF-THEN Rules)">
                  <p className="mb-4">
                    The knowledge base consists of 27 rules covering all combinations of the three input variables.
                    Rules are evaluated using the AND operator (minimum t-norm). Below is a representative sample:
                  </p>
                  <div className="bg-background/50 p-4 rounded-lg border border-border/30 space-y-2 font-mono text-xs">
                    <RuleDisplay
                      id={1}
                      rule="IF Wind=Low AND Humidity=Low AND Temp=Low THEN Risk=Stable"
                    />
                    <RuleDisplay
                      id={5}
                      rule="IF Wind=Medium AND Humidity=Medium AND Temp=Low THEN Risk=Caution"
                    />
                    <RuleDisplay
                      id={9}
                      rule="IF Wind=High AND Humidity=High AND Temp=Low THEN Risk=Critical"
                    />
                    <RuleDisplay
                      id={14}
                      rule="IF Wind=Medium AND Humidity=Medium AND Temp=Medium THEN Risk=Caution"
                    />
                    <RuleDisplay
                      id={21}
                      rule="IF Wind=Low AND Humidity=High AND Temp=High THEN Risk=Critical"
                    />
                    <RuleDisplay
                      id={27}
                      rule="IF Wind=High AND Humidity=High AND Temp=High THEN Risk=Critical"
                    />
                    <p className="text-muted-foreground pt-2">... and 21 additional rules</p>
                  </div>
                </SubSection>

                <SubSection title="2.4 Defuzzification">
                  <p>
                    The system uses <strong className="text-foreground">Weighted Average</strong> defuzzification
                    with fixed output centers:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-3">
                    <li>Stable: Center = 15%</li>
                    <li>Caution: Center = 50%</li>
                    <li>Critical: Center = 85%</li>
                  </ul>
                  <div className="bg-background/50 p-4 rounded-lg border border-border/30 mt-4 font-mono text-xs">
                    <p className="text-foreground">Formula:</p>
                    <p className="mt-2">
                      Risk% = (μ_stable × 15 + μ_caution × 50 + μ_critical × 85) / (μ_stable + μ_caution + μ_critical)
                    </p>
                  </div>
                </SubSection>

                <SubSection title="2.5 Status Classification">
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="text-center p-4 rounded-lg bg-status-safe/10 border border-status-safe/30">
                      <p className="text-status-safe font-bold">STABLE</p>
                      <p className="text-xs mt-1">Risk &lt; 35%</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-status-caution/10 border border-status-caution/30">
                      <p className="text-status-caution font-bold">CAUTION</p>
                      <p className="text-xs mt-1">35% ≤ Risk &lt; 70%</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-status-critical/10 border border-status-critical/30">
                      <p className="text-status-critical font-bold">CRITICAL</p>
                      <p className="text-xs mt-1">Risk ≥ 70%</p>
                    </div>
                  </div>
                </SubSection>
              </div>
            </GlassPanel>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <GlassPanel className="p-6">
              <SectionHeader icon={Layers} title="Application Modules" />
              <div className="space-y-6 text-sm text-muted-foreground">
                <p>
                  SkySentinel is organized into three distinct operational modules, each serving a specific purpose
                  in the risk assessment workflow.
                </p>

                <SubSection title="3.1 The Lab (Route: /)">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Gauge className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <p>
                        <strong className="text-foreground">Purpose:</strong> Educational visualization of the fuzzy
                        logic engine. Allows users to understand how inputs map to risk assessments.
                      </p>
                      <p>
                        <strong className="text-foreground">Features:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Interactive sliders for Wind, Humidity, and Temperature inputs</li>
                        <li>Real-time membership function charts (Recharts)</li>
                        <li>Visual representation of membership degrees for each linguistic term</li>
                        <li>Live rule evaluation display showing active/inactive rules</li>
                        <li>Aggregated output strengths visualization</li>
                        <li>Risk gauge with percentage and status badge</li>
                      </ul>
                      <p>
                        <strong className="text-foreground">Use Case:</strong> Training new operators, demonstrating
                        system logic to stakeholders, educational purposes.
                      </p>
                    </div>
                  </div>
                </SubSection>

                <Separator className="opacity-30" />

                <SubSection title="3.2 Live Sentinel (Route: /sentinel)">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="space-y-3">
                      <p>
                        <strong className="text-foreground">Purpose:</strong> Real-time monitoring dashboard for all
                        configured Malaysia weather stations.
                      </p>
                      <p>
                        <strong className="text-foreground">Features:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Grid display of 6 Malaysia monitoring stations</li>
                        <li>Per-station weather telemetry (temperature, humidity, wind)</li>
                        <li>Real-time fuzzy risk calculation for each station</li>
                        <li>Color-coded status badges (Stable/Caution/Critical)</li>
                        <li>Sync All functionality to refresh all stations simultaneously</li>
                        <li>Station selection for detailed view</li>
                      </ul>
                      <p>
                        <strong className="text-foreground">Stations Covered:</strong>
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {["Putrajaya", "Kuala Lumpur", "Penang", "Johor Bahru", "Kuching", "Kota Kinabalu"].map(
                          (station) => (
                            <Badge key={station} variant="outline" className="justify-center">
                              {station}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </SubSection>

                <Separator className="opacity-30" />

                <SubSection title="3.3 Predictive Simulator (Route: /simulator)">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="space-y-3">
                      <p>
                        <strong className="text-foreground">Purpose:</strong> What-if scenario modeling for mission
                        planning and alert system testing.
                      </p>
                      <p>
                        <strong className="text-foreground">Features:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Station selector for location context</li>
                        <li>Fetch live data to establish baseline conditions</li>
                        <li>Simulation sliders with LIVE overlay indicators</li>
                        <li>Delta indicators showing deviation from live values</li>
                        <li>Side-by-side comparison of Current vs Simulated risk</li>
                        <li>Test Alert button for Telegram integration verification</li>
                        <li>Reset functionality (to live values or zero state)</li>
                        <li>Critical alert modal trigger when thresholds exceeded</li>
                      </ul>
                      <p>
                        <strong className="text-foreground">Use Case:</strong> Pre-flight planning, "what happens if
                        wind increases by 20 km/h?" scenarios, alert system testing.
                      </p>
                    </div>
                  </div>
                </SubSection>
              </div>
            </GlassPanel>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <GlassPanel className="p-6">
              <SectionHeader icon={Database} title="API & Data Integration" />
              <div className="space-y-6 text-sm text-muted-foreground">
                <SubSection title="4.1 Weather Data Service">
                  <p>
                    Weather data is sourced through a flexible utility that supports both live API integration and
                    realistic mock data generation for development/demo purposes.
                  </p>
                  <div className="bg-background/50 p-4 rounded-lg border border-border/30 mt-4 space-y-4">
                    <div>
                      <p className="text-foreground font-mono text-xs mb-2">// Primary API: AccuWeather</p>
                      <p className="text-xs">
                        Endpoint: dataservice.accuweather.com/currentconditions/v1/{"{locationKey}"}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground font-mono text-xs mb-2">// Data Interface</p>
                      <pre className="text-xs overflow-x-auto">
{`interface WeatherData {
  temperature: number;    // °C
  humidity: number;       // %
  windSpeed: number;      // km/h
  forecast: string;       // Text description
  lastUpdated: Date;
  station: WeatherStation;
}`}
                      </pre>
                    </div>
                  </div>
                </SubSection>

                <SubSection title="4.2 Station Configuration">
                  <p>
                    Six Malaysia weather stations are pre-configured with coordinates and AccuWeather location keys:
                  </p>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left py-2 px-3 text-foreground">Station</th>
                          <th className="text-left py-2 px-3 text-foreground">Region</th>
                          <th className="text-left py-2 px-3 text-foreground">Coordinates</th>
                          <th className="text-left py-2 px-3 text-foreground">API Key</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/20">
                          <td className="py-2 px-3">Putrajaya</td>
                          <td className="py-2 px-3">W.P. Putrajaya</td>
                          <td className="py-2 px-3 font-mono">2.9264, 101.6964</td>
                          <td className="py-2 px-3 font-mono">235400</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2 px-3">Kuala Lumpur</td>
                          <td className="py-2 px-3">Subang</td>
                          <td className="py-2 px-3 font-mono">3.1319, 101.5488</td>
                          <td className="py-2 px-3 font-mono">48647</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2 px-3">Penang</td>
                          <td className="py-2 px-3">Bayan Lepas</td>
                          <td className="py-2 px-3 font-mono">5.2972, 100.2760</td>
                          <td className="py-2 px-3 font-mono">229893</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2 px-3">Johor Bahru</td>
                          <td className="py-2 px-3">Senai</td>
                          <td className="py-2 px-3 font-mono">1.6416, 103.6696</td>
                          <td className="py-2 px-3 font-mono">228029</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2 px-3">Kuching</td>
                          <td className="py-2 px-3">Sarawak</td>
                          <td className="py-2 px-3 font-mono">1.5497, 110.3592</td>
                          <td className="py-2 px-3 font-mono">230204</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3">Kota Kinabalu</td>
                          <td className="py-2 px-3">Sabah</td>
                          <td className="py-2 px-3 font-mono">5.9804, 116.0735</td>
                          <td className="py-2 px-3 font-mono">229992</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </SubSection>

                <SubSection title="4.3 Mock Data Generation">
                  <p>
                    When no API key is provided, the system generates realistic mock data within tropical Malaysia
                    climate ranges:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-3">
                    <li>Temperature: 28–34°C (tropical baseline)</li>
                    <li>Humidity: 65–90% (monsoon climate)</li>
                    <li>Wind Speed: 5–30 km/h (typical conditions)</li>
                  </ul>
                </SubSection>

                <SubSection title="4.4 Fuzzy Engine API">
                  <p>The fuzzy engine exposes the following functions:</p>
                  <div className="bg-background/50 p-4 rounded-lg border border-border/30 mt-4 font-mono text-xs space-y-3">
                    <div>
                      <p className="text-primary">calculateFuzzyRisk(inputs: FuzzyInputs): FuzzyResult</p>
                      <p className="text-muted-foreground mt-1">
                        Main function. Accepts wind, humidity, temperature and returns complete analysis.
                      </p>
                    </div>
                    <div>
                      <p className="text-primary">fuzzifyWind(wind: number): FuzzyMembership</p>
                      <p className="text-muted-foreground mt-1">
                        Returns membership degrees for Low, Medium, High wind categories.
                      </p>
                    </div>
                    <div>
                      <p className="text-primary">getMembershipPoints(type, resolution): Point[]</p>
                      <p className="text-muted-foreground mt-1">
                        Generates data points for membership function visualization charts.
                      </p>
                    </div>
                  </div>
                </SubSection>
              </div>
            </GlassPanel>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <GlassPanel className="p-6">
              <SectionHeader icon={Send} title="Telegram Alert System" />
              <div className="space-y-6 text-sm text-muted-foreground">
                <p>
                  SkySentinel integrates with the Telegram Bot API to deliver critical risk alerts directly to
                  operators' devices. This ensures immediate notification even when the dashboard is not actively
                  monitored.
                </p>

                <SubSection title="5.1 Configuration">
                  <p>The alert system requires two environment variables:</p>
                  <div className="bg-background/50 p-4 rounded-lg border border-border/30 mt-4 font-mono text-xs">
                    <p>VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here</p>
                    <p>VITE_TELEGRAM_CHAT_ID=your_chat_id_here</p>
                  </div>
                  <p className="mt-4">
                    <strong className="text-foreground">Bot Setup:</strong> Create a bot via @BotFather on Telegram
                    to obtain the token. Chat ID can be retrieved by messaging the bot and checking the Telegram API.
                  </p>
                </SubSection>

                <SubSection title="5.2 Alert Message Format">
                  <p>Alerts are sent as HTML-formatted messages with the following structure:</p>
                  <div className="bg-background/50 p-4 rounded-lg border border-status-critical/30 mt-4 text-xs">
                    <pre className="whitespace-pre-wrap">
{`🚨 SKYSENTINEL COMMAND: CRITICAL ALERT

📍 SECTOR: [Location Name]

⚠️ THREAT LEVEL: CRITICAL ([Risk]%)

TELEMETRY:
💨 Wind: [X] km/h
💧 Humidity: [X] %
🌡️ Temp: [X] °C

🛑 ACTION REQUIRED: Immediate drone grounding 
   and equipment securement.`}
                    </pre>
                  </div>
                </SubSection>

                <SubSection title="5.3 Alert Trigger Conditions">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong className="text-foreground">Automatic:</strong> When fuzzy risk assessment reaches
                      CRITICAL status (≥70%) during simulation or live monitoring.
                    </li>
                    <li>
                      <strong className="text-foreground">Manual:</strong> Via "Test Alert" button in Simulator
                      module for system verification.
                    </li>
                  </ul>
                </SubSection>

                <SubSection title="5.4 Alert Modal (UI)">
                  <p>
                    In addition to Telegram notifications, critical conditions trigger an on-screen modal with:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-3">
                    <li>Red/Black flashing animation for immediate attention</li>
                    <li>Full telemetry display</li>
                    <li>Risk percentage and status</li>
                    <li>Location/sector identification</li>
                    <li>Actionable instructions</li>
                  </ul>
                </SubSection>

                <SubSection title="5.5 Service Architecture">
                  <div className="bg-background/50 p-4 rounded-lg border border-border/30 mt-4 font-mono text-xs">
                    <pre className="overflow-x-auto">
{`// telegramService.ts exports:

interface TelegramAlertPayload {
  location: string;
  wind: number;
  humidity: number;
  temperature: number;
  riskPercentage: number;
}

sendTelegramAlert(payload): Promise<TelegramResponse>
testTelegramConnection(location): Promise<TelegramResponse>`}
                    </pre>
                  </div>
                </SubSection>
              </div>
            </GlassPanel>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <GlassPanel className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-display font-bold">Project Team</p>
                <p className="text-xs text-muted-foreground">SkySentinel Development Unit</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-status-safe" />
              <span className="text-xs text-muted-foreground font-mono">Document v1.0 — January 2025</span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

// Helper Components
const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <h2 className="text-lg font-display font-bold tracking-wider uppercase">{title}</h2>
  </div>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-display font-semibold text-foreground tracking-wide">{title}</h3>
    {children}
  </div>
);

const StatCard = ({ label, value, sublabel }: { label: string; value: string; sublabel: string }) => (
  <div className="text-center p-4 bg-background/30 rounded-lg border border-border/30">
    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">{label}</p>
    <p className="text-3xl font-mono font-bold text-primary mt-1">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
  </div>
);

const TechStackItem = ({
  category,
  technology,
  description,
}: {
  category: string;
  technology: string;
  description: string;
}) => (
  <div className="p-3 bg-background/30 rounded-lg border border-border/30">
    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">{category}</p>
    <p className="text-sm font-bold text-foreground mt-1">{technology}</p>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
);

const PipelineStep = ({ step, title, description }: { step: number; title: string; description: string }) => (
  <div className="text-center p-4 bg-background/30 rounded-lg border border-primary/30 min-w-[140px]">
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
      <span className="text-primary font-mono font-bold">{step}</span>
    </div>
    <p className="text-sm font-bold text-foreground">{title}</p>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
);

const MembershipTable = ({
  variable,
  unit,
  range,
  low,
  medium,
  high,
}: {
  variable: string;
  unit: string;
  range: string;
  low: string;
  medium: string;
  high: string;
}) => (
  <div className="p-4 bg-background/30 rounded-lg border border-border/30">
    <div className="flex items-center justify-between mb-3">
      <span className="font-bold text-foreground">{variable}</span>
      <Badge variant="outline">
        {range} {unit}
      </Badge>
    </div>
    <div className="space-y-1 text-xs">
      <p>
        <span className="text-status-safe">Low:</span> {low}
      </p>
      <p>
        <span className="text-status-caution">Medium:</span> {medium}
      </p>
      <p>
        <span className="text-status-critical">High:</span> {high}
      </p>
    </div>
  </div>
);

const RuleDisplay = ({ id, rule }: { id: number; rule: string }) => (
  <p>
    <span className="text-primary">R{id}:</span> {rule}
  </p>
);

export default Documentation;
