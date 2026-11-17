import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    neutral?: boolean;
    label?: string;
  };
  variant?: 'default' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'crimson' | 'purple';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtext,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'border-white/5 bg-slate-900/50 hover:border-white/10',
    blue: 'border-blue-500/20 bg-gradient-to-br from-blue-950/30 via-slate-900/60 to-slate-900/40 hover:border-blue-500/40 shadow-lg shadow-blue-500/5',
    cyan: 'border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 via-slate-900/60 to-slate-900/40 hover:border-cyan-500/40 shadow-lg shadow-cyan-500/5',
    emerald: 'border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-slate-900/60 to-slate-900/40 hover:border-emerald-500/40 shadow-lg shadow-emerald-500/5',
    amber: 'border-amber-500/20 bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-slate-900/40 hover:border-amber-500/40 shadow-lg shadow-amber-500/5',
    crimson: 'border-rose-500/20 bg-gradient-to-br from-rose-950/30 via-slate-900/60 to-slate-900/40 hover:border-rose-500/40 shadow-lg shadow-rose-500/5',
    purple: 'border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-slate-900/60 to-slate-900/40 hover:border-purple-500/40 shadow-lg shadow-purple-500/5',
  }

  const iconColors = {
    default: 'text-slate-400 bg-white/5',
    blue: 'text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-sm shadow-blue-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-sm shadow-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-sm shadow-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border border-amber-500/20 shadow-sm shadow-amber-500/20',
    crimson: 'text-rose-400 bg-rose-500/10 border border-rose-500/20 shadow-sm shadow-rose-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-sm shadow-purple-500/20',
  }

  return (
    <div
      className={cn(
        'relative rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </span>
          </div>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-medium text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={cn('rounded-xl p-2.5', iconColors[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5 text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'font-semibold font-mono',
                  trend.neutral
                    ? 'text-slate-400'
                    : trend.isPositive
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                )}
              >
                {trend.value}
              </span>
              {trend.label && (
                <span className="text-slate-400">{trend.label}</span>
              )}
            </div>
          ) : (
            <div />
          )}

          {subtext && (
            <span className="text-slate-400 truncate max-w-[170px]" title={subtext}>
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
