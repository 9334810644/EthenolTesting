import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VehicleInput } from '@/types/vehicle'
import { VehicleInputForm } from '@/components/forms/VehicleInputForm'
import { LoadingState } from '@/components/common/LoadingState'
import { analysisService } from '@/services/analysisService'
import { Cpu, Sparkles } from 'lucide-react'

export const NewAnalysis: React.FC = () => {
  const navigate = useNavigate()
  const [isCalculating, setIsCalculating] = useState(false)

  const handleFormSubmit = async (values: VehicleInput) => {
    setIsCalculating(true)
    try {
      const newAnalysis = await analysisService.runAnalysis(values)
      navigate(`/results?id=${newAnalysis.id}`)
    } catch (err) {
      console.error('Calculation execution error', err)
      setIsCalculating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0d1527] via-[#0f1b35] to-[#14122c] p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
        <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-10 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Ethanol Powertrain Analysis</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            New Vehicle Diagnostic Test
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Input curb weight, lifecycle odometer, model year, and target ethanol blend to simulate ECU fuel trims, elastomer corrosion, and fuel economy drops.
          </p>
        </div>
      </div>

      {/* Calculation Loading Screen or Form */}
      {isCalculating ? (
        <LoadingState
          message="Computing Engine Thermodynamic Telemetry..."
          subtext="Calculating Fuel Trim (FT_req), Corrosion Index (CI_real), and Real Mileage (M_real)"
        />
      ) : (
        <VehicleInputForm onSubmit={handleFormSubmit} isLoading={isCalculating} />
      )}
    </div>
  )
}
