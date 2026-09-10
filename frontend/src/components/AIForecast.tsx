import React, { useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { useTheme } from "../context/ThemeContext"
import { predictStock, type ForecastResponse } from "../services/api"
import { Cpu, Play, Loader2 } from "lucide-react"

interface AIForecastProps {
  symbol: string
}

export const AIForecast: React.FC<AIForecastProps> = ({ symbol }) => {
  const { theme } = useTheme()
  const [forecastDays, setForecastDays] = useState<number>(15)
  const [epochs, setEpochs] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ForecastResponse | null>(null)

  const isDark = theme === "dark"

  const handleTrainAndPredict = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await predictStock(symbol, forecastDays, epochs)
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Model training failed")
    } finally {
      setLoading(false)
    }
  }

  const chartData =
    result?.forecast.map((f) => ({
      Date: f.date,
      Predicted: f.predicted,
      Upper: f.upper,
      Lower: f.lower,
    })) || []

  const minVal = chartData.length > 0 ? Math.min(...chartData.map((d) => d.Lower)) * 0.98 : 0
  const maxVal = chartData.length > 0 ? Math.max(...chartData.map((d) => d.Upper)) * 1.02 : 100

  return (
    <div className="space-y-5">
      {/* AI Laboratory Cockpit Header */}
      <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal relative overflow-hidden transition-colors duration-200">
        {/* Glow */}
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-indigo-400 dark:bg-violetAccent opacity-15 blur-3xl pointer-events-none"></div>

        <div className="relative space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-violetAccent-muted border border-indigo-200 dark:border-violetAccent-border flex items-center justify-center text-indigo-600 dark:text-violetAccent">
                  <Cpu className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Price Forecasting (LSTM)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  LSTM Model
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trains a Long Short-Term Memory neural network on historical price sequences for {symbol} to generate multi-day forward projections with 95% confidence intervals.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleTrainAndPredict}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 border border-slate-900 dark:border-white/20 font-semibold text-xs shadow-sm disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Training Model...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" /> Execute Forecast
                </>
              )}
            </button>
          </div>

          {/* Hyperparameter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80 dark:border-white/[0.06]">
            {/* Horizon Slider */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-[#080C14] border border-slate-200/80 dark:border-white/[0.05]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">Forecast Horizon</span>
                <span className="font-mono font-bold text-blue-600 dark:text-bullish">{forecastDays} Trading Days</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={forecastDays}
                onChange={(e) => setForecastDays(Number(e.target.value))}
                disabled={loading}
                className="w-full accent-blue-600 dark:accent-[#00E599] bg-slate-200 dark:bg-[#131D33] rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>5 Days</span>
                <span>15 Days</span>
                <span>30 Days</span>
              </div>
            </div>

            {/* Epochs Slider */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-[#080C14] border border-slate-200/80 dark:border-white/[0.05]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">Training Iterations (Epochs)</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-cyanAccent">{epochs} Epochs</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
                disabled={loading}
                className="w-full accent-indigo-600 dark:accent-[#00D2FF] bg-slate-200 dark:bg-[#131D33] rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>5 (Fast)</span>
                <span>15 (Balanced)</span>
                <span>30 (Deep)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-bearish-muted border border-rose-200 dark:border-bearish-border text-rose-700 dark:text-bearish text-xs font-mono">
          Model training error: {error}
        </div>
      )}

      {/* Model Diagnostic Metrics (HUD) */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Mean Absolute Error (MAE)
              </span>
              <div className="font-mono text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                ${result.metrics.mae.toFixed(2)}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Average absolute dollar deviation</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Root Mean Squared Error (RMSE)
              </span>
              <div className="font-mono text-2xl font-black text-indigo-600 dark:text-cyanAccent mt-1 tabular-nums">
                ${result.metrics.rmse.toFixed(2)}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Outlier-penalized test loss</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                R² Fit Coefficient
              </span>
              <div className="font-mono text-2xl font-black text-emerald-600 dark:text-bullish mt-1 tabular-nums">
                {(result.metrics.r2 * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Variance explained by sequence</p>
            </div>
          </div>

          {/* Forward Trajectory Forecast Chart */}
          <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl space-y-4 shadow-cardLight dark:shadow-terminal">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Projected Price Corridor ({forecastDays} Trading Days)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Illuminated trajectory with 95% statistical confidence corridor
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                Target: {symbol}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="corridorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={isDark ? 0.25 : 0.18} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
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
                  />
                  <YAxis
                    domain={[minVal, maxVal]}
                    stroke={isDark ? "#475569" : "#94A3B8"}
                    fontSize={11}
                    fontFamily="JetBrains Mono, monospace"
                    orientation="right"
                    tickFormatter={(v) => `$${v.toFixed(0)}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload
                        return (
                          <div className="p-3 rounded-xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1 shadow-md">
                            <div className="text-slate-500 dark:text-slate-400 text-[10px]">{d.Date}</div>
                            <div className="text-emerald-600 dark:text-bullish font-bold">Predicted: ${d.Predicted.toFixed(2)}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">Upper (95%): ${d.Upper.toFixed(2)}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">Lower (95%): ${d.Lower.toFixed(2)}</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area type="monotone" dataKey="Upper" stroke="#8B5CF6" strokeWidth={1} strokeDasharray="3 3" fill="url(#corridorGradient)" />
                  <Line type="monotone" dataKey="Lower" stroke="#8B5CF6" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                  <Line type="monotone" dataKey="Predicted" stroke={isDark ? "#00E599" : "#059669"} strokeWidth={2.5} dot={{ r: 3, fill: isDark ? "#00E599" : "#059669" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
