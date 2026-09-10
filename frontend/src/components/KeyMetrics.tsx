import React from "react"
import { Star, TrendingUp, TrendingDown, Calendar, BarChart3, Activity, Layers } from "lucide-react"
import type { StockDetailResponse } from "../services/api"

interface KeyMetricsProps {
  detail: StockDetailResponse
  isInWatchlist: boolean
  onToggleWatchlist: (symbol: string) => void
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({
  detail,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const { info, price_info: priceInfo, returns } = detail

  if (!priceInfo) return null

  const isPositive = priceInfo.change >= 0

  // Calculate 52-Week Range Percentage Position
  const rangeSpan = priceInfo.high_52w - priceInfo.low_52w
  const rangePct =
    rangeSpan > 0
      ? Math.max(0, Math.min(100, ((priceInfo.current_price - priceInfo.low_52w) / rangeSpan) * 100))
      : 50

  // Volume Comparison
  const volumeRatio =
    priceInfo.avg_volume > 0 ? (priceInfo.volume / priceInfo.avg_volume) * 100 : 100
  const isHighVolume = volumeRatio >= 100

  return (
    <div className="space-y-4">
      {/* Bento Grid Main Header */}
      <div className="p-6 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div
          className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isPositive ? "bg-bullish" : "bg-bearish"
          }`}
        ></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Company Information */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#131D33] border border-white/10 flex items-center justify-center font-mono font-black text-2xl text-white shrink-0 shadow-lg shadow-black/40">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400">
                {info.symbol}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {info.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#18243E] text-slate-300 border border-white/10">
                  {info.sector}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" /> Latest Session:{" "}
                  <span className="font-mono text-slate-300">{priceInfo.latest_date}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Layers className="h-3.5 w-3.5 text-cyanAccent" /> S&P 500 Index Constituent
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Price & Actions */}
          <div className="flex items-center justify-between md:justify-end gap-5">
            <div className="text-left md:text-right">
              <div className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white tabular-nums">
                ${priceInfo.current_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <div className="flex items-center md:justify-end gap-1.5 mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border tabular-nums ${
                    isPositive
                      ? "bg-bullish-muted text-bullish border-bullish-border shadow-[0_0_12px_rgba(0,229,153,0.15)]"
                      : "bg-bearish-muted text-bearish border-bearish-border shadow-[0_0_12px_rgba(255,56,92,0.15)]"
                  }`}
                >
                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>
                    {isPositive ? "+" : ""}
                    {priceInfo.change.toFixed(2)} ({isPositive ? "+" : ""}
                    {priceInfo.change_pct.toFixed(2)}%)
                  </span>
                </span>
              </div>
            </div>

            {/* Watchlist Star Toggle */}
            <button
              type="button"
              onClick={() => onToggleWatchlist(info.symbol)}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isInWatchlist
                  ? "bg-amberAccent-muted border-amberAccent-border text-amberAccent shadow-[0_0_16px_rgba(255,176,32,0.2)]"
                  : "bg-[#131D33] border-white/10 hover:border-white/20 text-slate-400 hover:text-amberAccent"
              }`}
              title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Star className={`h-5 w-5 ${isInWatchlist ? "fill-amberAccent" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 52-Week Range Visual Slider Bar */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Activity className="h-3.5 w-3.5 text-cyanAccent" /> 52-Week Price Range
            </span>
            <span className="font-mono font-bold text-xs text-slate-300">
              {rangePct.toFixed(0)}% of Range
            </span>
          </div>

          {/* Visual Range Track with Indicator */}
          <div className="space-y-2 py-1">
            <div className="relative h-2.5 w-full bg-[#131D33] rounded-full overflow-visible border border-white/[0.06]">
              {/* Range gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-bearish via-amberAccent to-bullish opacity-70"></div>
              {/* Current Price Pin Marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-white border-2 border-[#0E1526] shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ left: `${rangePct}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-400">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">52W Low</span>
                <span className="text-white font-semibold">${priceInfo.low_52w.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 block">52W High</span>
                <span className="text-white font-semibold">${priceInfo.high_52w.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Volume & Activity Gauge */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <BarChart3 className="h-3.5 w-3.5 text-violetAccent" /> Trading Volume
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                isHighVolume
                  ? "bg-bullish-muted text-bullish border border-bullish-border"
                  : "bg-white/[0.04] text-slate-400"
              }`}
            >
              {volumeRatio.toFixed(0)}% of 30D Avg
            </span>
          </div>

          <div className="space-y-2 py-1">
            {/* Progress Fill */}
            <div className="h-2.5 w-full bg-[#131D33] rounded-full overflow-hidden border border-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isHighVolume
                    ? "bg-gradient-to-r from-cyanAccent to-bullish"
                    : "bg-gradient-to-r from-slate-600 to-cyanAccent"
                }`}
                style={{ width: `${Math.min(100, volumeRatio)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-400">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Latest Volume</span>
                <span className="text-white font-semibold">{(priceInfo.volume / 1e6).toFixed(2)}M</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 block">30D Avg Volume</span>
                <span className="text-slate-300">{(priceInfo.avg_volume / 1e6).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Period Performance Heatmap */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Trailing Performance
            </span>
            <span className="text-[10px] font-mono text-slate-500">Historical Returns</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {["1W", "1M", "3M", "1Y"].map((period) => {
              const ret = returns[period] ?? 0
              const pos = ret >= 0

              return (
                <div
                  key={period}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    pos
                      ? "bg-bullish-muted border-bullish-border text-bullish"
                      : "bg-bearish-muted border-bearish-border text-bearish"
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 block">{period}</span>
                  <span className="text-xs font-mono font-bold tracking-tight block mt-0.5 tabular-nums">
                    {pos ? "+" : ""}
                    {ret.toFixed(1)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
