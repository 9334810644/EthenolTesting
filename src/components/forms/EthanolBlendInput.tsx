import React from 'react'
import { Flame, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EthanolBlendInputProps {
  value: number;
  onChange: (val: number) => void;
  error?: string;
}

export const EthanolBlendInput: React.FC<EthanolBlendInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const commonPresets = [5, 10, 15, 20, 25, 30, 50, 85]

  const getBlendCategory = (val: number) => {
    if (val <= 10) return { label: 'Commercial Standard (E10)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
    if (val <= 20) return { label: 'Government Mandated Blend (E20)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
    if (val <= 30) return { label: 'Medium Biofuel Blend (E25-E30)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    return { label: 'High Ethanol / Flex-Fuel (E85 Spec)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
  }

  const category = getBlendCategory(value)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>Ethanol Blend Percentage</span>
          <span className="text-xs font-mono text-cyan-400">(Variable: X)</span>
          <span className="text-rose-400">*</span>
        </label>
        <span
          className={cn(
            'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium border font-mono',
            category.color
          )}
        >
          {category.label}
        </span>
      </div>

      {/* Main Numeric Input & Slider Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Direct Number Input */}
        <div className="relative w-full sm:w-48">
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={isNaN(value) ? '' : value}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value)
              onChange(isNaN(parsed) ? 0 : parsed)
            }}
            className={cn(
              'w-full rounded-xl border bg-slate-900 px-4 py-2.5 pr-12 text-lg font-bold font-mono text-white transition-all',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              error ? 'border-rose-500' : 'border-slate-800'
            )}
            placeholder="20"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 font-mono font-bold text-sm">
            % vol
          </div>
        </div>

        {/* Range Slider for Fluid adjustments */}
        <div className="flex-1 flex items-center gap-3 px-2">
          <span className="text-xs font-mono text-slate-400">0%</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={isNaN(value) ? 0 : value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs font-mono text-slate-400">100%</span>
        </div>
      </div>

      {/* Quick Select Preset Chips */}
      <div>
        <p className="text-xs text-slate-400 mb-2 font-mono flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-blue-400" />
          Quick Configuration Presets:
        </p>
        <div className="flex flex-wrap gap-2">
          {commonPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all',
                value === preset
                  ? 'bg-blue-600 text-white shadow-glow-blue/40 ring-1 ring-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              )}
            >
              E{preset} ({preset}%)
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 rounded-lg bg-slate-900/40 p-2.5 border border-slate-800/80">
        <Info className="h-4 w-4 text-blue-400 shrink-0" />
        <span>
          Fuel comprises {value}% anhydrous bio-ethanol (C₂H₅OH) and {Math.max(0, 100 - value)}% standard automotive gasoline.
        </span>
      </div>

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  )
}
