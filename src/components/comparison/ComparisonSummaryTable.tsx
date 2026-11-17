import React from 'react'
import { InjectionComparisonResult } from '@/types/analysis'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonSummaryTableProps {
  comparison: InjectionComparisonResult;
}

export const ComparisonSummaryTable: React.FC<ComparisonSummaryTableProps> = ({
  comparison,
}) => {
  return (
    <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 overflow-hidden shadow-xl backdrop-blur-2xl">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-base font-bold text-white tracking-wide">
          Engineering Parameter Comparison Matrix
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Comprehensive benchmark comparing MPFI port injection vs GDI direct injection across efficiency, wear, and thermodynamics.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/40 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-5 font-semibold">Engineering Metric</th>
              <th className="py-3.5 px-5 font-semibold text-blue-400">MPFI (Port)</th>
              <th className="py-3.5 px-5 font-semibold text-cyan-400">GDI (Direct)</th>
              <th className="py-3.5 px-5 font-semibold">Variance (Δ)</th>
              <th className="py-3.5 px-5 font-semibold">Favored Tech</th>
              <th className="py-3.5 px-5 font-semibold">Technical Summary</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 font-sans">
            {comparison.comparisonMetrics.map((item, idx) => {
              const isGdiFavored = item.favors === 'GDI'
              const isMpfiFavored = item.favors === 'MPFI'

              return (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  {/* Parameter Name */}
                  <td className="py-3.5 px-5 font-semibold text-white">
                    {item.parameter}
                  </td>

                  {/* MPFI Value */}
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-200">
                    {item.mpfiValue} <span className="text-slate-400 font-normal text-[11px]">{item.unit}</span>
                  </td>

                  {/* GDI Value */}
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-200">
                    {item.gdiValue} <span className="text-slate-400 font-normal text-[11px]">{item.unit}</span>
                  </td>

                  {/* Difference */}
                  <td className="py-3.5 px-5 font-mono">
                    <span
                      className={cn(
                        'font-bold',
                        item.difference === 0
                          ? 'text-slate-400'
                          : item.difference > 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      )}
                    >
                      {item.difference > 0 ? `+${item.difference}` : item.difference} {item.unit}
                    </span>
                  </td>

                  {/* Favored System */}
                  <td className="py-3.5 px-5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-mono font-bold',
                        isGdiFavored
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : isMpfiFavored
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-white/5 text-slate-400'
                      )}
                    >
                      <Check className="h-3 w-3" />
                      {item.favors}
                    </span>
                  </td>

                  {/* Technical Summary */}
                  <td className="py-3.5 px-5 text-slate-400 text-xs leading-relaxed max-w-xs xl:max-w-md">
                    {item.summary}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
