import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  FileBarChart2,
  GitCompare,
  History,
  Info,
  Settings,
  Flame,
  X,
  Gauge,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      label: 'Overview',
      path: '/',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-blue-400',
    },
    {
      label: 'New Analysis',
      path: '/new-analysis',
      icon: PlusCircle,
      badge: 'Start',
      color: 'text-cyan-400',
    },
    {
      label: 'Results Dossier',
      path: '/results',
      icon: FileBarChart2,
      badge: null,
      color: 'text-emerald-400',
    },
    {
      label: 'MPFI vs GDI',
      path: '/comparison',
      icon: GitCompare,
      badge: 'Compare',
      color: 'text-purple-400',
    },
    {
      label: 'Test History',
      path: '/history',
      icon: History,
      badge: null,
      color: 'text-amber-400',
    },
    {
      label: 'About System',
      path: '/about',
      icon: Info,
      badge: null,
      color: 'text-slate-400',
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: null,
      color: 'text-slate-400',
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#0a0f1d]/90 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 shadow-lg shadow-blue-500/25">
              <Flame className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Ethanol<span className="text-cyan-400 font-extrabold">IQ</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                Powertrain Diagnostics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Pill */}
        <div className="mx-4 mt-4 rounded-xl border border-blue-500/15 bg-gradient-to-r from-blue-950/40 to-slate-900/40 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-blue-300 font-medium">
              <Gauge className="h-3.5 w-3.5 text-cyan-400" />
              <span>Diagnostic Core</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'h-4 w-4 transition-transform group-hover:scale-110',
                          isActive ? 'text-white' : item.color
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider',
                          isActive
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-white/5 text-slate-400 group-hover:text-slate-300'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-white/5 p-3.5">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] p-2.5 border border-white/5">
            <div className="rounded-lg bg-cyan-500/10 p-1.5 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="overflow-hidden text-xs">
              <p className="font-medium text-slate-200 truncate">E20 Safety Engine</p>
              <p className="text-[10px] text-slate-500 font-mono">v1.2 • Verified Math</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
