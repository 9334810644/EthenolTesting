import React, { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { FullVehicleAnalysis } from '@/types/analysis'
import { jsPDF } from 'jspdf'

interface PDFDownloadButtonProps {
  analysis: FullVehicleAnalysis;
  className?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  analysis,
  className = '',
}) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      const doc = new jsPDF()
      const { vehicleInput, results, id, createdAt } = analysis

      // Header Banner
      doc.setFillColor(15, 23, 42) // Dark Navy
      doc.rect(0, 0, 210, 35, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('ETHANOL ANALYTICS - ENGINEERING REPORT', 14, 18)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(148, 163, 184)
      doc.text('Vehicle Mechanical Safety & Economic Efficiency Analysis System', 14, 25)

      // Report Metadata
      doc.setTextColor(51, 65, 85)
      doc.setFontSize(8)
      doc.text(`Report ID: ${id}  |  Generated: ${new Date(createdAt).toLocaleString()}`, 14, 43)
      doc.text('Powertrain Engineering Analysis: E20 Compatibility & Fuel Economy Evaluation', 14, 48)

      // Horizontal separator
      doc.setDrawColor(203, 213, 225)
      doc.line(14, 52, 196, 52)

      // Vehicle Specifications Section
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('1. Vehicle Specifications & Fuel Configuration', 14, 60)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(71, 85, 105)

      const specs = [
        ['Vehicle Mass (m):', `${vehicleInput.vehicleWeight} kg`, 'Fuel Injection Type:', vehicleInput.fuelInjection],
        ['Odometer Reading (odo):', `${vehicleInput.odometer.toLocaleString()} km`, 'Manufacturing Year:', `${vehicleInput.manufacturingYear}`],
        ['Ethanol Blend (X):', `E${vehicleInput.ethanolBlend} (${vehicleInput.ethanolBlend}%)`, 'Base Petrol Mileage (Mo):', `${vehicleInput.baseMileage} km/L`],
      ]

      let currentY = 67
      specs.forEach(([label1, val1, label2, val2]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label1, 14, currentY)
        doc.setFont('helvetica', 'normal')
        doc.text(val1, 65, currentY)

        doc.setFont('helvetica', 'bold')
        doc.text(label2, 115, currentY)
        doc.setFont('helvetica', 'normal')
        doc.text(val2, 165, currentY)

        currentY += 6
      })

      // Mechanical Safety Section
      currentY += 4
      doc.line(14, currentY, 196, currentY)
      currentY += 8

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('2. Mechanical Safety & E20 Decision Gate', 14, currentY)

      currentY += 7
      doc.setFontSize(9)
      const safetyMetrics = [
        `Decision Result: [${results.mechanicalSafety.decisionGate.color}] ${results.mechanicalSafety.decisionGate.uiDisplay}`,
        `Fuel Trim Required (FT_req): ${results.mechanicalSafety.decisionGate.fuelTrimReq}% (${results.mechanicalSafety.decisionGate.fuelTrimStatus.toUpperCase()})`,
        `Corrosion Index (CI_real): ${results.mechanicalSafety.decisionGate.corrosionIndexReal} / 100 (${results.mechanicalSafety.decisionGate.corrosionStatus.toUpperCase()})`,
        `Mileage Drop (ΔM): ${results.mechanicalSafety.decisionGate.mileageDropPercent}% (${results.mechanicalSafety.decisionGate.mileageDropStatus.toUpperCase()})`,
        `Mechanical Safety Index: ${results.mechanicalSafety.safetyIndex} / 100`,
        `Risk Classification: ${results.mechanicalSafety.riskClassification.toUpperCase()}`,
        `Engine Stress Indicator: ${results.mechanicalSafety.engineStressIndicator}%`,
      ]

      safetyMetrics.forEach((line) => {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(51, 65, 85)
        doc.text(`•  ${line}`, 18, currentY)
        currentY += 5.5
      })

      // Economic Efficiency Section
      currentY += 4
      doc.line(14, currentY, 196, currentY)
      currentY += 8

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('3. Economic Efficiency & Mileage Analysis', 14, currentY)

      currentY += 7
      doc.setFontSize(9)
      const econMetrics = [
        `Calculated Real Mileage (M_real): ${results.economicEfficiency.estimatedMileage} km/L`,
        `Mileage Drop (ΔM): ${results.economicEfficiency.mileageDifferencePercent}% (${results.economicEfficiency.mileageDifferencePercent <= 6 ? 'Optimal/Mild' : 'Severe Loss'})`,
        `Fuel Consumption Rate (FC): ${results.economicEfficiency.fuelConsumption} L/100km`,
        `Mileage Variance vs Base: ${results.economicEfficiency.mileageDifferenceKmPerL} km/L`,
        `Economic Efficiency Index: ${results.economicEfficiency.economicEfficiencyIndex} / 100`,
        `Estimated Cost per 100 km: ${results.economicEfficiency.estimatedCostPer100Km}`,
      ]

      econMetrics.forEach((line) => {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(51, 65, 85)
        doc.text(`•  ${line}`, 18, currentY)
        currentY += 5.5
      })

      // Fuel Properties
      currentY += 4
      doc.line(14, currentY, 196, currentY)
      currentY += 8

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('4. Fuel Thermodynamic Properties (Estimated)', 14, currentY)

      currentY += 7
      doc.setFontSize(9)
      const fuelProps = [
        `Lower Heating Value (Energy Density): ${results.fuelProperties.energyDensity} MJ/L (${results.fuelProperties.energyDensityLossPercent}% vs E0)`,
        `Stoichiometric Air-Fuel Ratio (AFR): ${results.fuelProperties.stoichiometricAfr}:1`,
        `Latent Heat of Vaporization: ${results.fuelProperties.latentHeatVaporization} kJ/kg`,
        `Calculated Research Octane Number (RON): ${results.fuelProperties.estimatedOctaneRating}`,
      ]

      fuelProps.forEach((line) => {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(51, 65, 85)
        doc.text(`•  ${line}`, 18, currentY)
        currentY += 5.5
      })

      // Engineering Note Footer
      doc.setFillColor(248, 250, 252)
      doc.rect(14, 255, 182, 30, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(14, 255, 182, 30, 'S')

      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(100, 116, 139)
      doc.text('ENGINEERING CERTIFICATION NOTE:', 18, 262)
      doc.setFont('helvetica', 'normal')
      doc.text(
        'Calculations generated using the Multi-Layer Automotive Engineering Formulation Suite.',
        18,
        268
      )
      doc.text(
        'Evaluation covers stoichiometric air-fuel trim, material corrosion risk index, and real road mileage.',
        18,
        273
      )
      doc.text(`System Version: ${results.version} | Timestamp: ${results.calculationTimestamp}`, 18, 278)

      // Save the generated PDF
      doc.save(`Ethanol_Analysis_${id}.pdf`)
    } catch (e) {
      console.error('Failed to generate PDF', e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all ${className}`}
      title="Download PDF Engineering Report"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
      ) : (
        <FileDown className="h-4 w-4 text-blue-400" />
      )}
      <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Report'}</span>
    </button>
  )
}
