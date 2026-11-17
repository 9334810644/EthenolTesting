import React from 'react'
import { VehicleInput } from '@/types/vehicle'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { Weight, Navigation, Calendar, Gauge, Flame, Clock } from 'lucide-react'

interface VehicleSummaryHeaderProps {
  id: string;
  vehicleInput: VehicleInput;
  createdAt: string;
  title?: string;
}

export const VehicleSummaryHeader: React.FC<VehicleSummaryHeaderProps> = ({
  id,
  vehicleInput,
  createdAt,
  title,
}) => {
  return (
    <div className="rounded-3xl border border-white/5 bg-[#0f172a]/70 p-6 backdrop-blur-2xl shadow-xl">
      {/* Top Bar: ID, Date, Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {id}
            </span>
            <StatusIndicator status={vehicleInput.fuelInjection} size="sm" />
            <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-slate-400">
              {vehicleInput.fuelInjection === 'MPFI' ? 'Port Multi-Point Injection' : 'Gasoline Direct Injection'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pt-1">
            {title || `${vehicleInput.manufacturingYear} Four-Wheeler Benchmark`}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Specification Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
        {/* Weight */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-1">
            <Weight className="h-3.5 w-3.5 text-blue-400" />
            <span>Weight (m)</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {vehicleInput.vehicleWeight} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
        </div>

        {/* Odometer */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-1">
            <Navigation className="h-3.5 w-3.5 text-cyan-400" />
            <span>Odometer</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {vehicleInput.odometer.toLocaleString()} <span className="text-xs text-slate-500 font-normal">km</span>
          </div>
        </div>

        {/* Manufacturing Year */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-1">
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
            <span>Model Year</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {vehicleInput.manufacturingYear}
          </div>
        </div>

        {/* Base Mileage */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-1">
            <Gauge className="h-3.5 w-3.5 text-emerald-400" />
            <span>Base E0 (Mo)</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {vehicleInput.baseMileage} <span className="text-xs text-slate-500 font-normal">km/L</span>
          </div>
        </div>

        {/* Ethanol Blend */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/30 p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-blue-300 text-xs font-mono mb-1">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Ethanol Blend (x)</span>
          </div>
          <div className="text-base font-extrabold font-mono text-white">
            E{vehicleInput.ethanolBlend} <span className="text-xs text-blue-300 font-normal">({vehicleInput.ethanolBlend}%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
