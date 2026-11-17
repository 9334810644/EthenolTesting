import React from 'react'
import { Activity, Gauge, Cpu, Zap } from 'lucide-react'

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Executing Vehicle Diagnostic Simulation...',
  subtext = 'Processing thermodynamic combustion curves and mechanical stress matrices',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 my-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center max-w-lg mx-auto shadow-panel">
      {/* Animated Diagnostic Core */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
        <div className="relative h-20 w-20 rounded-full border-2 border-dashed border-blue-500 flex items-center justify-center animate-spin">
          <Activity className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
          <Zap className="h-3 w-3 text-cyan-300" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white tracking-wide mb-2 flex items-center gap-2">
        <Cpu className="h-4 w-4 text-blue-400 animate-pulse" />
        {message}
      </h3>

      <p className="text-sm text-slate-400 max-w-sm mb-6">
        {subtext}
      </p>

      {/* Progress telemetry bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mb-3 border border-slate-700/50">
        <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 h-full w-full animate-pulse" />
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Gauge className="h-3.5 w-3.5 text-blue-400" />
          CALC: MPFI/GDI
        </span>
        <span>•</span>
        <span>BLEND MODEL: ACTIVE</span>
        <span>•</span>
        <span className="text-emerald-400">STATUS: SOLVING</span>
      </div>
    </div>
  )
}
