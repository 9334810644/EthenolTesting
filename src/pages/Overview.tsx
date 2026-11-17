import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { analysisService } from '@/services/analysisService'
import { FullVehicleAnalysis } from '@/types/analysis'
import { MetricCard } from '@/components/common/MetricCard'
import { RecentAnalysisTable } from '@/components/dashboard/RecentAnalysisTable'
import { MileageVsBlendChart } from '@/components/charts/MileageVsBlendChart'
import { MpfiVsGdiChart } from '@/components/charts/MpfiVsGdiChart'
import {
  Car,
  Plus,
  Gauge,
  ShieldCheck,
  TrendingDown,
  Cpu,
  ArrowUpRight,
  Zap,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const Overview: React.FC = () => {
  const [analyses, setAnalyses] = useState<FullVehicleAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'mileage' | 'powertrain'>('mileage')

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await analysisService.getAnalyses()
        setAnalyses(data)
      } catch (err) {
        console.error('Failed to load analyses', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalyses()
  }, [])

  // Calculate Real Cross-Fleet Metrics directly from user formulas
  const summaryMetrics = useMemo(() => {
    if (analyses.length === 0) {
      return {
        totalCount: 0,
        avgMileage: '0.0',
        avgFuelTrim: '0.0',
        avgCorrosion: '0.0',
      }
    }

    const totalCount = analyses.length
    const sumMileage = analyses.reduce((acc, curr) => acc + curr.results.economicEfficiency.estimatedMileage, 0)
    const sumFuelTrim = analyses.reduce((acc, curr) => acc + curr.results.mechanicalSafety.decisionGate.fuelTrimReq, 0)
    const sumCorrosion = analyses.reduce((acc, curr) => acc + curr.results.mechanicalSafety.decisionGate.corrosionIndexReal, 0)

    return {
      totalCount,
      avgMileage: (sumMileage / totalCount).toFixed(1),
      avgFuelTrim: (sumFuelTrim / totalCount).toFixed(1),
      avgCorrosion: (sumCorrosion / totalCount).toFixed(1),
    }
  }, [analyses])

  // Get active blend curve sample
  const activeBlendCurve = useMemo(() => {
    if (analyses.length > 0) {
      return analyses[0].results.blendCurve
    }
    return []
  }, [analyses])

  const chartTabs = [
    {
      id: 'mileage' as const,
      label: 'Mileage vs Blend Curve (Layer 3)',
      icon: Gauge,
      badge: 'Formula: M_real = Mo * (Emix/32.0) * η * (1/(Cload*Cage))',
      description: 'Calculates true distance achieved per liter from E0 to E85 factoring mass drag and lifecycle wear.',
    },
    {
      id: 'powertrain' as const,
      label: 'MPFI vs GDI Engine Benchmark',
      icon: Zap,
      badge: 'C_engine: 1.0 (MPFI) vs 0.9 (GDI)',
      description: 'Port injection baseline compared to direct in-cylinder charge cooling (-10% required fuel trim).',
    },
  ]

  const currentTabInfo = chartTabs.find((t) => t.id === activeTab) || chartTabs[0]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0d1527] via-[#0f1b35] to-[#14122c] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 h-60 w-60 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>Multi-Layer Engineering Formulation Suite</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Vehicle Safety &amp; Efficiency <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">Analytics</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Evaluate real-world mechanical compatibility, fuel trim requirements, elastomer corrosion index, and mileage drops for four-wheelers operating on ethanol-blended fuel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/new-analysis"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>+ New Vehicle Analysis</span>
            </Link>

            <Link
              to="/comparison"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <span>MPFI vs GDI</span>
              <ArrowUpRight className="h-4 w-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FOUR REAL KPI METRIC CARDS (ZERO SYNTHETIC DATA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Vehicle Tests Logged"
          value={summaryMetrics.totalCount}
          unit="Records"
          subtext="Saved test runs"
          icon={Car}
          variant="blue"
        />

        <MetricCard
          title="Fleet Average Mileage"
          value={summaryMetrics.avgMileage}
          unit="km/L"
          subtext="M_real under tested blends"
          icon={Gauge}
          variant="cyan"
        />

        <MetricCard
          title="Average Required Fuel Trim"
          value={`${summaryMetrics.avgFuelTrim}%`}
          unit="FT_req"
          subtext="Gate threshold: < 10% Safe"
          icon={TrendingDown}
          variant="emerald"
        />

        <MetricCard
          title="Average Corrosion Score"
          value={summaryMetrics.avgCorrosion}
          unit="/ 100"
          subtext="CI wear (threshold: < 40)"
          icon={ShieldCheck}
          variant="purple"
        />
      </div>

      {/* 3. SHOWCASE VISUALIZER DECK (REAL USER FORMULAS ONLY) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <span>Engineering Telemetry Visualizer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive plots generated directly from Layer 1, 2, and 3 formulations.
            </p>
          </div>

          {/* Segmented Tab Controls */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-900/80 border border-white/5 backdrop-blur-md">
            {chartTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Showcase Card */}
        <div className="rounded-3xl border border-white/5 bg-[#0f172a]/70 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-white">
                  {currentTabInfo.label}
                </h3>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-cyan-400">
                  {currentTabInfo.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currentTabInfo.description}
              </p>
            </div>
          </div>

          {/* Active Chart Display */}
          <div className="w-full min-h-[380px]">
            {activeTab === 'mileage' && (
              <MileageVsBlendChart data={activeBlendCurve} />
            )}
            {activeTab === 'powertrain' && (
              <MpfiVsGdiChart />
            )}
          </div>
        </div>
      </div>

      {/* 4. RECENT VEHICLE ANALYSES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Recent Vehicle Analyses
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated records with 3-tier Decision Engine verdicts.
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Records</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <RecentAnalysisTable analyses={analyses} itemsPerPage={5} />
      </div>
    </div>
  )
}
