import React, { useState, useEffect, useMemo } from "react"
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
import { useTheme } from "../context/ThemeContext"
import { useStockContext } from "../context/StockContext"
import { type HistoryPoint } from "../services/api"
import { Loader2, TrendingUp, TrendingDown, Clock, BarChart2 } from "lucide-react"

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
  const { theme } = useTheme()
  const { getCachedHistory } = useStockContext()
  const [period, setPeriod] = useState<string>("1y")
  const [data, setData] = useState<HistoryPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const isDark = theme === "dark"

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)

    getCachedHistory(symbol, period)
      .then((history) => {
        if (!isCancelled) {
          setData(history)
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
  }, [symbol, period, getCachedHistory])

  const { minPrice, maxPrice, periodChange, periodChangePct, isPositive } = useMemo(() => {
    if (data.length < 2) {
      return { minPrice: 0, maxPrice: 100, periodChange: 0, periodChangePct: 0, isPositive: true }
    }
    const lowValues = data.map((d) => d.Low)
    const highValues = data.map((d) => d.High)
    const min = Math.min(...lowValues) * 0.98
    const max = Math.max(...highValues) * 1.02

    const first = data[0].Close
    const last = data[data.length - 1].Close
    const change = last - first
    const changePct = first > 0 ? (change / first) * 100 : 0

    return {
      minPrice: min,
      maxPrice: max,
      periodChange: change,
      periodChangePct: changePct,
      isPositive: change >= 0,
    }
  }, [data])

  const strokeColor = isDark
    ? isPositive ? "#00E599" : "#FF385C"
    : isPositive ? "#059669" : "#DC2626"

  const gradientId = `priceGradient_${symbol}_${period}_${theme}`

  return (
    <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl space-y-5 shadow-cardLight dark:shadow-terminal transition-colors duration-200">
      {/* Chart Header & Period Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Price Action
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold tabular-nums border ${
                isPositive
                  ? "bg-emerald-50 dark:bg-bullish-muted text-emerald-700 dark:text-bullish border-emerald-200 dark:border-bullish-border"
                  : "bg-rose-50 dark:bg-bearish-muted text-rose-700 dark:text-bearish border-rose-200 dark:border-bearish-border"
              }`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {periodChange.toFixed(2)} ({isPositive ? "+" : ""}
              {periodChangePct.toFixed(2)}%)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Historical OHLCV trajectory for {symbol} &bull; Adjusted closing quotations
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#080C14] border border-slate-200/80 dark:border-white/[0.06]">
          {PERIODS.map((p) => {
            const active = period === p.value
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-white dark:bg-[#18243E] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-bullish" />
          <span className="text-xs font-mono">Loading {symbol} price history...</span>
        </div>
      ) : error || data.length === 0 ? (
        <div className="h-96 flex items-center justify-center text-rose-600 dark:text-bearish text-xs font-mono bg-rose-50 dark:bg-bearish-muted rounded-xl border border-rose-200 dark:border-bearish-border p-6">
          {error || "No price history available for the selected timeframe"}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Main Price Area Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity={isDark ? 0.35 : 0.25} />
                    <stop offset="60%" stopColor={strokeColor} stopOpacity={isDark ? 0.08 : 0.04} />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255,255,255,0.04)" : "#E2E8F0"}
                  vertical={false}
                />
                <XAxis
                  dataKey="Date"
                  tickLine={false}
                  axisLine={false}
                  stroke={isDark ? "#475569" : "#94A3B8"}
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  tickFormatter={(val) => {
                    const parts = val.split("-")
                    return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : val
                  }}
                  minTickGap={45}
                />
                <YAxis
                  domain={[minPrice, maxPrice]}
                  tickLine={false}
                  axisLine={false}
                  stroke={isDark ? "#475569" : "#94A3B8"}
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  orientation="right"
                  tickFormatter={(val) => `$${val.toFixed(0)}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as HistoryPoint
                      return (
                        <div className="p-3.5 rounded-xl bg-white/95 dark:bg-[#090E1A]/95 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-xl font-mono text-xs space-y-1.5 text-slate-800 dark:text-slate-200 min-w-[170px]">
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans border-b border-slate-200/80 dark:border-white/[0.08] pb-1 font-semibold flex items-center justify-between">
                            <span>{item.Date}</span>
                            <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Close:</span>
                            <span className="font-bold text-slate-900 dark:text-white tabular-nums">${item.Close.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">High:</span>
                            <span className="text-emerald-600 dark:text-bullish tabular-nums">${item.High.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Low:</span>
                            <span className="text-rose-600 dark:text-bearish tabular-nums">${item.Low.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-slate-200/80 dark:border-white/[0.06] text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400">Volume:</span>
                            <span className="text-blue-600 dark:text-cyanAccent tabular-nums">{(item.Volume / 1e6).toFixed(2)}M</span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Close"
                  stroke={strokeColor}
                  strokeWidth={2.5}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  activeDot={{ r: 5, fill: strokeColor, stroke: isDark ? "#ffffff" : "#ffffff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Histogram Bar Chart */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.04]">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-2 pb-1">
              <span className="flex items-center gap-1 font-semibold uppercase text-slate-600 dark:text-slate-400">
                <BarChart2 className="h-3 w-3 text-blue-600 dark:text-cyanAccent" /> Trading Volume Distribution
              </span>
              <span>Units: Millions</span>
            </div>
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <Bar
                    dataKey="Volume"
                    fill={isDark ? "#00D2FF" : "#38BDF8"}
                    opacity={isDark ? 0.35 : 0.5}
                    radius={[2, 2, 0, 0]}
                  />
                  <XAxis dataKey="Date" hide />
                  <YAxis hide orientation="right" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as HistoryPoint
                        return (
                          <div className="px-2 py-1 rounded-md bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-800 dark:text-slate-200 shadow-sm">
                            Vol: {(item.Volume / 1e6).toFixed(2)}M
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
