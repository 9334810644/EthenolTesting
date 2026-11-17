import React from 'react'
import { E20DecisionGate } from '@/types/analysis'
import {
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Flame,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface E20DecisionHeroBannerProps {
  decision: E20DecisionGate;
  ethanolBlend: number;
  className?: string;
}

export const E20DecisionHeroBanner: React.FC<E20DecisionHeroBannerProps> = ({
  decision,
  ethanolBlend,
  className,
}) => {
  const isGreen = decision.color === 'GREEN'
  const isYellow = decision.color === 'YELLOW'
  const isRed = decision.color === 'RED'

  const styles = {
    GREEN: {
      card: 'border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-900/60 shadow-xl shadow-emerald-500/10',
      iconBox: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/20',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      titleColor: 'text-emerald-300',
      glow: 'bg-emerald-500',
      category: 'APPROVED: SAFE TO USE E20',
      icon: CheckCircle2,
    },
    YELLOW: {
      card: 'border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-900/60 shadow-xl shadow-amber-500/10',
      iconBox: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/20',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      titleColor: 'text-amber-300',
      glow: 'bg-amber-500',
      category: 'ADVISORY: PROCEED WITH CAUTION',
      icon: AlertTriangle,
    },
    RED: {
      card: 'border-rose-500/40 bg-gradient-to-r from-rose-950/50 via-slate-900/80 to-slate-900/60 shadow-xl shadow-rose-500/15',
      iconBox: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/20',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      titleColor: 'text-rose-300',
      glow: 'bg-rose-500',
      category: 'CRITICAL RISK: DO NOT USE E20',
      icon: OctagonAlert,
    },
  }[decision.color]

  const IconComponent = styles.icon

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300',
        styles.card,
        className
      )}
    >
      {/* Background Ambient Glow */}
      <div
        className={cn(
          'absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl pointer-events-none opacity-25',
          styles.glow
        )}
      />

      <div className="relative z-10 space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border',
                styles.badge
              )}
            >
              {styles.category}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              3-TIER DECISION ENGINE
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <Flame className="h-3.5 w-3.5 text-cyan-400" />
            <span>Target Blend: E{ethanolBlend} ({ethanolBlend}%)</span>
          </div>
        </div>

        {/* Primary Verdict Hero */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className={cn('rounded-2xl p-4 shrink-0', styles.iconBox)}>
            <IconComponent className="h-10 w-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block font-semibold">
              Vehicle Verdict
            </span>
            <h2 className={cn('text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug', styles.titleColor)}>
              {decision.uiDisplay}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl pt-1">
              {decision.meaning}
            </p>
          </div>
        </div>

        {/* 3 Logic Gate Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Gate 1: Fuel Trim */}
          <div
            className={cn(
              'rounded-2xl border p-4 backdrop-blur-md transition-all',
              decision.fuelTrimStatus === 'optimal'
                ? 'border-emerald-500/20 bg-emerald-950/20'
                : decision.fuelTrimStatus === 'advisory'
                ? 'border-amber-500/20 bg-amber-950/20'
                : 'border-rose-500/30 bg-rose-950/30'
            )}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-semibold">1. Fuel Trim (FT_req)</span>
              <span
                className={cn(
                  'font-bold text-base',
                  decision.fuelTrimStatus === 'optimal'
                    ? 'text-emerald-400'
                    : decision.fuelTrimStatus === 'advisory'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                )}
              >
                {decision.fuelTrimReq}%
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-2 mt-2 border-t border-white/5">
              <span>Threshold:</span>
              <span className="text-slate-200">
                {decision.fuelTrimReq < 10
                  ? '< 10% (Safe)'
                  : decision.fuelTrimReq <= 20
                  ? '10%–20% (Caution)'
                  : '> 20% (Dangerous)'}
              </span>
            </div>
          </div>

          {/* Gate 2: Corrosion Index */}
          <div
            className={cn(
              'rounded-2xl border p-4 backdrop-blur-md transition-all',
              decision.corrosionStatus === 'optimal'
                ? 'border-emerald-500/20 bg-emerald-950/20'
                : decision.corrosionStatus === 'advisory'
                ? 'border-amber-500/20 bg-amber-950/20'
                : 'border-rose-500/30 bg-rose-950/30'
            )}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-semibold">2. Corrosion Index (CI)</span>
              <span
                className={cn(
                  'font-bold text-base',
                  decision.corrosionStatus === 'optimal'
                    ? 'text-emerald-400'
                    : decision.corrosionStatus === 'advisory'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                )}
              >
                {decision.corrosionIndexReal} / 100
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-2 mt-2 border-t border-white/5">
              <span>Threshold:</span>
              <span className="text-slate-200">
                {decision.corrosionIndexReal < 40
                  ? '< 40 (Safe)'
                  : decision.corrosionIndexReal <= 60
                  ? '40–60 (Wear Risk)'
                  : '> 60 (Critical)'}
              </span>
            </div>
          </div>

          {/* Gate 3: Mileage Drop */}
          <div
            className={cn(
              'rounded-2xl border p-4 backdrop-blur-md transition-all',
              decision.mileageDropStatus === 'optimal'
                ? 'border-emerald-500/20 bg-emerald-950/20'
                : 'border-amber-500/20 bg-amber-950/20'
            )}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-semibold">3. Mileage Drop (ΔM)</span>
              <span
                className={cn(
                  'font-bold text-base',
                  decision.mileageDropStatus === 'optimal' ? 'text-emerald-400' : 'text-amber-400'
                )}
              >
                {decision.mileageDropPercent}%
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-2 mt-2 border-t border-white/5">
              <span>Threshold:</span>
              <span className="text-slate-200">
                {decision.mileageDropPercent <= 6
                  ? '≤ 6% (Mild Loss)'
                  : '> 6% (Severe Loss)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
