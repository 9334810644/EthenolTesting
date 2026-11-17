import React from 'react'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  badge,
  children,
  headerAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-2xl shadow-xl transition-all',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-white tracking-wide">
              {title}
            </h3>
            {badge && (
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-cyan-400">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {headerAction && (
          <div className="flex items-center gap-2">
            {headerAction}
          </div>
        )}
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  )
}
