"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
  { month: "Jan", addition: 55, deletion: 40, change: 35 },
  { month: "Feb", addition: 60, deletion: 38, change: 40 },
  { month: "Mar", addition: 58, deletion: 42, change: 38 },
  { month: "Apr", addition: 62, deletion: 39, change: 42 },
  { month: "May", addition: 65, deletion: 41, change: 45 },
  { month: "Jun", addition: 63, deletion: 44, change: 43 },
  { month: "Jul", addition: 68, deletion: 46, change: 48 },
  { month: "Aug", addition: 70, deletion: 45, change: 50 },
  { month: "Sep", addition: 69, deletion: 43, change: 49 },
  { month: "Oct", addition: 72, deletion: 47, change: 52 },
  { month: "Nov", addition: 75, deletion: 49, change: 55 },
  { month: "Des", addition: 78, deletion: 50, change: 58 },
]

export default function StatisticsChart() {
  return (
    <div className="bg-card rounded-2xl p-8 border border-border stats-chart">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary">📊</span> statistik
          </h2>
        </div>
        <div className="flex items-center gap-4 bg-card/50 px-4 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
            <span className="text-xs text-muted-foreground">File Changed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
            <span className="text-xs text-muted-foreground">addition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-3"></div>
            <span className="text-xs text-muted-foreground">deletions</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAddition" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(96, 165, 250)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="rgb(96, 165, 250)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDeletion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorChange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(239, 68, 68)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="rgb(239, 68, 68)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="addition"
            stroke="rgb(96, 165, 250)"
            fillOpacity={1}
            fill="url(#colorAddition)"
          />
          <Area
            type="monotone"
            dataKey="deletion"
            stroke="rgb(34, 197, 94)"
            fillOpacity={1}
            fill="url(#colorDeletion)"
          />
          <Area type="monotone" dataKey="change" stroke="rgb(239, 68, 68)" fillOpacity={1} fill="url(#colorChange)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
