import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Overview } from '@/pages/Overview'
import { NewAnalysis } from '@/pages/NewAnalysis'
import { AnalysisResults } from '@/pages/AnalysisResults'
import { Comparison } from '@/pages/Comparison'
import { History } from '@/pages/History'
import { About } from '@/pages/About'
import { Settings } from '@/pages/Settings'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="new-analysis" element={<NewAnalysis />} />
          <Route path="results" element={<AnalysisResults />} />
          <Route path="results/:id" element={<AnalysisResults />} />
          <Route path="comparison" element={<Comparison />} />
          <Route path="history" element={<History />} />
          <Route path="about" element={<About />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
