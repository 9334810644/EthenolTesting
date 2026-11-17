export type FuelInjectionType = 'MPFI' | 'GDI'

export interface VehicleInput {
  vehicleWeight: number; // Variable: m (kg)
  odometer: number; // Variable: odo (km)
  ethanolBlend: number; // Variable: X (%)
  fuelInjection: FuelInjectionType;
  manufacturingYear: number;
  baseMileage: number; // Variable: Mo (km/l)
  vehicleModel?: string; // Optional friendly identifier e.g. "Sedan 1.5L TSI"
}

export interface VehicleRecord extends VehicleInput {
  id: string;
  createdAt: string;
}
