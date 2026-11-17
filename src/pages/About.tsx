import React from 'react'
import {
  Flame,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  BookOpen,
  Zap,
  Gauge,
  Server,
  Calculator,
} from 'lucide-react'

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Title Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0d1527] via-[#0f1b35] to-[#14122c] p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
        <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-36 -bottom-10 h-52 w-52 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span>Technical Documentation &amp; Formulation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Ethanol Vehicle Safety &amp; Economic Efficiency System
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            A comprehensive automotive diagnostic framework calculating volumetric energy drops, ECU fuel trims, elastomer corrosion thresholds, and real-world mileage under ethanol-blended petrol (E10, E20, and beyond).
          </p>
        </div>
      </div>

      {/* 1. Multi-Layer Engineering Formula Suite */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-xs text-white font-mono font-bold">
            01
          </span>
          Applied Multi-Layer Engineering Formulas
        </h2>

        <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl shadow-xl space-y-4 text-xs text-slate-300">
          <p className="text-sm">
            All system calculations strictly implement the user's handwritten automotive thermodynamics and wear equations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Layer 1 */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
              <span className="font-bold text-cyan-400 font-mono text-sm block">Layer 1: Fuel Thermodynamics</span>
              <p className="font-mono text-slate-200">Emix = (1 - x) * 32.0 + x * 21.2 (MJ/L)</p>
              <p className="font-mono text-slate-200">AFRmix = (1 - x) * 14.7 + x * 9.0</p>
              <p className="text-slate-400">Gasoline energy density is 32.0 MJ/L; stoichiometric petrol air-fuel ratio is 14.7.</p>
            </div>

            {/* Layer 2 */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
              <span className="font-bold text-purple-400 font-mono text-sm block">Layer 2: Engine &amp; Vehicle Coefficients</span>
              <p className="font-mono text-slate-200">η_ratio = 1 + (0.06 * x)</p>
              <p className="font-mono text-slate-200">Cload = 1 + ((m - 1000) / 1000) * 0.22 * x</p>
              <p className="font-mono text-slate-200">Cage = 1 + (odo / 100000) * 0.004</p>
              <p className="font-mono text-slate-200">Cengine: 1.0 (MPFI) | 0.9 (GDI)</p>
            </div>

            {/* Required Fuel Trim */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
              <span className="font-bold text-emerald-400 font-mono text-sm block">Layer 2: Required Fuel Trim</span>
              <p className="font-mono text-slate-200">FT_req = ((14.7 - AFRmix) / AFRmix) * 100 * Cengine</p>
              <p className="text-slate-400">Quantifies percentage of additional fuel required to maintain stoichiometric combustion.</p>
            </div>

            {/* Layer 3 */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
              <span className="font-bold text-blue-400 font-mono text-sm block">Layer 3: Real Mileage &amp; Drop</span>
              <p className="font-mono text-slate-200">Mreal = Mo * (Emix / 32.0) * η_ratio * [1 / (Cload * Cage)]</p>
              <p className="font-mono text-slate-200">ΔM = ((Mo - Mreal) / Mo) * 100%</p>
              <p className="text-slate-400">Calculates true road fuel economy factoring in mass drag and odometer degradation.</p>
            </div>

            {/* Corrosion Index */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2 md:col-span-2">
              <span className="font-bold text-amber-400 font-mono text-sm block">Corrosion Risk Index (CI)</span>
              <p className="font-mono text-slate-200">CI = min(100, (x * 110) * Cmat * [1 + odo / 160000])</p>
              <p className="text-slate-400">
                Material Factors: <span className="text-slate-200 font-mono">2.5</span> (Pre-2005 Buna-N Rubber) | <span className="text-slate-200 font-mono">1.0</span> (2005–2014 FKM Fluoroelastomer) | <span className="text-slate-200 font-mono">0.5</span> (2015+ PTFE Teflon).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. E20 Traffic Light Decision Engine */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-600 text-xs text-white font-mono font-bold">
            02
          </span>
          E20 Decision Engine: 3-Tier Logic Gate Matrix
        </h2>

        <div className="rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl shadow-xl space-y-3 text-xs text-slate-300">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-1">
            <span className="font-bold text-rose-400 font-mono text-sm">1. RED (Critical Risk: Do Not Use E20)</span>
            <p className="font-mono text-slate-300">Condition: Fuel Trim (FT_req) &gt; 20% OR Corrosion Index (CI_real) &gt; 60</p>
            <p className="text-slate-400">Meaning: Injectors maxed out (lean burn hazard) OR pre-2008 rubber lines melting/leaking.</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-1">
            <span className="font-bold text-amber-400 font-mono text-sm">2. YELLOW (Advisory: Proceed with Caution)</span>
            <p className="font-mono text-slate-300">Condition: Fuel Trim 10%–20% OR Corrosion Index 40–60 OR Mileage Drop (ΔM) &gt; 6%</p>
            <p className="text-slate-400">Meaning: Fuel pump working unusually hard, older materials experiencing accelerated wear, or &gt;6% severe mileage drop.</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1">
            <span className="font-bold text-emerald-400 font-mono text-sm">3. GREEN (Approved: Safe to Use E20)</span>
            <p className="font-mono text-slate-300">Condition: Fuel Trim &lt; 10% AND Corrosion Index &lt; 40 AND Mileage Drop (ΔM) ≤ 6%</p>
            <p className="text-slate-400">Meaning: ECU easily managing fuel mixture, post-2008 materials safe, mileage drop optimal/mild.</p>
          </div>
        </div>
      </section>

      {/* 3. Powertrain Benchmark: MPFI vs GDI */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-600 text-xs text-white font-mono font-bold">
            03
          </span>
          Powertrain Injection Architectures: MPFI vs. GDI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-blue-500/20 bg-[#0f172a]/60 p-5 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Gauge className="h-5 w-5" />
              <span>MPFI (Port Injection) — Cengine = 1.0</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fuel injected into intake ports at 3–5 bar. Low fuel pump wear, but lower thermal cooling recovery compared to direct injection.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-[#0f172a]/60 p-5 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Zap className="h-5 w-5" />
              <span>GDI (Direct Injection) — Cengine = 0.9</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fuel injected directly into combustion chambers at 150–250 bar. Direct in-cylinder charge cooling reduces fuel trim requirement by 10%.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
