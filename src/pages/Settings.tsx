import React, { useState } from 'react'
import { analysisService } from '@/services/analysisService'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Scale,
  Gauge,
  Database,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  Check,
  CheckCircle2,
} from 'lucide-react'

export const Settings: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric')
  const [defaultBlend, setDefaultBlend] = useState(20)
  const [defaultInjection, setDefaultInjection] = useState<'MPFI' | 'GDI'>('MPFI')

  // Notification / confirmation states
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleClearHistory = () => {
    analysisService.clearAllAnalyses()
    setShowClearDialog(false)
    setSuccessMessage('All historical analysis records cleared.')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleResetDemo = () => {
    analysisService.resetToDefaultDemo()
    setShowResetDialog(false)
    setSuccessMessage('Restored initial vehicle fleet records.')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleExportData = async () => {
    const data = await analysisService.getAnalyses()
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ethanol_analytics_export_${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-mono font-medium text-blue-400">
          <SettingsIcon className="h-3.5 w-3.5" />
          SYSTEM CONFIGURATION
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Application Settings
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed">
          Configure diagnostic calculation preferences, display units, and telemetry data cache.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-2.5 text-xs text-emerald-300 font-medium animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. Theme Configuration */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-panel">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Moon className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-white">Application Theme</h3>
            <p className="text-xs text-slate-400">Select cockpit display mode.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-950/40 text-white shadow-glow-blue/20'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-white">Dark Cockpit</p>
                <p className="text-[11px] text-slate-400">Automotive Dark Slate</p>
              </div>
            </div>
            {theme === 'dark' && <Check className="h-4 w-4 text-blue-400" />}
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-950/40 text-white shadow-glow-blue/20'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white">Light Mode</p>
                <p className="text-[11px] text-slate-400">High Contrast White</p>
              </div>
            </div>
            {theme === 'light' && <Check className="h-4 w-4 text-blue-400" />}
          </button>
        </div>
      </div>

      {/* 2. Measurement Units */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-panel">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Scale className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white">Default Measurement Units</h3>
            <p className="text-xs text-slate-400">Configure engineering units for mass, distance, and economy.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
              unitSystem === 'metric'
                ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-glow-cyan/20'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-white">Metric Standard (SI)</p>
              <p className="text-[11px] font-mono text-slate-400">km/L • kg • L/100km</p>
            </div>
            {unitSystem === 'metric' && <Check className="h-4 w-4 text-cyan-400" />}
          </button>

          <button
            onClick={() => setUnitSystem('imperial')}
            className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
              unitSystem === 'imperial'
                ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-glow-cyan/20'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-white">US / Imperial</p>
              <p className="text-[11px] font-mono text-slate-400">MPG • lbs • gal</p>
            </div>
            {unitSystem === 'imperial' && <Check className="h-4 w-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* 3. Dashboard Defaults */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-panel">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Gauge className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">Diagnostic Presets</h3>
            <p className="text-xs text-slate-400">Default settings for new analyses and comparison forms.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono">
              Default Ethanol Blend Preset:
            </label>
            <select
              value={defaultBlend}
              onChange={(e) => setDefaultBlend(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={10}>E10 (10% Ethanol)</option>
              <option value={15}>E15 (15% Ethanol)</option>
              <option value={20}>E20 (20% Ethanol Mandate)</option>
              <option value={25}>E25 (25% Ethanol)</option>
              <option value={85}>E85 (85% Flex Fuel)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono">
              Default Injection Architecture:
            </label>
            <select
              value={defaultInjection}
              onChange={(e) => setDefaultInjection(e.target.value as 'MPFI' | 'GDI')}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="MPFI">MPFI (Multi-Point Port)</option>
              <option value="GDI">GDI (Gasoline Direct)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Data Management & Local History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-panel">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Database className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-white">Data Management</h3>
            <p className="text-xs text-slate-400">Manage persistent telemetry stored in browser localStorage.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-mono font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4 text-blue-400" />
            <span>Export Fleet JSON</span>
          </button>

          <button
            onClick={() => setShowResetDialog(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-mono font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-cyan-400" />
            <span>Restore Fleet Records</span>
          </button>

          <button
            onClick={() => setShowClearDialog(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/20 px-4 py-2 text-xs font-mono font-medium text-rose-300 hover:bg-rose-900/40 hover:text-white transition-colors"
          >
            <Trash2 className="h-4 w-4 text-rose-400" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Dialog for Clear History */}
      <ConfirmationDialog
        isOpen={showClearDialog}
        title="Clear Analysis History"
        message="Are you sure you want to clear all stored vehicle analyses? This will erase locally cached analysis runs."
        confirmLabel="Clear All Data"
        isDestructive={true}
        onConfirm={handleClearHistory}
        onCancel={() => setShowClearDialog(false)}
      />

      {/* Dialog for Reset Fleet */}
      <ConfirmationDialog
        isOpen={showResetDialog}
        title="Restore Initial Fleet"
        message="This will repopulate local analysis history with initial benchmark vehicles (sedans, SUVs, hatchbacks with MPFI and GDI)."
        confirmLabel="Restore Fleet"
        isDestructive={false}
        onConfirm={handleResetDemo}
        onCancel={() => setShowResetDialog(false)}
      />
    </div>
  )
}
