import React, { useState, useEffect } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts"
import { useTheme } from "../context/ThemeContext"
import { useStockContext } from "../context/StockContext"
import { type IndicatorsResponse } from "../services/api"
import {
  Loader2,
  Zap,
  Compass,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sliders,
} from "lucide-react"

interface TechnicalAnalysisProps {
  symbol: string
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ symbol }) => {
  const { theme } = useTheme()
  const { getCachedIndicators } = useStockContext()
  const [data, setData] = useState<IndicatorsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndicatorView, setActiveIndicatorView] = useState<"rsi" | "macd" | "bollinger">("rsi")

  const isDark = theme === "dark"

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)

    getCachedIndicators(symbol)
      .then((res) => {
        if (!isCancelled) {
          setData(res)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || "Failed to load indicators")
          setLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [symbol, getCachedIndicators])

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white/90 dark:bg-[#0E1526]/80 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-cardLight dark:shadow-terminal">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-bullish" />
        <span className="text-xs font-mono">Calculating algorithmic technical indicators for {symbol}...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-rose-600 dark:text-bearish bg-white/90 dark:bg-[#0E1526]/80 rounded-2xl border border-rose-200 dark:border-bearish-border shadow-cardLight dark:shadow-terminal">
        <span className="font-mono text-xs">{error || "No technical indicator telemetry available"}</span>
      </div>
    )
  }

  const { summary, data: records } = data

  const getSignalBadge = (sig?: string) => {
    if (!sig) return null
    if (sig === "Bullish" || sig === "Oversold") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-50 dark:bg-bullish-muted text-emerald-700 dark:text-bullish border border-emerald-200 dark:border-bullish-border">
          <ArrowUpRight className="h-3 w-3" /> {sig}
        </span>
      )
    }
    if (sig === "Bearish" || sig === "Overbought") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-rose-50 dark:bg-bearish-muted text-rose-700 dark:text-bearish border border-rose-200 dark:border-bearish-border">
          <ArrowDownRight className="h-3 w-3" /> {sig}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06]">
        <Minus className="h-3 w-3" /> {sig}
      </span>
    )
  }

  const rsiValue = summary.rsi?.value ?? 50
  const rsiPos = Math.max(0, Math.min(100, rsiValue))

  return (
    <div className="space-y-5">
      {/* Indicator Telemetry Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trend Direction Card */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal flex flex-col justify-between space-y-3 transition-colors duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Compass className="h-3.5 w-3.5 text-blue-600 dark:text-bullish" /> Macro Trend
            </span>
            {getSignalBadge(summary.trend)}
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">SMA Confluence</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Price vs 20-day & 50-day Moving Average</p>
          </div>
        </div>

        {/* RSI 14-Day Oscillator Card with Visual Meter */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal flex flex-col justify-between space-y-3 transition-colors duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Activity className="h-3.5 w-3.5 text-blue-600 dark:text-cyanAccent" /> RSI (14) Index
            </span>
            {getSignalBadge(summary.rsi?.signal)}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{rsiValue.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500">Scale: 0 - 100</span>
            </div>
            {/* Visual RSI Slider */}
            <div className="relative h-2 w-full bg-slate-100 dark:bg-[#131D33] rounded-full overflow-hidden border border-slate-200/80 dark:border-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  rsiValue < 30
                    ? "bg-emerald-500 dark:bg-bullish"
                    : rsiValue > 70
                    ? "bg-rose-500 dark:bg-bearish"
                    : "bg-blue-600 dark:bg-cyanAccent"
                }`}
                style={{ width: `${rsiPos}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* MACD Signal Card */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal flex flex-col justify-between space-y-3 transition-colors duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-violetAccent" /> MACD Crossover
            </span>
            {getSignalBadge(summary.macd?.signal)}
          </div>
          <div>
            <div className="font-mono text-xs space-y-1 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">MACD:</span>
                <span className="font-bold tabular-nums text-slate-900 dark:text-white">{summary.macd?.macd.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Signal:</span>
                <span className="font-bold tabular-nums text-indigo-600 dark:text-violetAccent">{summary.macd?.signal_line.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bollinger Bands Card */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal flex flex-col justify-between space-y-3 transition-colors duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sliders className="h-3.5 w-3.5 text-amber-500 dark:text-amberAccent" /> Bollinger Bands
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">20-Period (2σ)</span>
          </div>
          <div>
            <div className="font-mono text-xs space-y-1 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Upper:</span>
                <span className="text-slate-900 dark:text-slate-200 tabular-nums">${summary.bollinger?.upper.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Lower:</span>
                <span className="text-slate-900 dark:text-slate-200 tabular-nums">${summary.bollinger?.lower.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Specialized Sub-Charts */}
      <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl space-y-5 shadow-cardLight dark:shadow-terminal transition-colors duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Algorithmic Oscillator Charts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical momentum waveforms and threshold boundary analyses for {symbol}
            </p>
          </div>

          {/* View Switcher Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#080C14] border border-slate-200/80 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveIndicatorView("rsi")}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
                activeIndicatorView === "rsi"
                  ? "bg-white dark:bg-[#18243E] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              RSI (14)
            </button>
            <button
              type="button"
              onClick={() => setActiveIndicatorView("macd")}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
                activeIndicatorView === "macd"
                  ? "bg-white dark:bg-[#18243E] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              MACD
            </button>
            <button
              type="button"
              onClick={() => setActiveIndicatorView("bollinger")}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
                activeIndicatorView === "bollinger"
                  ? "bg-white dark:bg-[#18243E] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Bollinger Bands
            </button>
          </div>
        </div>

        {/* RSI Chart View */}
        {activeIndicatorView === "rsi" && (
          <div className="h-72 w-full">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-2">
              <span className="text-blue-600 dark:text-cyanAccent font-semibold">RSI Line (14)</span>
              <span>Overbought Zone &gt; 70 &bull; Oversold Zone &lt; 30</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "#E2E8F0"} vertical={false} />
                <XAxis
                  dataKey="Date"
                  stroke={isDark ? "#475569" : "#94A3B8"}
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  tickFormatter={(val) => {
                    const p = val.split("-")
                    return p.length >= 3 ? `${p[1]}/${p[2]}` : val
                  }}
                  minTickGap={45}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke={isDark ? "#475569" : "#94A3B8"}
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  orientation="right"
                  ticks={[30, 50, 70]}
                />
                <ReferenceLine y={70} stroke={isDark ? "#FF385C" : "#DC2626"} strokeDasharray="4 4" label={{ value: "70 Overbought", fill: isDark ? "#FF385C" : "#DC2626", fontSize: 10 }} />
                <ReferenceLine y={30} stroke={isDark ? "#00E599" : "#059669"} strokeDasharray="4 4" label={{ value: "30 Oversold", fill: isDark ? "#00E599" : "#059669", fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload
                      return (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-800 dark:text-slate-200 shadow-md">
                          <div className="text-slate-500 dark:text-slate-400 text-[10px]">{d.Date}</div>
                          <div className="font-bold text-blue-600 dark:text-cyanAccent tabular-nums">RSI: {d.RSI ? d.RSI.toFixed(2) : "N/A"}</div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line type="monotone" dataKey="RSI" stroke={isDark ? "#00D2FF" : "#2563EB"} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* MACD Chart View */}
        {activeIndicatorView === "macd" && (
          <div className="h-72 w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-900 dark:text-white">
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyanAccent"></span> MACD (12, 26)
                </span>
                <span className="flex items-center gap-1 text-indigo-600 dark:text-violetAccent">
                  <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-violetAccent"></span> Signal (9)
                </span>
              </div>
              <span className="text-slate-400 dark:text-slate-500">Histogram Momentum Bars</span>
            </div>
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "#E2E8F0"} vertical={false} />
                <XAxis
                  dataKey="Date"
                  stroke={isDark ? "#475569" : "#94A3B8"}
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  tickFormatter={(val) => {
                    const p = val.split("-")
                    return p.length >= 3 ? `${p[1]}/${p[2]}` : val
                  }}
                  minTickGap={45}
                />
                <YAxis stroke={isDark ? "#475569" : "#94A3B8"} fontSize={11} fontFamily="JetBrains Mono, monospace" orientation="right" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload
                      return (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1 shadow-md">
                          <div className="text-slate-400 text-[10px]">{d.Date}</div>
                          <div>MACD: <span className="font-bold text-blue-600 dark:text-cyanAccent">{d.MACD?.toFixed(2)}</span></div>
                          <div>Signal: <span className="font-bold text-indigo-600 dark:text-violetAccent">{d.MACD_Signal?.toFixed(2)}</span></div>
                          <div>Hist: <span className="font-bold text-slate-900 dark:text-white">{d.MACD_Hist?.toFixed(2)}</span></div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <ReferenceLine y={0} stroke={isDark ? "#475569" : "#CBD5E1"} />
                <Bar dataKey="MACD_Hist" fill={isDark ? "#00E599" : "#059669"} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bollinger Bands View */}
        {activeIndicatorView === "bollinger" && (
          <div className="h-72 w-full">
            <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 pb-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-900 dark:text-white">
                  <span className="h-2 w-2 rounded-full bg-slate-900 dark:bg-white"></span> Close Price
                </span>
                <span className="flex items-center gap-1 text-blue-600 dark:text-cyanAccent">
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyanAccent"></span> SMA 20
                </span>
                <span className="flex items-center gap-1 text-indigo-600 dark:text-violetAccent">
                  <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-violetAccent"></span> Bollinger Bands
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "#E2E8F0"} vertical={false} />
                <XAxis
                  dataKey="Date"
                  stroke={isDark ? "#475569" : "#94A3B8"}
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  tickFormatter={(val) => {
                    const p = val.split("-")
                    return p.length >= 3 ? `${p[1]}/${p[2]}` : val
                  }}
                  minTickGap={45}
                />
                <YAxis stroke={isDark ? "#475569" : "#94A3B8"} fontSize={11} fontFamily="JetBrains Mono, monospace" orientation="right" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload
                      return (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1 shadow-md">
                          <div className="text-slate-400 text-[10px]">{d.Date}</div>
                          <div>Close: <span className="font-bold text-slate-900 dark:text-white">${d.Close?.toFixed(2)}</span></div>
                          <div>Upper Band: <span className="font-bold text-indigo-600 dark:text-violetAccent">${d.BB_Upper?.toFixed(2)}</span></div>
                          <div>Lower Band: <span className="font-bold text-indigo-600 dark:text-violetAccent">${d.BB_Lower?.toFixed(2)}</span></div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line type="monotone" dataKey="Close" stroke={isDark ? "#ffffff" : "#0F172A"} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="SMA_20" stroke={isDark ? "#00D2FF" : "#2563EB"} strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
                <Line type="monotone" dataKey="BB_Upper" stroke={isDark ? "#8B5CF6" : "#7C3AED"} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="BB_Lower" stroke={isDark ? "#8B5CF6" : "#7C3AED"} strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
