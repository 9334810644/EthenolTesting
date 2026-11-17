import { VehicleInput, FuelInjectionType } from './vehicle'

export type RiskClassification = 'Low' | 'Moderate' | 'Elevated' | 'Critical'

export type DecisionColor = 'GREEN' | 'YELLOW' | 'RED'

export interface E20DecisionGate {
  color: DecisionColor;
  headline: string; // e.g. "SAFE: Vehicle is fully compatible with E20."
  meaning: string;
  uiDisplay: string;
  fuelTrimReq: number; // FT_req in %
  corrosionIndexReal: number; // CI_real in points (0-100)
  mileageDropPercent: number; // ΔM in %
  fuelTrimStatus: 'optimal' | 'advisory' | 'critical';
  corrosionStatus: 'optimal' | 'advisory' | 'critical';
  mileageDropStatus: 'optimal' | 'advisory' | 'critical';
}

export interface ParameterCalculation {
  name: string;
  symbol: string;
  value: number | string;
  unit: string;
  formulaReference: string;
  description?: string;
  status?: 'optimal' | 'warning' | 'critical' | 'neutral' | 'advisory';
}

export interface ComponentWearEstimate {
  component: string;
  stressLevel: number; // 0 to 100
  toleranceStatus: 'Within Tolerance' | 'Advisory' | 'Degraded' | 'High Wear Risk';
  estimatedLifeImpactHours: string;
}

export interface MechanicalSafetyAnalysis {
  safetyIndex: number; // 0 - 100 scale
  engineStressIndicator: number; // 0 - 100 scale (%)
  vehicleConditionIndicator: number; // 0 - 100 scale (%)
  riskClassification: RiskClassification;
  corrosionRiskScore: number;
  combustionTemperatureDelta: number; // °C
  injectorDutyCycleDelta: number; // %
  componentWear: ComponentWearEstimate[];
  decisionGate: E20DecisionGate;
}

export interface EconomicEfficiencyAnalysis {
  estimatedMileage: number; // km/L
  fuelConsumption: number; // L/100km
  mileageDifferenceKmPerL: number; // delta in km/L
  mileageDifferencePercent: number; // percentage change vs base
  economicEfficiencyIndex: number; // 0 - 100 score
  estimatedCostPer100Km: number; // monetary units / 100km
  annualFuelExpenseDelta: number; // estimated savings or extra expense
}

export interface FuelPropertyAnalysis {
  blendPercentage: number;
  stoichiometricAfr: number; // air-fuel ratio
  latentHeatVaporization: number; // kJ/kg
  estimatedOctaneRating: number; // RON
  energyDensity: number; // MJ/L
  energyDensityLossPercent: number;
}

export interface BlendCurvePoint {
  blend: number; // e.g. 0, 5, 10, 15, 20, 25, 30, 50, 85
  mileage: number; // km/L
  safetyIndex: number; // 0 - 100
  fuelConsumption: number; // L/100km
  costIndex: number;
}

export interface RadarMetricPoint {
  subject: string;
  score: number;
  baseline: number;
  fullMark: number;
}

export interface AnalysisResults {
  mechanicalSafety: MechanicalSafetyAnalysis;
  economicEfficiency: EconomicEfficiencyAnalysis;
  fuelProperties: FuelPropertyAnalysis;
  detailedParameters: {
    safetyParameters: ParameterCalculation[];
    economicParameters: ParameterCalculation[];
    fuelParameters: ParameterCalculation[];
    intermediateCalculations: ParameterCalculation[];
    inputParameters: ParameterCalculation[];
  };
  blendCurve: BlendCurvePoint[];
  radarMetrics: RadarMetricPoint[];
  calculationTimestamp: string;
  isMockDemonstration: boolean;
  version: string;
}

export interface FullVehicleAnalysis {
  id: string;
  vehicleInput: VehicleInput;
  results: AnalysisResults;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  title?: string;
}

export interface InjectionComparisonResult {
  input: VehicleInput;
  mpfi: AnalysisResults;
  gdi: AnalysisResults;
  comparisonMetrics: {
    parameter: string;
    unit: string;
    mpfiValue: number;
    gdiValue: number;
    difference: number;
    favors: FuelInjectionType | 'Equivalent';
    summary: string;
  }[];
}
