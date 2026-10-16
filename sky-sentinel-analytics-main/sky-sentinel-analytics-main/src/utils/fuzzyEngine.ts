// SkySentinel Fuzzy Logic Engine
// Complete implementation with Fuzzification, Inference, Aggregation, and Defuzzification

export interface FuzzyMembership {
  low: number;
  medium: number;
  high: number;
}

export interface FuzzyInputs {
  wind: number;
  humidity: number;
  temperature: number;
}

export interface RuleResult {
  ruleId: number;
  description: string;
  inputs: {
    wind: string;
    humidity: string;
    temperature: string;
  };
  output: 'Stable' | 'Caution' | 'Critical';
  firingStrength: number;
  active: boolean;
}

export interface FuzzyResult {
  dangerPercentage: number;
  status: 'Stable' | 'Caution' | 'Critical';
  windMembership: FuzzyMembership;
  humidityMembership: FuzzyMembership;
  temperatureMembership: FuzzyMembership;
  firedRules: RuleResult[];
  aggregatedStrengths: {
    stable: number;
    caution: number;
    critical: number;
  };
}

// Membership function helpers - Linear Interpolation
const trapezoidalLeft = (x: number, a: number, b: number): number => {
  if (x <= a) return 1;
  if (x >= b) return 0;
  return (b - x) / (b - a);
};

const trapezoidalRight = (x: number, a: number, b: number): number => {
  if (x <= a) return 0;
  if (x >= b) return 1;
  return (x - a) / (b - a);
};

const triangular = (x: number, a: number, b: number, c: number): number => {
  if (x <= a || x >= c) return 0;
  if (x <= b) return (x - a) / (b - a);
  return (c - x) / (c - b);
};

// Fuzzification Functions
export const fuzzifyWind = (wind: number): FuzzyMembership => ({
  low: trapezoidalLeft(wind, 0, 10),      // 0-10 full membership, fades to 10
  medium: triangular(wind, 8, 16.5, 25),  // Peak at 16.5
  high: trapezoidalRight(wind, 20, 60),   // Starts at 20, full at 60+
});

export const fuzzifyHumidity = (humidity: number): FuzzyMembership => ({
  low: trapezoidalLeft(humidity, 0, 40),     // 0-30 full, fades to 40
  medium: triangular(humidity, 30, 50, 70),  // Peak at 50
  high: trapezoidalRight(humidity, 60, 100), // Starts at 60, full at 100
});

export const fuzzifyTemperature = (temp: number): FuzzyMembership => ({
  low: trapezoidalLeft(temp, 0, 22),      // Cold for tropical: 0-18 full, fades to 22
  medium: triangular(temp, 20, 26, 32),   // Optimal: peak at 26
  high: trapezoidalRight(temp, 30, 45),   // Hot: starts at 30, full at 45+
});

// Output centers for Weighted Average defuzzification
const OUTPUT_CENTERS = {
  Stable: 15,
  Caution: 50,
  Critical: 85,
};

// The 27 Rules Knowledge Base
type FuzzyLevel = 'Low' | 'Medium' | 'High';
type OutputLevel = 'Stable' | 'Caution' | 'Critical';

interface FuzzyRule {
  wind: FuzzyLevel;
  humidity: FuzzyLevel;
  temperature: FuzzyLevel;
  output: OutputLevel;
}

const FUZZY_RULES: FuzzyRule[] = [
  // Low Temperature (Cold)
  { wind: 'Low', humidity: 'Low', temperature: 'Low', output: 'Stable' },
  { wind: 'Low', humidity: 'Medium', temperature: 'Low', output: 'Stable' },
  { wind: 'Low', humidity: 'High', temperature: 'Low', output: 'Caution' },
  { wind: 'Medium', humidity: 'Low', temperature: 'Low', output: 'Stable' },
  { wind: 'Medium', humidity: 'Medium', temperature: 'Low', output: 'Caution' },
  { wind: 'Medium', humidity: 'High', temperature: 'Low', output: 'Caution' },
  { wind: 'High', humidity: 'Low', temperature: 'Low', output: 'Caution' },
  { wind: 'High', humidity: 'Medium', temperature: 'Low', output: 'Caution' },
  { wind: 'High', humidity: 'High', temperature: 'Low', output: 'Critical' },
  
  // Medium Temperature (Mild/Optimal)
  { wind: 'Low', humidity: 'Low', temperature: 'Medium', output: 'Stable' },
  { wind: 'Low', humidity: 'Medium', temperature: 'Medium', output: 'Stable' },
  { wind: 'Low', humidity: 'High', temperature: 'Medium', output: 'Caution' },
  { wind: 'Medium', humidity: 'Low', temperature: 'Medium', output: 'Stable' },
  { wind: 'Medium', humidity: 'Medium', temperature: 'Medium', output: 'Caution' },
  { wind: 'Medium', humidity: 'High', temperature: 'Medium', output: 'Caution' },
  { wind: 'High', humidity: 'Low', temperature: 'Medium', output: 'Caution' },
  { wind: 'High', humidity: 'Medium', temperature: 'Medium', output: 'Critical' },
  { wind: 'High', humidity: 'High', temperature: 'Medium', output: 'Critical' },
  
  // High Temperature (Hot)
  { wind: 'Low', humidity: 'Low', temperature: 'High', output: 'Caution' },
  { wind: 'Low', humidity: 'Medium', temperature: 'High', output: 'Caution' },
  { wind: 'Low', humidity: 'High', temperature: 'High', output: 'Critical' },
  { wind: 'Medium', humidity: 'Low', temperature: 'High', output: 'Caution' },
  { wind: 'Medium', humidity: 'Medium', temperature: 'High', output: 'Critical' },
  { wind: 'Medium', humidity: 'High', temperature: 'High', output: 'Critical' },
  { wind: 'High', humidity: 'Low', temperature: 'High', output: 'Critical' },
  { wind: 'High', humidity: 'Medium', temperature: 'High', output: 'Critical' },
  { wind: 'High', humidity: 'High', temperature: 'High', output: 'Critical' },
];

// Get membership value by level name
const getMembershipValue = (membership: FuzzyMembership, level: FuzzyLevel): number => {
  switch (level) {
    case 'Low': return membership.low;
    case 'Medium': return membership.medium;
    case 'High': return membership.high;
  }
};

// Main Fuzzy Engine Function
export const calculateFuzzyRisk = (inputs: FuzzyInputs): FuzzyResult => {
  const { wind, humidity, temperature } = inputs;
  
  // Step 1: Fuzzification
  const windMembership = fuzzifyWind(wind);
  const humidityMembership = fuzzifyHumidity(humidity);
  const temperatureMembership = fuzzifyTemperature(temperature);
  
  // Step 2: Rule Evaluation (Min-Max Method)
  const firedRules: RuleResult[] = FUZZY_RULES.map((rule, index) => {
    const windStrength = getMembershipValue(windMembership, rule.wind);
    const humStrength = getMembershipValue(humidityMembership, rule.humidity);
    const tempStrength = getMembershipValue(temperatureMembership, rule.temperature);
    
    // AND operator = MIN
    const firingStrength = Math.min(windStrength, humStrength, tempStrength);
    
    return {
      ruleId: index + 1,
      description: `IF Wind=${rule.wind} AND Humidity=${rule.humidity} AND Temp=${rule.temperature} THEN ${rule.output}`,
      inputs: {
        wind: rule.wind,
        humidity: rule.humidity,
        temperature: rule.temperature,
      },
      output: rule.output,
      firingStrength: Math.round(firingStrength * 1000) / 1000,
      active: firingStrength > 0,
    };
  });
  
  // Step 3: Aggregation (MAX for same outputs)
  const aggregatedStrengths = {
    stable: 0,
    caution: 0,
    critical: 0,
  };
  
  firedRules.forEach(rule => {
    if (rule.output === 'Stable') {
      aggregatedStrengths.stable = Math.max(aggregatedStrengths.stable, rule.firingStrength);
    } else if (rule.output === 'Caution') {
      aggregatedStrengths.caution = Math.max(aggregatedStrengths.caution, rule.firingStrength);
    } else {
      aggregatedStrengths.critical = Math.max(aggregatedStrengths.critical, rule.firingStrength);
    }
  });
  
  // Step 4: Defuzzification (Weighted Average Method)
  const numerator = 
    aggregatedStrengths.stable * OUTPUT_CENTERS.Stable +
    aggregatedStrengths.caution * OUTPUT_CENTERS.Caution +
    aggregatedStrengths.critical * OUTPUT_CENTERS.Critical;
  
  const denominator = 
    aggregatedStrengths.stable + 
    aggregatedStrengths.caution + 
    aggregatedStrengths.critical;
  
  // Handle edge case where no rules fire
  const dangerPercentage = denominator > 0 
    ? Math.round((numerator / denominator) * 10) / 10
    : 0;
  
  // Determine overall status
  let status: 'Stable' | 'Caution' | 'Critical';
  if (dangerPercentage < 35) {
    status = 'Stable';
  } else if (dangerPercentage < 70) {
    status = 'Caution';
  } else {
    status = 'Critical';
  }
  
  return {
    dangerPercentage,
    status,
    windMembership,
    humidityMembership,
    temperatureMembership,
    firedRules,
    aggregatedStrengths,
  };
};

// Hook for easy React integration
export const useFuzzyEngine = () => {
  return { calculateFuzzyRisk };
};

// Generate membership function points for visualization
export const getMembershipPoints = (
  type: 'wind' | 'humidity' | 'temperature',
  resolution: number = 100
): { x: number; low: number; medium: number; high: number }[] => {
  const points: { x: number; low: number; medium: number; high: number }[] = [];
  
  const maxValue = type === 'wind' ? 100 : type === 'humidity' ? 100 : 50;
  
  for (let i = 0; i <= resolution; i++) {
    const x = (i / resolution) * maxValue;
    let membership: FuzzyMembership;
    
    switch (type) {
      case 'wind':
        membership = fuzzifyWind(x);
        break;
      case 'humidity':
        membership = fuzzifyHumidity(x);
        break;
      case 'temperature':
        membership = fuzzifyTemperature(x);
        break;
    }
    
    points.push({
      x,
      low: membership.low,
      medium: membership.medium,
      high: membership.high,
    });
  }
  
  return points;
};
