import React from 'react'
import { cn } from '@/lib/utils'
import { ShieldAlert, ShieldCheck, AlertTriangle, ShieldX } from 'lucide-react'
import { RiskClassification } from '@/types/analysis'

interface StatusIndicatorProps {
  status: RiskClassification | 'MPFI' | 'GDI' | 'Within Tolerance' | 'Advisory' | 'Degraded' | 'High Wear Risk' | 'Optimal' | 'Warning' | 'Critical';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Low':
      case 'Within Tolerance':
      case 'Optimal':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: ShieldCheck,
          label: status === 'Low' ? 'Low Risk' : status,
        }
      case 'Moderate':
      case 'Advisory':
      case 'Warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
          icon: AlertTriangle,
          label: status === 'Moderate' ? 'Moderate Risk' : status,
        }
      case 'Elevated':
      case 'Degraded':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          dot: 'bg-orange-400',
          icon: ShieldAlert,
          label: status === 'Elevated' ? 'Elevated Risk' : status,
        }
      case 'Critical':
      case 'High Wear Risk':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400',
          icon: ShieldX,
          label: status === 'Critical' ? 'Critical Risk' : status,
        }
      case 'MPFI':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          dot: 'bg-blue-400',
          icon: null,
          label: 'MPFI (Port Injection)',
        }
      case 'GDI':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400',
          icon: null,
          label: 'GDI (Direct Injection)',
        }
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          dot: 'bg-slate-400',
          icon: null,
          label: String(status),
        }
    }
  }

  const config = getBadgeConfig()
  const IconComponent = config.icon

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium font-sans tracking-wide',
        config.bg,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', config.dot)} />
      {showIcon && IconComponent && <IconComponent className="h-3.5 w-3.5 mr-0.5" />}
      <span>{config.label}</span>
    </span>
  )
}
