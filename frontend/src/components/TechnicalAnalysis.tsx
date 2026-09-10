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
import { fetchStockIndicators, type IndicatorsResponse } from "../services/api"
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
  const [data, setData] = useState<IndicatorsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndicatorView, setActiveIndicatorView] = useState<"rsi" | "macd" | "bollinger">("rsi")

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)

    fetchStockIndicators(symbol)
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
  }, [symbol])

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-[#0E1526]/80 rounded-2xl border border-white/[0.08] p-6 shadow-terminal">
        <Loader2 className="h-8 w-8 animate-spin text-bullish" />
        <span className="text-xs font-mono">Calculating algorithmic technical indicators for {symbol}...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-bearish bg-[#0E1526]/80 rounded-2xl border border-bearish-border shadow-terminal">
        <span className="font-mono text-xs">{error || "No technical indicator telemetry available"}</span>
      </div>
    )
  }

  const { summary, data: records } = data

  const getSignalBadge = (sig?: string) => {
    if (!sig) return null
    if (sig === "Bullish" || sig === "Oversold") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-bullish-muted text-bullish border border-bullish-border">
          <ArrowUpRight className="h-3 w-3" /> {sig}
        </span>
      )
    }
    if (sig === "Bearish" || sig === "Overbought") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-bearish-muted text-bearish border border-bearish-border">
          <ArrowDownRight className="h-3 w-3" /> {sig}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-medium bg-white/[0.04] text-slate-400 border border-white/[0.06]">
        <Minus className="h-3 w-3" /> {sig}
      </span>
    )
  }

  // RSI Gauge value
  const rsiValue = summary.rsi?.value ?? 50
  const rsiPos = Math.max(0, Math.min(100, rsiValue))

  return (
    <div className="space-y-5">
      {/* Indicator Telemetry Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trend Direction Card */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Compass className="h-3.5 w-3.5 text-bullish" /> Macro Trend
            </span>
            {getSignalBadge(summary.trend)}
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">SMA Confluence</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Price vs 20-day & 50-day Simple Moving Average</p>
          </div>
        </div>

        {/* RSI 14-Day Oscillator Card with Visual Meter */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Activity className="h-3.5 w-3.5 text-cyanAccent" /> RSI (14) Index
            </span>
            {getSignalBadge(summary.rsi?.signal)}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-2xl font-black text-white tabular-nums">{rsiValue.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500">Scale: 0 - 100</span>
            </div>
            {/* Visual RSI Slider */}
            <div className="relative h-2 w-full bg-[#131D33] rounded-full overflow-hidden border border-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  rsiValue < 30
                    ? "bg-bullish"
                    : rsiValue > 70
                    ? "bg-bearish"
                    : "bg-cyanAccent"
                }`}
                style={{ width: `${rsiPos}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* MACD Signal Card */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Zap className="h-3.5 w-3.5 text-violetAccent" /> MACD Crossover
            </span>
            {getSignalBadge(summary.macd?.signal)}
          </div>
          <div>
            <div className="font-mono text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">MACD:</span>
                <span className="font-bold tabular-nums text-white">{summary.macd?.macd.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Signal:</span>
                <span className="font-bold tabular-nums text-violetAccent">{summary.macd?.signal_line.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bollinger Bands Card */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sliders className="h-3.5 w-3.5 text-amberAccent" /> Bollinger Bands
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">20-Period (2σ)</span>
          </div>
          <div>
            <div className="font-mono text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Upper:</span>
                <span className="text-slate-200 tabular-nums">${summary.bollinger?.upper.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lower:</span>
                <span className="text-slate-200 tabular-nums">${summary.bollinger?.lower.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Specialized Sub-Charts */}
      <div className="p-6 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl space-y-5 shadow-terminal">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Algorithmic Oscillator Charts</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical momentum waveforms and threshold boundary analyses for {symbol}
            </p>
          </div>

          {/* View Switcher Pills */}
          <div className="flex items-center p-1 rounded-xl bg-[#080C14] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveIndicatorView("rsi")}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
                activeIndicatorView === "rsi"
                  ? "bg-[#18243E] text-white border border-white/10 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              RSI (14)
            </button>
            <button
              type="button"
              onClick={() => setActiveIndicatorView("macd")}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
                activeIndicatorView === "macd"
                  ? "bg-[#18243E] text-white border border-white/10 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              MACD
            </button>
            <button
              type="button"
              onClick={() => setActiveIndicatorView("bollinger")}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
                activeIndicatorView === "bollinger"
                  ? "bg-[#18243E] text-white border border-white/10 shadow-sm"
                  : "text-slate-400 hover:text-white"
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
              <span className="text-cyanAccent font-semibold">RSI Line (14)</span>
              <span>Overbought Zone &gt; 70 &bull; Oversold Zone &lt; 30</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="Date"
                  stroke="#475569"
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
                  stroke="#475569"
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  orientation="right"
                  ticks={[30, 50, 70]}
                />
                <ReferenceLine y={70} stroke="#FF385C" strokeDasharray="4 4" label={{ value: "70 Overbought", fill: "#FF385C", fontSize: 10 }} />
                <ReferenceLine y={30} stroke="#00E599" strokeDasharray="4 4" label={{ value: "30 Oversold", fill: "#00E599", fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload
                      return (
                        <div className="p-2.5 rounded-xl bg-[#090E1A] border border-white/10 font-mono text-xs text-slate-200">
                          <div className="text-slate-400 text-[10px]">{d.Date}</div>
                          <div className="font-bold text-cyanAccent tabular-nums">RSI: {d.RSI ? d.RSI.toFixed(2) : "N/A"}</div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line type="monotone" dataKey="RSI" stroke="#00D2FF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* MACD Chart View */}
        {activeIndicatorView === "macd" && (
          <div className="h-72 w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-white">
                  <span className="h-2 w-2 rounded-full bg-cyanAccent"></span> MACD (12, 26)
                </span>
                <span className="flex items-center gap-1 text-violetAccent">
                  <span className="h-2 w-2 rounded-full bg-violetAccent"></span> Signal (9)
                </span>
              </div>
              <span className="text-slate-500">Histogram Momentum Bars</span>
            </div>
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="Date"
                  stroke="#475569"
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  tickFormatter={(val) => {
                    const p = val.split("-")
                    return p.length >= 3 ? `${p[1]}/${p[2]}` : val
                  }}
                  minTickGap={45}
                />
                <YAxis stroke="#475569" fontSize={11} fontFamily="JetBrains Mono, monospace" orientation="right" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload
                      return (
                        <div className="p-2.5 rounded-xl bg-[#090E1A] border border-white/10 font-mono text-xs text-slate-200 space-y-1">
                          <div className="text-slate-400 text-[10px]">{d.Date}</div>
                          <div>MACD: <span className="font-bold text-cyanAccent">{d.MACD?.toFixed(2)}</span></div>
                          <div>Signal: <span className="font-bold text-violetAccent">{d.MACD_Signal?.toFixed(2)}</span></div>
                          <div>Hist: <span className="font-bold text-white">{d.MACD_Hist?.toFixed(2)}</span></div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <ReferenceLine y={0} stroke="#475569" />
                <Bar dataKey="MACD_Hist" fill="#00E599" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bollinger Bands View */}
        {activeIndicatorView === "bollinger" && (
          <div className="h-72 w-full">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-white">
                  <span className="h-2 w-2 rounded-full bg-white"></span> Close Price
                </span>
                <span className="flex items-center gap-1 text-cyanAccent">
                  <span className="h-2 w-2 rounded-full bg-cyanAccent"></span> SMA 20
                </span>
                <span className="flex items-center gap-1 text-violetAccent">
                  <span className="h-2 w-2 rounded-full bg-violetAccent"></span> Bollinger Upper/Lower
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="Date"
                  stroke="#475569"
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  tickFormatter={(val) => {
                    const p = val.split("-")
                    return p.length >= 3 ? `${p[1]}/${p[2]}` : val
                  }}
                  minTickGap={45}
                />
                <YAxis stroke="#475569" fontSize={11} fontFamily="JetBrains Mono, monospace" orientation="right" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload
                      return (
                        <div className="p-2.5 rounded-xl bg-[#090E1A] border border-white/10 font-mono text-xs text-slate-200 space-y-1">
                          <div className="text-slate-400 text-[10px]">{d.Date}</div>
                          <div>Close: <span className="font-bold text-white">${d.Close?.toFixed(2)}</span></div>
                          <div>Upper Band: <span className="font-bold text-violetAccent">${d.BB_Upper?.toFixed(2)}</span></div>
                          <div>Lower Band: <span className="font-bold text-violetAccent">${d.BB_Lower?.toFixed(2)}</span></div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line type="monotone" dataKey="Close" stroke="#ffffff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="SMA_20" stroke="#00D2FF" strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
                <Line type="monotone" dataKey="BB_Upper" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="BB_Lower" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
