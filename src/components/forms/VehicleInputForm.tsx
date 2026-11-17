import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { VehicleInput, FuelInjectionType } from '@/types/vehicle'
import { FuelInjectionSelector } from './FuelInjectionSelector'
import { EthanolBlendInput } from './EthanolBlendInput'
import { RotateCcw, Calculator, Car, Weight, Navigation, Calendar, Gauge, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const currentYear = new Date().getFullYear()

const vehicleSchema = z.object({
  vehicleWeight: z
    .number()
    .min(500, 'Weight must be at least 500 kg')
    .max(5000, 'Weight must not exceed 5,000 kg'),
  odometer: z
    .number()
    .min(0, 'Odometer reading cannot be negative')
    .max(1000000, 'Odometer must not exceed 1,000,000 km'),
  manufacturingYear: z
    .number()
    .int('Year must be an integer')
    .min(1995, 'Year must be 1995 or later')
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  baseMileage: z
    .number()
    .min(3, 'Base mileage must be at least 3 km/l')
    .max(50, 'Base mileage must not exceed 50 km/l'),
  ethanolBlend: z
    .number()
    .min(0, 'Blend cannot be negative')
    .max(100, 'Blend cannot exceed 100%'),
  fuelInjection: z.enum(['MPFI', 'GDI'] as const),
  vehicleModel: z.string().optional(),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

interface VehicleInputFormProps {
  initialValues?: Partial<VehicleInput>;
  onSubmit: (values: VehicleInput) => void;
  isLoading?: boolean;
}

export const VehicleInputForm: React.FC<VehicleInputFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const defaultValues: VehicleFormValues = {
    vehicleWeight: initialValues?.vehicleWeight ?? 1250,
    odometer: initialValues?.odometer ?? 24500,
    manufacturingYear: initialValues?.manufacturingYear ?? 2022,
    baseMileage: initialValues?.baseMileage ?? 17.5,
    ethanolBlend: initialValues?.ethanolBlend ?? 20,
    fuelInjection: initialValues?.fuelInjection ?? 'MPFI',
    vehicleModel: initialValues?.vehicleModel ?? '',
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
  })

  const onFormSubmit = (data: VehicleFormValues) => {
    onSubmit({
      vehicleWeight: data.vehicleWeight,
      odometer: data.odometer,
      manufacturingYear: data.manufacturingYear,
      baseMileage: data.baseMileage,
      ethanolBlend: data.ethanolBlend,
      fuelInjection: data.fuelInjection as FuelInjectionType,
      vehicleModel: data.vehicleModel,
    })
  }

  // Preset quick fill options
  const presets = [
    {
      label: 'Standard Hatchback (MPFI)',
      model: 'Swift 1.2L DualJet',
      weight: 980,
      odometer: 18000,
      year: 2022,
      mileage: 20.5,
      blend: 20,
      injection: 'MPFI' as const,
    },
    {
      label: 'Modern Turbo SUV (GDI)',
      model: 'Creta 1.5L Turbo GDI',
      weight: 1380,
      odometer: 14000,
      year: 2023,
      mileage: 16.0,
      blend: 20,
      injection: 'GDI' as const,
    },
    {
      label: 'Legacy Vehicle (Pre-2005)',
      model: 'Legacy 1.5L VTEC',
      weight: 1150,
      odometer: 120000,
      year: 2004,
      mileage: 13.5,
      blend: 20,
      injection: 'MPFI' as const,
    },
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    setValue('vehicleModel', preset.model)
    setValue('vehicleWeight', preset.weight)
    setValue('odometer', preset.odometer)
    setValue('manufacturingYear', preset.year)
    setValue('baseMileage', preset.mileage)
    setValue('ethanolBlend', preset.blend)
    setValue('fuelInjection', preset.injection)
  }

  const yearOptions: number[] = []
  for (let y = currentYear; y >= 2000; y--) {
    yearOptions.push(y)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* QUICK PRESETS ROW */}
      <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Quick Fill Vehicle Profiles
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="p-3 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900 text-left transition-all group"
            >
              <p className="text-xs font-bold text-white group-hover:text-cyan-300">{p.label}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{p.model} • {p.injection}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: VEHICLE SPECIFICATIONS */}
      <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="rounded-2xl bg-blue-500/10 p-2.5 text-blue-400 border border-blue-500/20">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Vehicle Parameters
            </h3>
            <p className="text-xs text-slate-400">
              Curb weight, lifecycle odometer reading, model year, and reference pure petrol mileage.
            </p>
          </div>
        </div>

        {/* Optional Model / Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Vehicle Name / Model (Optional)
          </label>
          <input
            type="text"
            {...register('vehicleModel')}
            placeholder="e.g. Maruti Swift 1.2 DualJet or Hyundai Creta GDI"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Vehicle Weight */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Weight className="h-3.5 w-3.5 text-blue-400" />
                Weight (m)
              </span>
              <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                {...register('vehicleWeight', { valueAsNumber: true })}
                className={cn(
                  'w-full rounded-2xl border bg-slate-950/70 px-4 py-2.5 pr-10 text-sm font-mono text-white',
                  'focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all',
                  errors.vehicleWeight ? 'border-rose-500' : 'border-white/10'
                )}
                placeholder="1250"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs font-mono text-slate-400">
                kg
              </span>
            </div>
            {errors.vehicleWeight ? (
              <p className="text-xs text-rose-400">{errors.vehicleWeight.message}</p>
            ) : (
              <p className="text-[10px] text-slate-500 font-mono">Cload drag coefficient</p>
            )}
          </div>

          {/* 2. Total Odometer Reading */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-cyan-400" />
                Odometer (odo)
              </span>
              <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                {...register('odometer', { valueAsNumber: true })}
                className={cn(
                  'w-full rounded-2xl border bg-slate-950/70 px-4 py-2.5 pr-10 text-sm font-mono text-white',
                  'focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all',
                  errors.odometer ? 'border-rose-500' : 'border-white/10'
                )}
                placeholder="24500"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs font-mono text-slate-400">
                km
              </span>
            </div>
            {errors.odometer ? (
              <p className="text-xs text-rose-400">{errors.odometer.message}</p>
            ) : (
              <p className="text-[10px] text-slate-500 font-mono">Cage &amp; CI life cycles</p>
            )}
          </div>

          {/* 3. Year of Manufacture */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-purple-400" />
                Model Year
              </span>
              <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <select
                {...register('manufacturingYear', { valueAsNumber: true })}
                className={cn(
                  'w-full rounded-2xl border bg-slate-950/70 px-4 py-2.5 text-sm font-mono text-white',
                  'focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all',
                  errors.manufacturingYear ? 'border-rose-500' : 'border-white/10'
                )}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year} className="bg-slate-900 text-white">
                    {year} {year >= 2015 ? '(PTFE)' : year >= 2005 ? '(FKM)' : '(Buna-N)'}
                  </option>
                ))}
              </select>
            </div>
            {errors.manufacturingYear ? (
              <p className="text-xs text-rose-400">{errors.manufacturingYear.message}</p>
            ) : (
              <p className="text-[10px] text-slate-500 font-mono">Cmat material baseline</p>
            )}
          </div>

          {/* 4. Base Mileage */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-emerald-400" />
                Base Mileage (Mo)
              </span>
              <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                {...register('baseMileage', { valueAsNumber: true })}
                className={cn(
                  'w-full rounded-2xl border bg-slate-950/70 px-4 py-2.5 pr-14 text-sm font-mono text-white',
                  'focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all',
                  errors.baseMileage ? 'border-rose-500' : 'border-white/10'
                )}
                placeholder="17.5"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs font-mono text-slate-400">
                km/L
              </span>
            </div>
            {errors.baseMileage ? (
              <p className="text-xs text-rose-400">{errors.baseMileage.message}</p>
            ) : (
              <p className="text-[10px] text-slate-500 font-mono">Pure petrol E0 benchmark</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: FUEL & POWERTRAIN */}
      <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl shadow-xl space-y-6">
        {/* Ethanol Blend Input */}
        <Controller
          control={control}
          name="ethanolBlend"
          render={({ field }) => (
            <EthanolBlendInput
              value={field.value}
              onChange={field.onChange}
              error={errors.ethanolBlend?.message}
            />
          )}
        />

        <div className="border-t border-white/5 pt-6">
          {/* Fuel Injection Selector */}
          <Controller
            control={control}
            name="fuelInjection"
            render={({ field }) => (
              <FuelInjectionSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.fuelInjection?.message}
              />
            )}
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => reset(defaultValues)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Parameters</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Calculator className="h-4 w-4" />
          <span>{isLoading ? 'Running Thermodynamic Calculations...' : 'Execute Vehicle Analysis'}</span>
        </button>
      </div>
    </form>
  )
}
