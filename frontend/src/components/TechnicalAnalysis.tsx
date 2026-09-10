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
import { Loader2, Zap, Compass, Activity, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface TechnicalAnalysisProps {
  symbol: string
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ symbol }) => {
  const [data, setData] = useState<IndicatorsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
      <div className="h-80 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-card/40 rounded-2xl border border-border/70 p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs">Computing technical indicators for {symbol}...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-destructive bg-card/40 rounded-2xl border border-border/70">
        {error || "No indicator data available"}
      </div>
    )
  }

  const { summary, data: records } = data

  const getSignalBadge = (sig?: string) => {
    if (!sig) return null
    if (sig === "Bullish" || sig === "Oversold") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ArrowUpRight className="h-3 w-3" /> {sig}
        </span>
      )
    }
    if (sig === "Bearish" || sig === "Overbought") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <ArrowDownRight className="h-3 w-3" /> {sig}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border/80">
        <Minus className="h-3 w-3" /> {sig}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Signals Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-primary" /> Trend
          </span>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Moving Avg</span>
            {getSignalBadge(summary.trend)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-cyan-400" /> RSI (14)
          </span>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">
              {summary.rsi?.value.toFixed(1) || "50.0"}
            </span>
            {getSignalBadge(summary.rsi?.signal)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-violet-400" /> MACD Signal
          </span>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">
              {summary.macd?.macd.toFixed(2) || "0.00"}
            </span>
            {getSignalBadge(summary.macd?.signal)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-amber-400" /> Bollinger Bands
          </span>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Volatility</span>
            {getSignalBadge(summary.bollinger?.signal)}
          </div>
        </div>
      </div>

      {/* Moving Averages & Bollinger Bands Chart */}
      <div className="p-5 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Moving Averages & Bollinger Bands
            </h4>
            <p className="text-xs text-muted-foreground">
              Close price with SMA (20, 50) and Bollinger Envelope
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Close
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span> SMA 20
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span> SMA 50
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="Date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} minTickGap={40} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} domain={["auto", "auto"]} width={55} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="Close" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SMA_20" stroke="#06B6D4" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="SMA_50" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="BB_Upper" stroke="#64748B" strokeWidth={1} dot={false} strokeDasharray="2 2" />
              <Line type="monotone" dataKey="BB_Lower" stroke="#64748B" strokeWidth={1} dot={false} strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RSI Chart */}
      <div className="p-5 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-foreground">Relative Strength Index (RSI 14)</h4>
          <span className="text-xs text-muted-foreground">
            Oversold: &lt;30 | Overbought: &gt;70
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="Date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} minTickGap={40} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} width={35} />
              <ReferenceLine y={70} stroke="#F43F5E" strokeDasharray="3 3" />
              <ReferenceLine y={30} stroke="#10B981" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="RSI" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MACD Histogram */}
      <div className="p-5 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-foreground">MACD & Signal Line</h4>
          <span className="text-xs text-muted-foreground">Fast 12, Slow 26, Signal 9</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="Date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} minTickGap={40} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} width={35} />
              <ReferenceLine y={0} stroke="#475569" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="MACD_Histogram" fill="#06B6D4" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
