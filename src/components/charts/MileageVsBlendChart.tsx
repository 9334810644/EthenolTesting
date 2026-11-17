import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
} from 'recharts'
import { BlendCurvePoint } from '@/types/analysis'

interface MileageVsBlendChartProps {
  data: BlendCurvePoint[];
  currentBlend?: number;
  height?: number;
}

export const MileageVsBlendChart: React.FC<MileageVsBlendChartProps> = ({
  data,
  currentBlend,
  height = 340,
}) => {
  const currentPoint = currentBlend !== undefined
    ? data.find((d) => d.blend === currentBlend)
    : undefined

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis
            dataKey="blend"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
            tickFormatter={(val) => `E${val}`}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
            domain={['auto', 'auto']}
            unit=" km/L"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
            formatter={(value: any, name: any) => {
              const label = String(name || '')
              if (label === 'Calculated Mileage (M_real)') return [`${value} km/L`, label]
              return [value, label]
            }}
            labelFormatter={(label) => `Ethanol Blend: E${label} (${label}%)`}
          />

          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }}
          />

          <Line
            type="monotone"
            dataKey="mileage"
            name="Calculated Mileage (M_real)"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ r: 4, fill: '#06b6d4', stroke: '#0a0f1d', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#38bdf8' }}
          />

          {currentPoint && (
            <ReferenceDot
              x={currentPoint.blend}
              y={currentPoint.mileage}
              r={8}
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
