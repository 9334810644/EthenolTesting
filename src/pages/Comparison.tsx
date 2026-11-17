import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { VehicleInput } from '@/types/vehicle'
import { InjectionComparisonResult } from '@/types/analysis'
import { analysisService } from '@/services/analysisService'
import { ComparisonCard } from '@/components/comparison/ComparisonCard'
import { ComparisonSummaryTable } from '@/components/comparison/ComparisonSummaryTable'
import { ChartContainer } from '@/components/common/ChartContainer'
import { MpfiVsGdiChart } from '@/components/charts/MpfiVsGdiChart'
import { LoadingState } from '@/components/common/LoadingState'
import {
  GitCompare,
  Sliders,
  Flame,
  Weight,
  Gauge,
  Calendar,
  Sparkles,
} from 'lucide-react'

export const Comparison: React.FC = () => {
  const [searchParams] = useSearchParams()

  const [vehicleParams, setVehicleParams] = useState<VehicleInput>({
    vehicleWeight: Number(searchParams.get('m')) || 1280,
    odometer: Number(searchParams.get('odo')) || 28000,
    manufacturingYear: Number(searchParams.get('year')) || 2023,
    baseMileage: Number(searchParams.get('mo')) || 17.5,
    ethanolBlend: Number(searchParams.get('x')) || 20,
    fuelInjection: 'MPFI',
    vehicleModel: 'Benchmark Vehicle',
  })

  const [comparisonResult, setComparisonResult] = useState<InjectionComparisonResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const calculateComparison = async () => {
      setIsLoading(true)
      try {
        const result = await analysisService.runComparison(vehicleParams)
        if (isMounted) {
          setComparisonResult(result)
        }
      } catch (err) {
        console.error('Failed to compute comparison', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    calculateComparison()
    return () => {
      isMounted = false
    }
  }, [vehicleParams])

  const chartData = comparisonResult
    ? [
        {
          parameter: 'Real Mileage',
          mpfi: comparisonResult.mpfi.economicEfficiency.estimatedMileage,
          gdi: comparisonResult.gdi.economicEfficiency.estimatedMileage,
          unit: 'km/L',
        },
        {
          parameter: 'Fuel Trim (FT_req)',
          mpfi: comparisonResult.mpfi.mechanicalSafety.decisionGate.fuelTrimReq,
          gdi: comparisonResult.gdi.mechanicalSafety.decisionGate.fuelTrimReq,
          unit: '%',
        },
        {
          parameter: 'Mileage Drop (ΔM)',
          mpfi: comparisonResult.mpfi.mechanicalSafety.decisionGate.mileageDropPercent,
          gdi: comparisonResult.gdi.mechanicalSafety.decisionGate.mileageDropPercent,
          unit: '%',
        },
        {
          parameter: 'Fuel Consumption',
          mpfi: comparisonResult.mpfi.economicEfficiency.fuelConsumption,
          gdi: comparisonResult.gdi.economicEfficiency.fuelConsumption,
          unit: 'L/100km',
        },
      ]
    : []

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0d1527] via-[#0f1b35] to-[#14122c] p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
        <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-36 -bottom-10 h-52 w-52 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <GitCompare className="h-3.5 w-3.5 text-cyan-400" />
            <span>Powertrain Technology Benchmark</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            MPFI vs. GDI Injection Comparison
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Direct side-by-side comparison under identical chassis weight, odometer cycles, and ethanol fuel blend. MPFI applies baseline fuel trim (<span className="text-blue-300 font-mono font-bold">Cengine = 1.0</span>) while GDI benefits from in-cylinder charge cooling (<span className="text-cyan-300 font-mono font-bold">Cengine = 0.9</span>).
          </p>
        </div>
      </div>

      {/* Shared Parameters Interactive Controller Bar */}
      <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span>Interactive Test Bed Parameters</span>
          </div>
          <span className="text-xs font-mono text-cyan-400">LIVE DUAL CALCULATION</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Ethanol Blend Slider */}
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-blue-500/20 bg-blue-950/30 p-3.5">
            <div className="flex items-center justify-between text-xs font-mono text-blue-300 mb-2">
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                Blend (x)
              </span>
              <span className="font-extrabold text-white text-sm">E{vehicleParams.ethanolBlend}</span>
            </div>
            <input
              type="range"
              min="0"
              max="85"
              step="5"
              value={vehicleParams.ethanolBlend}
              onChange={(e) =>
                setVehicleParams((prev) => ({
                  ...prev,
                  ethanolBlend: parseInt(e.target.value, 10),
                }))
              }
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Weight */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-3.5">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Weight (m)</span>
            <input
              type="number"
              step="50"
              value={vehicleParams.vehicleWeight}
              onChange={(e) =>
                setVehicleParams((prev) => ({
                  ...prev,
                  vehicleWeight: Number(e.target.value) || 1200,
                }))
              }
              className="w-full bg-transparent font-mono font-bold text-base text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 font-mono">kg curb weight</span>
          </div>

          {/* Odometer */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-3.5">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Odometer</span>
            <input
              type="number"
              step="5000"
              value={vehicleParams.odometer}
              onChange={(e) =>
                setVehicleParams((prev) => ({
                  ...prev,
                  odometer: Number(e.target.value) || 0,
                }))
              }
              className="w-full bg-transparent font-mono font-bold text-base text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 font-mono">km recorded</span>
          </div>

          {/* Base Mileage */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-3.5">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Base E0 (Mo)</span>
            <input
              type="number"
              step="0.5"
              value={vehicleParams.baseMileage}
              onChange={(e) =>
                setVehicleParams((prev) => ({
                  ...prev,
                  baseMileage: Number(e.target.value) || 15,
                }))
              }
              className="w-full bg-transparent font-mono font-bold text-base text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 font-mono">km/L pure petrol</span>
          </div>

          {/* Mfg Year */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-3.5">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Model Year</span>
            <input
              type="number"
              step="1"
              value={vehicleParams.manufacturingYear}
              onChange={(e) =>
                setVehicleParams((prev) => ({
                  ...prev,
                  manufacturingYear: Number(e.target.value) || 2022,
                }))
              }
              className="w-full bg-transparent font-mono font-bold text-base text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 font-mono">
              {vehicleParams.manufacturingYear >= 2015 ? 'PTFE lines' : vehicleParams.manufacturingYear >= 2005 ? 'FKM lines' : 'Buna-N lines'}
            </span>
          </div>
        </div>
      </div>

      {isLoading || !comparisonResult ? (
        <LoadingState
          message="Simulating Dual Powertrain Injections..."
          subtext="Computing simultaneous MPFI port dynamics and GDI in-cylinder vaporization"
        />
      ) : (
        <>
          {/* Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComparisonCard
              type="MPFI"
              results={comparisonResult.mpfi}
              isFavoredOverall={false}
            />

            <ComparisonCard
              type="GDI"
              results={comparisonResult.gdi}
              isFavoredOverall={true}
            />
          </div>

          {/* Comparison Graphs */}
          <ChartContainer
            title="Powertrain Efficiency Benchmark (MPFI vs. GDI)"
            subtitle={`Simulated under E${vehicleParams.ethanolBlend} (${vehicleParams.ethanolBlend}% Ethanol)`}
            badge="BENCHMARK CHART"
          >
            <MpfiVsGdiChart data={chartData} height={340} />
          </ChartContainer>

          {/* Detailed Summary Table */}
          <ComparisonSummaryTable comparison={comparisonResult} />
        </>
      )}
    </div>
  )
}
