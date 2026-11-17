import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FullVehicleAnalysis } from '@/types/analysis'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentAnalysisTableProps {
  analyses: FullVehicleAnalysis[];
  onDelete?: (id: string) => void;
  itemsPerPage?: number;
}

export const RecentAnalysisTable: React.FC<RecentAnalysisTableProps> = ({
  analyses,
  itemsPerPage = 5,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [injectionFilter, setInjectionFilter] = useState<'ALL' | 'MPFI' | 'GDI'>('ALL')
  const [sortField, setSortField] = useState<'createdAt' | 'mileage' | 'weight' | 'blend'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return analyses.filter((item) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        item.id.toLowerCase().includes(q) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        item.vehicleInput.manufacturingYear.toString().includes(q)

      const matchesInjection =
        injectionFilter === 'ALL' || item.vehicleInput.fuelInjection === injectionFilter

      return matchesSearch && matchesInjection
    })
  }, [analyses, searchQuery, injectionFilter])

  // Sorting Logic
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA: any
      let valB: any

      switch (sortField) {
        case 'createdAt':
          valA = new Date(a.createdAt).getTime()
          valB = new Date(b.createdAt).getTime()
          break
        case 'mileage':
          valA = a.results.economicEfficiency.estimatedMileage
          valB = b.results.economicEfficiency.estimatedMileage
          break
        case 'weight':
          valA = a.vehicleInput.vehicleWeight
          valB = b.vehicleInput.vehicleWeight
          break
        case 'blend':
          valA = a.vehicleInput.ethanolBlend
          valB = b.vehicleInput.ethanolBlend
          break
        default:
          valA = a.createdAt
          valB = b.createdAt
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortField, sortDirection])

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedData.slice(start, start + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  const toggleSort = (field: 'createdAt' | 'mileage' | 'weight' | 'blend') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Vehicle ID, model, or year..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-2xl border border-white/5 bg-slate-900/60 p-1 text-xs backdrop-blur-md">
            <Filter className="h-3.5 w-3.5 ml-2 text-slate-400" />
            <button
              onClick={() => {
                setInjectionFilter('ALL')
                setCurrentPage(1)
              }}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all',
                injectionFilter === 'ALL'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              All
            </button>
            <button
              onClick={() => {
                setInjectionFilter('MPFI')
                setCurrentPage(1)
              }}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all',
                injectionFilter === 'MPFI'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              MPFI
            </button>
            <button
              onClick={() => {
                setInjectionFilter('GDI')
                setCurrentPage(1)
              }}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all',
                injectionFilter === 'GDI'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              GDI
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#0f172a]/60 shadow-xl backdrop-blur-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/40 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-5 font-semibold">Vehicle Profile</th>
              <th
                onClick={() => toggleSort('weight')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Weight</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('blend')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Blend</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">Injection</th>
              <th className="py-3.5 px-4 font-semibold">Year</th>
              <th
                onClick={() => toggleSort('mileage')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Real Mileage</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('createdAt')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Test Date</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-5 font-semibold text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-xs">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  No vehicle analysis records matched your filter criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const decision = item.results?.mechanicalSafety?.decisionGate
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Vehicle ID & E20 Verdict Badge */}
                    <td className="py-3.5 px-5 font-mono font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <span className="text-cyan-400">{item.id}</span>
                        {decision && (
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border',
                              decision.color === 'GREEN'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : decision.color === 'YELLOW'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            )}
                          >
                            {decision.color === 'GREEN'
                              ? 'SAFE'
                              : decision.color === 'YELLOW'
                              ? 'ADVISORY'
                              : 'CRITICAL'}
                          </span>
                        )}
                        {item.title && (
                          <span className="hidden xl:inline text-[11px] font-sans font-normal text-slate-400">
                            ({item.title})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Weight */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {item.vehicleInput.vehicleWeight} kg
                    </td>

                    {/* Ethanol Blend */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-blue-300 border border-blue-500/20">
                        E{item.vehicleInput.ethanolBlend}
                      </span>
                    </td>

                    {/* Injection */}
                    <td className="py-3.5 px-4">
                      <StatusIndicator
                        status={item.vehicleInput.fuelInjection}
                        size="sm"
                        showIcon={false}
                      />
                    </td>

                    {/* Year */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {item.vehicleInput.manufacturingYear}
                    </td>

                    {/* Mileage */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-white">
                        {item.results.economicEfficiency.estimatedMileage} km/L
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1.5">
                        ({item.results.economicEfficiency.mileageDifferencePercent}%)
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* View Results Button */}
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/results?id=${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-blue-600 hover:text-white border border-white/10 hover:border-blue-500 transition-all shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 pt-2 text-xs font-mono text-slate-400">
        <div>
          Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-white/10 bg-slate-900/80 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl border border-white/10 bg-slate-900/80 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
