import React from 'react'
import { AnalysisResults } from '@/types/analysis'
import { FuelInjectionType } from '@/types/vehicle'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { Gauge, Zap, Fuel, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonCardProps {
  type: FuelInjectionType;
  results: AnalysisResults;
  isFavoredOverall?: boolean;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  type,
  results,
  isFavoredOverall,
}) => {
  const isGdi = type === 'GDI'

  return (
    <div
      className={cn(
        'rounded-3xl border p-6 backdrop-blur-2xl shadow-xl transition-all',
        isGdi
          ? 'border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-slate-900/60 to-slate-900/40 shadow-cyan-500/5'
          : 'border-blue-500/30 bg-gradient-to-b from-blue-950/20 via-slate-900/60 to-slate-900/40 shadow-blue-500/5'
      )}
    >
      {/* Title & Badge */}
      <div className="flex items-start justify-between pb-4 border-b border-white/5 mb-5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'rounded-2xl p-3',
              isGdi ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
            )}
          >
            {isGdi ? <Zap className="h-6 w-6" /> : <Gauge className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white font-mono">
                {type} Engine
              </h3>
              <StatusIndicator status={type} size="sm" showIcon={false} />
            </div>
            <p className="text-xs text-slate-400">
              {isGdi ? 'Gasoline Direct Injection (Cengine = 0.9)' : 'Multi-Point Fuel Injection (Cengine = 1.0)'}
            </p>
          </div>
        </div>

        {isFavoredOverall && (
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
            Higher Efficiency
          </span>
        )}
      </div>

      {/* E20 Decision Gate Result */}
      {results.mechanicalSafety.decisionGate && (
        <div
          className={cn(
            'rounded-2xl border p-3.5 mb-5 flex items-center justify-between text-xs',
            results.mechanicalSafety.decisionGate.color === 'GREEN'
              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
              : results.mechanicalSafety.decisionGate.color === 'YELLOW'
              ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
              : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded-full border border-current">
              {results.mechanicalSafety.decisionGate.color}
            </span>
            <span className="font-semibold text-white">
              {results.mechanicalSafety.decisionGate.uiDisplay}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-300">
            Trim: {results.mechanicalSafety.decisionGate.fuelTrimReq}%
          </span>
        </div>
      )}

      {/* Primary Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-4">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">
            ESTIMATED MILEAGE
          </span>
          <div className="text-2xl font-extrabold font-mono text-white">
            {results.economicEfficiency.estimatedMileage}{' '}
            <span className="text-xs text-slate-400 font-normal">km/L</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {results.economicEfficiency.mileageDifferencePercent}% drop
          </span>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-4">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">
            REQUIRED FUEL TRIM
          </span>
          <div className={cn('text-2xl font-extrabold font-mono', isGdi ? 'text-cyan-400' : 'text-blue-400')}>
            {results.mechanicalSafety.decisionGate.fuelTrimReq}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            C_engine: {isGdi ? '0.9 (-10% trim)' : '1.0 (baseline)'}
          </span>
        </div>
      </div>

      {/* Diagnostic Specs */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center py-2 border-b border-white/5 text-slate-300">
          <span className="text-slate-400">Mileage Drop (ΔM)</span>
          <span className="font-mono font-bold text-emerald-400">{results.mechanicalSafety.decisionGate.mileageDropPercent}%</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5 text-slate-300">
          <span className="text-slate-400">Fuel Consumption</span>
          <span className="font-mono font-bold text-white">{results.economicEfficiency.fuelConsumption} L/100km</span>
        </div>
        <div className="flex justify-between items-center py-2 text-slate-300">
          <span className="text-slate-400">Corrosion Risk Index (CI)</span>
          <span className="font-mono font-bold text-amber-400">{results.mechanicalSafety.decisionGate.corrosionIndexReal} / 100</span>
        </div>
      </div>
    </div>
  )
}
