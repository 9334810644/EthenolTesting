import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { analysisService } from '@/services/analysisService'
import { FullVehicleAnalysis } from '@/types/analysis'
import { VehicleSummaryHeader } from '@/components/results/VehicleSummaryHeader'
import { E20DecisionHeroBanner } from '@/components/results/E20DecisionHeroBanner'
import { ChartContainer } from '@/components/common/ChartContainer'
import { MileageVsBlendChart } from '@/components/charts/MileageVsBlendChart'
import { MpfiVsGdiChart } from '@/components/charts/MpfiVsGdiChart'
import { PDFDownloadButton } from '@/components/common/PDFDownloadButton'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingState } from '@/components/common/LoadingState'
import {
  Printer,
  PlusCircle,
  ArrowLeft,
  GitCompare,
  Gauge,
  Flame,
  ShieldCheck,
  TrendingDown,
  Calculator,
  BarChart3,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const AnalysisResults: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState<FullVehicleAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'verdict' | 'formulas' | 'charts'>('verdict')

  const analysisId = searchParams.get('id')

  useEffect(() => {
    const loadAnalysis = async () => {
      setIsLoading(true)
      try {
        if (analysisId) {
          const found = await analysisService.getAnalysisById(analysisId)
          if (found) {
            setAnalysis(found)
          } else {
            const all = await analysisService.getAnalyses()
            setAnalysis(all.length > 0 ? all[0] : null)
          }
        } else {
          const all = await analysisService.getAnalyses()
          setAnalysis(all.length > 0 ? all[0] : null)
        }
      } catch (err) {
        console.error('Failed to load analysis', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAnalysis()
  }, [analysisId])

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <LoadingState
        message="Computing Vehicle Telemetry..."
        subtext="Evaluating fuel trim, corrosion thresholds, and real mileage"
      />
    )
  }

  if (!analysis) {
    return (
      <EmptyState
        title="No Vehicle Analysis Selected"
        description="Run a new analysis to compute mechanical safety and fuel economy under ethanol blends."
        actionLabel="Run New Analysis"
        actionHref="/new-analysis"
      />
    )
  }

  const { vehicleInput, results, id, createdAt, title } = analysis
  const { decisionGate } = results.mechanicalSafety
  const x = vehicleInput.ethanolBlend / 100
  const m = vehicleInput.vehicleWeight
  const odo = vehicleInput.odometer
  const Mo = vehicleInput.baseMileage
  const isGdi = vehicleInput.fuelInjection === 'GDI'

  // Substituted formula variables
  const Emix = ((1 - x) * 32.0 + x * 21.2).toFixed(2)
  const AFRmix = ((1 - x) * 14.7 + x * 9.0).toFixed(2)
  const n_ratio = (1 + 0.06 * x).toFixed(4)
  const Cload = (1 + ((m - 1000) / 1000) * 0.22 * x).toFixed(4)
  const Cage = (1 + (odo / 100000) * 0.004).toFixed(4)
  const Cengine = isGdi ? 0.9 : 1.0
  const FTreq = decisionGate.fuelTrimReq.toFixed(1)
  const Mreal = results.economicEfficiency.estimatedMileage.toFixed(2)
  const deltaM = decisionGate.mileageDropPercent.toFixed(1)
  const Cmat = vehicleInput.manufacturingYear < 2005 ? 2.5 : vehicleInput.manufacturingYear <= 2014 ? 1.0 : 0.5
  const CI = decisionGate.corrosionIndexReal.toFixed(1)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-slate-700">•</span>
          <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            REPORT #{id}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to={`/comparison?m=${vehicleInput.vehicleWeight}&odo=${vehicleInput.odometer}&year=${vehicleInput.manufacturingYear}&mo=${vehicleInput.baseMileage}&x=${vehicleInput.ethanolBlend}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all"
          >
            <GitCompare className="h-4 w-4 text-cyan-400" />
            <span>Benchmark {vehicleInput.fuelInjection === 'MPFI' ? 'vs GDI' : 'vs MPFI'}</span>
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all"
            title="Print Report"
          >
            <Printer className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <PDFDownloadButton analysis={analysis} />

          <Link
            to="/new-analysis"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Test</span>
          </Link>
        </div>
      </div>

      {/* 2. VEHICLE SUMMARY HEADER */}
      <VehicleSummaryHeader
        id={id}
        vehicleInput={vehicleInput}
        createdAt={createdAt}
        title={title}
      />

      {/* 3. PRIMARY VERDICT HERO BANNER (GREEN / YELLOW / RED) */}
      <E20DecisionHeroBanner
        decision={decisionGate}
        ethanolBlend={vehicleInput.ethanolBlend}
      />

      {/* 4. FOUR KEY RESULT METRICS (CLEAN & PROMINENT) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Real Mileage */}
        <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-4 sm:p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>REAL-WORLD MILEAGE</span>
            <Gauge className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {Mreal}
            </span>
            <span className="text-xs text-slate-400 font-mono">km/L</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            vs {Mo} km/L (Pure E0 baseline)
          </p>
        </div>

        {/* Mileage Drop */}
        <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-4 sm:p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>MILEAGE DROP (ΔM)</span>
            <TrendingDown className={cn('h-4 w-4', Number(deltaM) <= 6 ? 'text-emerald-400' : 'text-amber-400')} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn('text-2xl sm:text-3xl font-extrabold font-mono', Number(deltaM) <= 6 ? 'text-emerald-400' : 'text-amber-400')}>
              {deltaM}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {Number(deltaM) <= 3 ? 'Optimal efficiency' : Number(deltaM) <= 6 ? 'Mild loss' : 'Severe economic loss (>6%)'}
          </p>
        </div>

        {/* Required Fuel Trim */}
        <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-4 sm:p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>FUEL TRIM (FT_req)</span>
            <Cpu className={cn('h-4 w-4', Number(FTreq) < 10 ? 'text-emerald-400' : Number(FTreq) <= 20 ? 'text-amber-400' : 'text-rose-400')} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn('text-2xl sm:text-3xl font-extrabold font-mono', Number(FTreq) < 10 ? 'text-emerald-400' : Number(FTreq) <= 20 ? 'text-amber-400' : 'text-rose-400')}>
              {FTreq}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {Number(FTreq) < 10 ? 'ECU easily managing' : Number(FTreq) <= 20 ? 'Fuel pump working hard' : 'Maxed out (lean burn hazard)'}
          </p>
        </div>

        {/* Corrosion Index */}
        <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-4 sm:p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>CORROSION INDEX (CI)</span>
            <ShieldCheck className={cn('h-4 w-4', Number(CI) < 40 ? 'text-emerald-400' : Number(CI) <= 60 ? 'text-amber-400' : 'text-rose-400')} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn('text-2xl sm:text-3xl font-extrabold font-mono', Number(CI) < 40 ? 'text-emerald-400' : Number(CI) <= 60 ? 'text-amber-400' : 'text-rose-400')}>
              {CI}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {Number(CI) < 40 ? 'Elastomers safe' : Number(CI) <= 60 ? 'Accelerated wear' : 'Critical leakage danger (>60)'}
          </p>
        </div>
      </div>

      {/* 5. SEGMENTED TABS (CLEAN & UNCLUTTERED) */}
      <div className="space-y-4">
        {/* Tab Selection Switcher */}
        <div className="flex p-1.5 rounded-2xl bg-[#0f172a]/80 border border-white/5 backdrop-blur-xl w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('verdict')}
            className={cn(
              'flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all',
              activeTab === 'verdict'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            )}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Diagnostics &amp; Verdict</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={cn(
              'flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all',
              activeTab === 'formulas'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            )}
          >
            <Calculator className="h-4 w-4" />
            <span>Formulas &amp; Math</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={cn(
              'flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all',
              activeTab === 'charts'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Telemetry Graphs</span>
          </button>
        </div>

        {/* TAB CONTENT 1: DIAGNOSTICS & VERDICT */}
        {activeTab === 'verdict' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gate 1 Detail */}
              <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl shadow-xl space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">1. Fuel Trim (FT_req)</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Calculated Trim:</span>
                    <span className="font-mono font-bold text-white">{FTreq}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">C_engine Factor:</span>
                    <span className="font-mono text-cyan-400 font-bold">{Cengine} ({vehicleInput.fuelInjection})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Threshold:</span>
                    <span className="font-mono text-slate-300">&lt;10% Safe | 10-20% Caution | &gt;20% Red</span>
                  </div>
                  <p className="text-slate-400 pt-2 border-t border-white/5 leading-relaxed">
                    {Number(FTreq) < 10
                      ? 'ECU is easily managing the fuel mixture without stressing injectors or the high-pressure pump.'
                      : Number(FTreq) <= 20
                      ? 'Fuel pump is working unusually hard to supply additional fuel volume.'
                      : 'Injectors are maxed out, causing a dangerously lean burn and high risk of misfire.'}
                  </p>
                </div>
              </div>

              {/* Gate 2 Detail */}
              <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl shadow-xl space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <Layers className="h-5 w-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">2. Corrosion Index (CI)</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Corrosion Score:</span>
                    <span className="font-mono font-bold text-white">{CI} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">C_mat Factor:</span>
                    <span className="font-mono text-amber-400 font-bold">{Cmat} ({vehicleInput.manufacturingYear})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Threshold:</span>
                    <span className="font-mono text-slate-300">&lt;40 Safe | 40-60 Caution | &gt;60 Red</span>
                  </div>
                  <p className="text-slate-400 pt-2 border-t border-white/5 leading-relaxed">
                    {Number(CI) < 40
                      ? 'Post-2008 materials and PTFE/FKM lines are safe and chemically compatible.'
                      : Number(CI) <= 60
                      ? 'Older materials experiencing accelerated wear and gradual swelling.'
                      : 'Pre-2008 rubber lines are at high risk of melting, micro-cracks, and fuel leakage.'}
                  </p>
                </div>
              </div>

              {/* Gate 3 Detail */}
              <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl shadow-xl space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <TrendingDown className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">3. Mileage Drop (ΔM)</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mileage Drop:</span>
                    <span className="font-mono font-bold text-white">{deltaM}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Real Mileage:</span>
                    <span className="font-mono text-emerald-400 font-bold">{Mreal} km/L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Threshold:</span>
                    <span className="font-mono text-slate-300">≤ 6% (Safe) | &gt; 6% (Caution)</span>
                  </div>
                  <p className="text-slate-400 pt-2 border-t border-white/5 leading-relaxed">
                    {Number(deltaM) <= 6
                      ? 'Mileage drop is categorized as Optimal or Mild, with minimal impact on driver running costs.'
                      : 'Vehicle suffers a severe loss in fuel economy (>6%), wasting the driver\'s money.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: APPLIED FORMULAS & MATH (EXACT HANDWRITTEN FORMULAS) */}
        {activeTab === 'formulas' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Formula Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Formula 1: Fuel Thermodynamics */}
              <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-5 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Layer 1: Fuel Thermodynamics
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">Emix &amp; AFRmix</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-xs space-y-2 text-slate-300">
                  <div>
                    <span className="text-slate-500">// Energy Density (gasoline = 32.0 MJ/L)</span>
                    <p className="text-blue-300 font-bold">Emix = (1 - x) * 32.0 + x * 21.2</p>
                    <p className="text-white">= (1 - {x}) * 32.0 + {x} * 21.2 = <span className="text-cyan-400 font-bold">{Emix} MJ/L</span></p>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-slate-500">// Stoichiometric Air-Fuel Ratio</span>
                    <p className="text-blue-300 font-bold">AFRmix = (1 - x) * 14.7 + x * 9.0</p>
                    <p className="text-white">= (1 - {x}) * 14.7 + {x} * 9.0 = <span className="text-cyan-400 font-bold">{AFRmix}</span></p>
                  </div>
                </div>
              </div>

              {/* Formula 2: Engine & Vehicle Coefficients */}
              <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-5 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                    Layer 2: Vehicle Coefficients
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">η, Cload, Cage, Cengine</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-xs space-y-2 text-slate-300">
                  <p>
                    <span className="text-slate-400">η_ratio:</span> 1 + (0.06 * {x}) = <span className="text-purple-300 font-bold">{n_ratio}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Cload:</span> 1 + (({m} - 1000)/1000) * 0.22 * {x} = <span className="text-purple-300 font-bold">{Cload}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Cage:</span> 1 + ({odo} / 100000) * 0.004 = <span className="text-purple-300 font-bold">{Cage}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Cengine:</span> {vehicleInput.fuelInjection} = <span className="text-purple-300 font-bold">{Cengine}</span> (1.0 MPFI / 0.9 GDI)
                  </p>
                </div>
              </div>

              {/* Formula 3: Required Fuel Trim */}
              <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-5 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Layer 2: Required Fuel Trim
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">FT_req</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-xs space-y-2 text-slate-300">
                  <p className="text-emerald-300 font-bold">
                    FT_req = ((14.7 - AFRmix) / AFRmix) * 100 * Cengine
                  </p>
                  <p className="text-white">
                    = ((14.7 - {AFRmix}) / {AFRmix}) * 100 * {Cengine}
                  </p>
                  <p className="text-emerald-400 font-bold text-sm">
                    = {FTreq}%
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
                    Threshold: &lt;10% Safe | 10%-20% Advisory | &gt;20% Critical
                  </p>
                </div>
              </div>

              {/* Formula 4: Real Mileage & Mileage Drop */}
              <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-5 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                    Layer 3: Real Mileage &amp; Drop
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">Mreal &amp; ΔM</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-xs space-y-2 text-slate-300">
                  <p className="text-blue-300 font-bold">
                    Mreal = Mo * (Emix / 32.0) * η_ratio * (1 / (Cload * Cage))
                  </p>
                  <p className="text-white">
                    = {Mo} * ({Emix} / 32.0) * {n_ratio} * (1 / ({Cload} * {Cage})) = <span className="text-cyan-400 font-bold">{Mreal} km/L</span>
                  </p>
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-blue-300 font-bold">ΔM = ((Mo - Mreal) / Mo) * 100%</p>
                    <p className="text-white">
                      = (({Mo} - {Mreal}) / {Mo}) * 100% = <span className="text-amber-400 font-bold">{deltaM}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Formula 5: Material Corrosion Index */}
              <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 p-5 backdrop-blur-xl space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Material Corrosion Index
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">CI_real (160,000 km threshold)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-xs space-y-2 text-slate-300">
                  <p className="text-amber-300 font-bold">
                    CI = min(100, (x * 110) * Cmat * [1 + odo / 160000])
                  </p>
                  <p className="text-white">
                    = min(100, ({x} * 110) * {Cmat} * [1 + {odo} / 160000]) = <span className="text-amber-400 font-bold text-sm">{CI} / 100</span>
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
                    Cmat Material Baseline: 2.5 (Pre-2005 Buna-N) | 1.0 (2005-2014 FKM) | 0.5 (2015+ PTFE Teflon)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: TELEMETRY GRAPHS */}
        {activeTab === 'charts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Parametric Curve */}
            <ChartContainer
              title="Ethanol Blend vs. Estimated Mileage Curve"
              subtitle={`Computed via Layer 3: M_real = Mo * (Emix/32.0) * η * (1/(Cload*Cage)) for ${vehicleInput.fuelInjection} (${vehicleInput.vehicleWeight} kg)`}
              badge="LAYER 3 SENSITIVITY"
            >
              <MileageVsBlendChart
                data={results.blendCurve}
                currentBlend={vehicleInput.ethanolBlend}
              />
            </ChartContainer>
          </div>
        )}
      </div>

      {/* 6. BOTTOM ACTION FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl border border-white/5 bg-[#0f172a]/50 no-print">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="text-sm font-bold text-white">Need to test another vehicle profile?</p>
          <p className="text-xs text-slate-400">Configure curb weight, odometer cycles, or benchmark against other fuel injection systems.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            Dashboard
          </Link>
          <Link
            to="/new-analysis"
            className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-all"
          >
            + New Test
          </Link>
        </div>
      </div>
    </div>
  )
}
