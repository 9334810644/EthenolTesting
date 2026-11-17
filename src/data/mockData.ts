import { FullVehicleAnalysis } from '@/types/analysis'
import { VehicleInput } from '@/types/vehicle'
import { MockCalculationService } from '@/services/mockCalculationService'

export const INITIAL_DEMO_VEHICLES: (VehicleInput & { id: string; title: string; createdAt: string })[] = [
  {
    id: 'ANL-2026-0841',
    title: 'Compact Sedan 1.2L DualJet',
    vehicleWeight: 1140,
    odometer: 32500,
    ethanolBlend: 20,
    fuelInjection: 'MPFI',
    manufacturingYear: 2022,
    baseMileage: 18.5,
    createdAt: '2026-11-15T09:30:00.000Z',
  },
  {
    id: 'ANL-2026-0842',
    title: 'Midsize SUV 1.5L Turbo GDI',
    vehicleWeight: 1480,
    odometer: 18200,
    ethanolBlend: 20,
    fuelInjection: 'GDI',
    manufacturingYear: 2024,
    baseMileage: 15.2,
    createdAt: '2026-11-16T14:15:00.000Z',
  },
  {
    id: 'ANL-2026-0839',
    title: 'Hatchback 1.2L VVT',
    vehicleWeight: 980,
    odometer: 78000,
    ethanolBlend: 10,
    fuelInjection: 'MPFI',
    manufacturingYear: 2018,
    baseMileage: 20.0,
    createdAt: '2026-11-12T11:20:00.000Z',
  },
  {
    id: 'ANL-2026-0837',
    title: 'Executive Sedan 2.0L TSI GDI',
    vehicleWeight: 1560,
    odometer: 44300,
    ethanolBlend: 25,
    fuelInjection: 'GDI',
    manufacturingYear: 2021,
    baseMileage: 14.0,
    createdAt: '2026-11-10T16:45:00.000Z',
  },
  {
    id: 'ANL-2026-0834',
    title: 'Crossover 1.0L Boosterjet GDI',
    vehicleWeight: 1220,
    odometer: 9400,
    ethanolBlend: 15,
    fuelInjection: 'GDI',
    manufacturingYear: 2024,
    baseMileage: 17.8,
    createdAt: '2026-11-08T08:10:00.000Z',
  },
  {
    id: 'ANL-2026-0830',
    title: 'Subcompact MPFI Commuter',
    vehicleWeight: 1050,
    odometer: 112000,
    ethanolBlend: 20,
    fuelInjection: 'MPFI',
    manufacturingYear: 2016,
    baseMileage: 19.2,
    createdAt: '2026-11-05T13:25:00.000Z',
  },
  {
    id: 'ANL-2026-0820',
    title: 'Legacy Sedan (Pre-2008 Rubber Lines)',
    vehicleWeight: 1180,
    odometer: 145000,
    ethanolBlend: 20,
    fuelInjection: 'MPFI',
    manufacturingYear: 2005,
    baseMileage: 16.5,
    createdAt: '2026-10-28T09:15:00.000Z',
  },
  {
    id: 'ANL-2026-0826',
    title: 'Flex-Fuel Prototype Test Mule',
    vehicleWeight: 1350,
    odometer: 15000,
    ethanolBlend: 85,
    fuelInjection: 'GDI',
    manufacturingYear: 2025,
    baseMileage: 16.0,
    createdAt: '2026-11-01T10:00:00.000Z',
  },
]

export function generateInitialAnalyses(): FullVehicleAnalysis[] {
  return INITIAL_DEMO_VEHICLES.map((v) => {
    const input: VehicleInput = {
      vehicleWeight: v.vehicleWeight,
      odometer: v.odometer,
      ethanolBlend: v.ethanolBlend,
      fuelInjection: v.fuelInjection,
      manufacturingYear: v.manufacturingYear,
      baseMileage: v.baseMileage,
      vehicleModel: v.title,
    }
    const results = MockCalculationService.calculateAnalysis(input)
    return {
      id: v.id,
      title: v.title,
      vehicleInput: input,
      results,
      createdAt: v.createdAt,
      status: 'completed',
    }
  })
}
