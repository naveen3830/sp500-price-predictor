import React, { useState, useEffect } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"
import { fetchStockHistory, type HistoryPoint } from "../services/api"
import { Loader2 } from "lucide-react"

interface PriceChartProps {
  symbol: string
}

const PERIODS = [
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
  { label: "ALL", value: "all" },
]

export const PriceChart: React.FC<PriceChartProps> = ({ symbol }) => {
  const [period, setPeriod] = useState<string>("1y")
  const [data, setData] = useState<HistoryPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)

    fetchStockHistory(symbol, period)
      .then((res) => {
        if (!isCancelled) {
          setData(res.history)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || "Failed to load history")
          setLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [symbol, period])

  const minPrice = data.length > 0 ? Math.min(...data.map((d) => d.Low)) * 0.98 : 0
  const maxPrice = data.length > 0 ? Math.max(...data.map((d) => d.High)) * 1.02 : 100

  const isUp =
    data.length >= 2 ? data[data.length - 1].Close >= data[0].Close : true

  const strokeColor = isUp ? "#10B981" : "#F43F5E"
  const gradientId = `priceGradient_${symbol}`

  return (
    <div className="p-6 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-foreground">Interactive Price History</h3>
          <p className="text-xs text-muted-foreground">
            OHLCV trend lines for {symbol} with dynamic volume analysis
          </p>
        </div>

        <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border/60">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                period === p.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs">Loading market history for {symbol}...</span>
        </div>
      ) : error ? (
        <div className="h-80 flex items-center justify-center text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Main Price Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis
                  dataKey="Date"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={40}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[minPrice, maxPrice]}
                  tickFormatter={(v) => `$${v.toFixed(0)}`}
                  width={55}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, "Close Price"]}
                  labelStyle={{ color: "#94A3B8" }}
                />
                <Area
                  type="monotone"
                  dataKey="Close"
                  stroke={strokeColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#${gradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Histogram */}
          <div className="h-20 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="Date" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Bar dataKey="Volume" fill="#334155" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
