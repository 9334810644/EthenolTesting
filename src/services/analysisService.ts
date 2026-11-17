import axios, { AxiosInstance } from 'axios'
import { VehicleInput } from '@/types/vehicle'
import { FullVehicleAnalysis, InjectionComparisonResult } from '@/types/analysis'
import { MockCalculationService } from './mockCalculationService'
import { generateInitialAnalyses } from '@/data/mockData'

const STORAGE_KEY = 'ethanol_vehicle_analyses_v1'

// Axios client prepared for future Python FastAPI backend integration
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

class AnalysisService {
  private useBackendApi: boolean = false

  constructor() {
    // Check if backend API is requested via environment variable
    if (import.meta.env.VITE_USE_BACKEND === 'true') {
      this.useBackendApi = true
    }
  }

  /**
   * Retrieves all historical vehicle analyses from localStorage (or backend)
   */
  public async getAnalyses(): Promise<FullVehicleAnalysis[]> {
    if (this.useBackendApi) {
      try {
        const response = await apiClient.get<FullVehicleAnalysis[]>('/analyses')
        return response.data
      } catch (err) {
        console.warn('Backend unavailable, falling back to local storage cache.', err)
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        const initial = generateInitialAnalyses()
        this.saveAnalysesToStorage(initial)
        return initial
      }
      const parsed = JSON.parse(stored) as FullVehicleAnalysis[]
      // Upgrade existing records to v3.0-handwritten-formulas
      const upgraded = parsed.map((item) => {
        if (item.results?.version !== 'v3.0-handwritten-formulas') {
          const freshResults = MockCalculationService.calculateAnalysis(item.vehicleInput)
          return { ...item, results: freshResults }
        }
        return item
      })
      this.saveAnalysesToStorage(upgraded)
      return upgraded
    } catch (e) {
      console.error('Failed to parse stored analyses', e)
      const initial = generateInitialAnalyses()
      return initial
    }
  }

  /**
   * Retrieves a single analysis by unique ID
   */
  public async getAnalysisById(id: string): Promise<FullVehicleAnalysis | null> {
    if (this.useBackendApi) {
      try {
        const response = await apiClient.get<FullVehicleAnalysis>(`/analyses/${id}`)
        return response.data
      } catch {
        // Fallback to local
      }
    }

    const all = await this.getAnalyses()
    const found = all.find((a) => a.id === id)
    return found || null
  }

  /**
   * Executes an analysis on a vehicle input
   * Currently invokes MockCalculationService with simulated network latency
   * Prepared for future FastAPI POST /calculate endpoint
   */
  public async runAnalysis(input: VehicleInput, title?: string): Promise<FullVehicleAnalysis> {
    if (this.useBackendApi) {
      try {
        const response = await apiClient.post<FullVehicleAnalysis>('/calculate', {
          vehicle_input: input,
          title,
        })
        const created = response.data
        const all = await this.getAnalyses()
        this.saveAnalysesToStorage([created, ...all])
        return created
      } catch (err) {
        console.warn('Backend calculation failed, using modular mock engine.', err)
      }
    }

    // Simulate realistic computation latency (400ms) for high-end feel
    await new Promise((resolve) => setTimeout(resolve, 400))

    const results = MockCalculationService.calculateAnalysis(input)
    const newId = `ANL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    const analysisRecord: FullVehicleAnalysis = {
      id: newId,
      title: title || input.vehicleModel || `${input.fuelInjection} Test Vehicle (${input.manufacturingYear})`,
      vehicleInput: input,
      results,
      createdAt: new Date().toISOString(),
      status: 'completed',
    }

    const currentList = await this.getAnalyses()
    const updated = [analysisRecord, ...currentList]
    this.saveAnalysesToStorage(updated)

    return analysisRecord
  }

  /**
   * Runs a comparative calculation between MPFI and GDI
   */
  public async runComparison(input: VehicleInput): Promise<InjectionComparisonResult> {
    if (this.useBackendApi) {
      try {
        const res = await apiClient.post<InjectionComparisonResult>('/compare', input)
        return res.data
      } catch (err) {
        console.warn('Backend compare endpoint unavailable, using mock engine', err)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 350))
    return MockCalculationService.compareInjectionTypes(input)
  }

  /**
   * Deletes an analysis record by ID
   */
  public async deleteAnalysis(id: string): Promise<boolean> {
    const list = await this.getAnalyses()
    const filtered = list.filter((a) => a.id !== id)
    this.saveAnalysesToStorage(filtered)
    return true
  }

  /**
   * Resets local history to clean initial mock state
   */
  public resetToDefaultDemo(): FullVehicleAnalysis[] {
    const initial = generateInitialAnalyses()
    this.saveAnalysesToStorage(initial)
    return initial
  }

  /**
   * Clears all stored analyses
   */
  public clearAllAnalyses(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }

  private saveAnalysesToStorage(items: FullVehicleAnalysis[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
  }
}

export const analysisService = new AnalysisService()
