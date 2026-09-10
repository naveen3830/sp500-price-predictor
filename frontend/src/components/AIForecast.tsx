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
import { predictStock, type ForecastResponse } from "../services/api"
import { Cpu, Play, Loader2, Sparkles, AlertCircle } from "lucide-react"

interface AIForecastProps {
  symbol: string
}

export const AIForecast: React.FC<AIForecastProps> = ({ symbol }) => {
  const [forecastDays, setForecastDays] = useState<number>(15)
  const [epochs, setEpochs] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ForecastResponse | null>(null)

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
      ConfidenceRange: [f.lower, f.upper],
    })) || []

  return (
    <div className="space-y-6">
      {/* Control Card */}
      <div className="p-6 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" /> LSTM Neural Network Forecasting
            </h3>
            <p className="text-xs text-muted-foreground">
              Trains a multi-layer Long Short-Term Memory model on historical price sequences
              for {symbol} to predict multi-day future trajectories.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleTrainAndPredict}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-50 transition cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Training Neural Net...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-slate-950" /> Run AI Prediction
              </>
            )}
          </button>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Forecast Horizon</span>
              <span className="text-primary font-bold">{forecastDays} Trading Days</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={forecastDays}
              onChange={(e) => setForecastDays(Number(e.target.value))}
              disabled={loading}
              className="w-full accent-primary bg-secondary rounded-lg h-2"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>5 Days</span>
              <span>15 Days</span>
              <span>30 Days</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Training Epochs</span>
              <span className="text-cyan-400 font-bold">{epochs} Epochs</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="5"
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
              disabled={loading}
              className="w-full accent-cyan-400 bg-secondary rounded-lg h-2"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Fast (5)</span>
              <span>Balanced (10)</span>
              <span>Deep (25)</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="p-12 rounded-2xl bg-card/40 border border-border/70 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <h4 className="text-sm font-bold text-foreground">
            Training LSTM on {symbol} price sequences...
          </h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Extracting 60-day rolling sliding windows, standardizing features with MinMaxScaler,
            and tuning dense output layers with Adam optimizer.
          </p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Evaluation Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-card/40 border border-border/60">
              <span className="text-xs text-muted-foreground">Mean Absolute Error (MAE)</span>
              <p className="text-lg font-black text-foreground mt-1">
                ${result.metrics.mae.toFixed(2)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60">
              <span className="text-xs text-muted-foreground">Root Mean Squared (RMSE)</span>
              <p className="text-lg font-black text-foreground mt-1">
                ${result.metrics.rmse.toFixed(2)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60">
              <span className="text-xs text-muted-foreground">Mean Squared Error (MSE)</span>
              <p className="text-lg font-black text-foreground mt-1">
                {result.metrics.mse.toFixed(2)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60">
              <span className="text-xs text-muted-foreground">Model Fit (R² Score)</span>
              <p className="text-lg font-black text-emerald-400 mt-1">
                {(result.metrics.r2 * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="p-6 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" /> Forward Price Projection
                </h4>
                <p className="text-xs text-muted-foreground">
                  Predicted trajectory with shaded 95% confidence interval bounds
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Predicted Price
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-slate-500/40"></span> 95% Confidence
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastConf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="Date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} domain={["auto", "auto"]} width={55} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                    formatter={(val: any, name: any) => [`$${Number(val).toFixed(2)}`, name]}
                  />
                  <Area type="monotone" dataKey="Upper" stroke="#64748B" strokeDasharray="3 3" fill="none" />
                  <Area type="monotone" dataKey="Lower" stroke="#64748B" strokeDasharray="3 3" fill="#10B981" fillOpacity={0.1} />
                  <Line type="monotone" dataKey="Predicted" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
