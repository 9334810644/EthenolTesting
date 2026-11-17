import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface MpfiVsGdiChartProps {
  data?: Array<{
    parameter: string;
    mpfi: number;
    gdi: number;
    unit: string;
  }>;
  height?: number;
}

export const MpfiVsGdiChart: React.FC<MpfiVsGdiChartProps> = ({
  data,
  height = 320,
}) => {
  const defaultData = [
    { parameter: 'Mileage (E20)', mpfi: 16.4, gdi: 17.2, unit: 'km/L' },
    { parameter: 'Safety Score', mpfi: 86, gdi: 82, unit: 'pts' },
    { parameter: 'Economic Index', mpfi: 82, gdi: 89, unit: 'pts' },
    { parameter: 'Consumption', mpfi: 6.1, gdi: 5.8, unit: 'L/100km' },
    { parameter: 'Octane Benefit', mpfi: 68, gdi: 88, unit: '%' },
  ]

  const chartData = data || defaultData

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="parameter"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'sans-serif' }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
            formatter={(value: any, name: any, item: any) => {
              const unit = item?.payload?.unit || ''
              return [`${value} ${unit}`, String(name || '')]
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }}
          />
          <Bar
            dataKey="mpfi"
            name="MPFI (Port Injection)"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
          <Bar
            dataKey="gdi"
            name="GDI (Direct Injection)"
            fill="#06b6d4"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
