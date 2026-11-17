import React from 'react'
import { FuelInjectionType } from '@/types/vehicle'
import { CheckCircle2, Zap, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FuelInjectionSelectorProps {
  value: FuelInjectionType;
  onChange: (val: FuelInjectionType) => void;
  error?: string;
}

export const FuelInjectionSelector: React.FC<FuelInjectionSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200">
          Fuel Injection Architecture <span className="text-rose-400">*</span>
        </label>
        <span className="text-xs text-slate-400 font-mono">SELECT TECHNOLOGY</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MPFI Card */}
        <div
          onClick={() => onChange('MPFI')}
          className={cn(
            'relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 text-left',
            value === 'MPFI'
              ? 'border-blue-500 bg-blue-950/40 shadow-glow-blue/40 ring-1 ring-blue-500/50'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'rounded-xl p-2.5 transition-colors',
                  value === 'MPFI'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                )}
              >
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-mono">MPFI</h4>
                <p className="text-xs font-medium text-slate-300">
                  Multi-Point Fuel Injection
                </p>
              </div>
            </div>

            <div
              className={cn(
                'h-5 w-5 rounded-full border flex items-center justify-center transition-all',
                value === 'MPFI'
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-slate-700 bg-slate-800'
              )}
            >
              {value === 'MPFI' && <CheckCircle2 className="h-4 w-4" />}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Fuel is injected into the intake manifold or port ahead of each cylinder intake valve. Operates at lower fuel pressure (3–5 bar).
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="rounded bg-slate-800/90 px-2 py-0.5 text-slate-300 border border-slate-700/50">
              Pressure: 3 - 5 bar
            </span>
            <span className="rounded bg-slate-800/90 px-2 py-0.5 text-blue-300 border border-slate-700/50">
              Low Pump Stress
            </span>
            <span className="rounded bg-slate-800/90 px-2 py-0.5 text-slate-400 border border-slate-700/50">
              Port Injection
            </span>
          </div>
        </div>

        {/* GDI Card */}
        <div
          onClick={() => onChange('GDI')}
          className={cn(
            'relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 text-left',
            value === 'GDI'
              ? 'border-cyan-500 bg-cyan-950/40 shadow-glow-cyan/40 ring-1 ring-cyan-500/50'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'rounded-xl p-2.5 transition-colors',
                  value === 'GDI'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                )}
              >
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-mono">GDI</h4>
                <p className="text-xs font-medium text-slate-300">
                  Gasoline Direct Injection
                </p>
              </div>
            </div>

            <div
              className={cn(
                'h-5 w-5 rounded-full border flex items-center justify-center transition-all',
                value === 'GDI'
                  ? 'border-cyan-500 bg-cyan-500 text-white'
                  : 'border-slate-700 bg-slate-800'
              )}
            >
              {value === 'GDI' && <CheckCircle2 className="h-4 w-4" />}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Fuel is injected directly into the combustion chamber under ultra-high pressure (150–250 bar). Extracts higher thermal efficiency from ethanol charge cooling.
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="rounded bg-slate-800/90 px-2 py-0.5 text-slate-300 border border-slate-700/50">
              Pressure: 150 - 250 bar
            </span>
            <span className="rounded bg-slate-800/90 px-2 py-0.5 text-cyan-300 border border-slate-700/50">
              High Charge Cooling
            </span>
            <span className="rounded bg-slate-800/90 px-2 py-0.5 text-slate-400 border border-slate-700/50">
              In-Cylinder
            </span>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  )
}
