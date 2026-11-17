import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { analysisService } from '@/services/analysisService'
import { FullVehicleAnalysis } from '@/types/analysis'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { PDFDownloadButton } from '@/components/common/PDFDownloadButton'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
  Plus,
  Flame,
} from 'lucide-react'

export const History: React.FC = () => {
  const [analyses, setAnalyses] = useState<FullVehicleAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [injectionFilter, setInjectionFilter] = useState<'ALL' | 'MPFI' | 'GDI'>('ALL')
  const [blendFilter, setBlendFilter] = useState<'ALL' | 'E10' | 'E20' | 'HIGH'>('ALL')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Dialog state for single deletion
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(false)
    try {
      const data = await analysisService.getAnalyses()
      setAnalyses(data)
    } catch (err) {
      console.error('Failed to load history', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Confirm delete single item
  const confirmDelete = async () => {
    if (!deleteTargetId) return
    await analysisService.deleteAnalysis(deleteTargetId)
    setDeleteTargetId(null)
    loadData()
  }

  // Filter and Search
  const filteredData = useMemo(() => {
    return analyses.filter((item) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        item.id.toLowerCase().includes(q) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        item.vehicleInput.manufacturingYear.toString().includes(q)

      const matchesInjection =
        injectionFilter === 'ALL' || item.vehicleInput.fuelInjection === injectionFilter

      let matchesBlend = true
      if (blendFilter === 'E10') matchesBlend = item.vehicleInput.ethanolBlend <= 10
      else if (blendFilter === 'E20')
        matchesBlend = item.vehicleInput.ethanolBlend > 10 && item.vehicleInput.ethanolBlend <= 20
      else if (blendFilter === 'HIGH') matchesBlend = item.vehicleInput.ethanolBlend > 20

      return matchesSearch && matchesInjection && matchesBlend
    })
  }, [analyses, searchQuery, injectionFilter, blendFilter])

  // Sorting by Date
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB
    })
  }, [filteredData, sortOrder])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedData.slice(start, start + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-mono font-medium text-blue-400">
            <HistoryIcon className="h-3.5 w-3.5" />
            PERSISTENT TELEMETRY RECORDS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-slate-300">
            Historical diagnostic runs preserved in browser local storage.
          </p>
        </div>

        <Link
          to="/new-analysis"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-blue hover:bg-blue-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Vehicle Analysis</span>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <EmptyState
          title="No Vehicle Analyses in History"
          description="Your analysis history is currently empty. Run your first engineering diagnostic calculation or restore fleet records in Settings."
          actionLabel="Run First Vehicle Analysis"
          actionHref="/new-analysis"
        />
      ) : (
        <div className="space-y-4">
          {/* Controls Bar: Search, Injection Filter, Blend Filter, Sort */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, model, or manufacturing year..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Injection Selector */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs font-mono">
                <span className="px-2 text-slate-400 text-[11px]">System:</span>
                {(['ALL', 'MPFI', 'GDI'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setInjectionFilter(type)
                      setCurrentPage(1)
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      injectionFilter === type
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Blend Filter */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs font-mono">
                <span className="px-2 text-slate-400 text-[11px]">Blend:</span>
                {(['ALL', 'E10', 'E20', 'HIGH'] as const).map((blend) => (
                  <button
                    key={blend}
                    onClick={() => {
                      setBlendFilter(blend)
                      setCurrentPage(1)
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      blendFilter === blend
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {blend}
                  </button>
                ))}
              </div>

              {/* Date Sort Toggle */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-slate-800"
                title="Toggle Date Sorting"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-blue-400" />
                <span>Date ({sortOrder.toUpperCase()})</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-panel backdrop-blur-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 font-semibold">Analysis ID</th>
                  <th className="py-3.5 px-4 font-semibold">Weight (m)</th>
                  <th className="py-3.5 px-4 font-semibold">Odometer (odo)</th>
                  <th className="py-3.5 px-4 font-semibold">Ethanol Blend</th>
                  <th className="py-3.5 px-4 font-semibold">Injection</th>
                  <th className="py-3.5 px-4 font-semibold">Year</th>
                  <th className="py-3.5 px-4 font-semibold">Analysis Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 font-sans">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No records matched your search or filter configuration.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Analysis ID & Verdict */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">{item.id}</span>
                          {item.results?.mechanicalSafety?.decisionGate && (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${
                                item.results.mechanicalSafety.decisionGate.color === 'GREEN'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : item.results.mechanicalSafety.decisionGate.color === 'YELLOW'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {item.results.mechanicalSafety.decisionGate.color === 'GREEN'
                                ? 'SAFE'
                                : item.results.mechanicalSafety.decisionGate.color === 'YELLOW'
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

                      {/* Odometer */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.vehicleInput.odometer.toLocaleString()} km
                      </td>

                      {/* Blend */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-blue-300 border border-blue-500/20">
                          E{item.vehicleInput.ethanolBlend} ({item.vehicleInput.ethanolBlend}%)
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

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Action Buttons: View, Download PDF, Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View */}
                          <Link
                            to={`/results?id=${item.id}`}
                            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-colors"
                            title="View Full Report"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>

                          {/* Quick PDF export */}
                          <PDFDownloadButton
                            analysis={item}
                            className="!px-2 !py-1 text-xs"
                          />

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTargetId(item.id)}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
                className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Vehicle Analysis Record"
        message={`Are you sure you want to permanently delete analysis record ${deleteTargetId}? This action cannot be undone.`}
        confirmLabel="Delete Record"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
