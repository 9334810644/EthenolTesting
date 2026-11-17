import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Menu,
  ChevronRight,
  Plus,
  GitCompare,
  Activity,
} from 'lucide-react'

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation()

  // Map route to title
  const getRouteInfo = (pathname: string) => {
    switch (pathname) {
      case '/':
        return { title: 'Fleet Overview', section: 'Diagnostics' }
      case '/new-analysis':
        return { title: 'Vehicle Diagnostic Input', section: 'New Test' }
      case '/results':
        return { title: 'Analysis Dossier', section: 'Reports' }
      case '/comparison':
        return { title: 'MPFI vs GDI Benchmark', section: 'Powertrains' }
      case '/history':
        return { title: 'Historical Records', section: 'Database' }
      case '/about':
        return { title: 'Formulas & Principles', section: 'Documentation' }
      case '/settings':
        return { title: 'Configuration', section: 'System' }
      default:
        return { title: 'Diagnostic Suite', section: 'Ethanol Lab' }
    }
  }

  const { title, section } = getRouteInfo(location.pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0f1d]/80 px-4 backdrop-blur-xl sm:px-6">
      {/* Left: Mobile Toggle & Page Title / Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-400">
            {section}
          </span>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <h2 className="text-sm font-semibold text-white tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        <Link
          to="/comparison"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all"
        >
          <GitCompare className="h-3.5 w-3.5 text-cyan-400" />
          <span>MPFI vs GDI</span>
        </Link>

        <Link
          to="/new-analysis"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Analysis</span>
        </Link>
      </div>
    </header>
  )
}
