import React, { useMemo } from "react"
import { Star, TrendingUp, TrendingDown, Calendar, BarChart3, Activity, Layers } from "lucide-react"
import { useStockContext } from "../context/StockContext"

export const KeyMetrics: React.FC = () => {
  const { detail, watchlist, toggleWatchlist } = useStockContext()

  if (!detail || !detail.price_info) return null

  const { info, price_info: priceInfo, returns } = detail
  const isInWatchlist = watchlist.includes(info.symbol)
  const isPositive = priceInfo.change >= 0

  // Calculate 52-Week Range Percentage Position
  const rangeSpan = priceInfo.high_52w - priceInfo.low_52w
  const rangePct = useMemo(() => {
    return rangeSpan > 0
      ? Math.max(0, Math.min(100, ((priceInfo.current_price - priceInfo.low_52w) / rangeSpan) * 100))
      : 50
  }, [priceInfo.current_price, priceInfo.low_52w, rangeSpan])

  // Volume Comparison
  const volumeRatio =
    priceInfo.avg_volume > 0 ? (priceInfo.volume / priceInfo.avg_volume) * 100 : 100
  const isHighVolume = volumeRatio >= 100

  return (
    <div className="space-y-4">
      {/* Bento Grid Main Header */}
      <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal relative overflow-hidden transition-colors duration-200">
        {/* Subtle Ambient Glow */}
        <div
          className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-20 ${
            isPositive ? "bg-emerald-400 dark:bg-bullish" : "bg-rose-400 dark:bg-bearish"
          }`}
        ></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Company Information */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#131D33] dark:to-[#18243E] border border-blue-100 dark:border-white/10 flex items-center justify-center font-mono font-black text-2xl text-blue-700 dark:text-white shrink-0 shadow-sm dark:shadow-lg dark:shadow-black/40">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-700 via-indigo-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400">
                {info.symbol}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {info.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-100 dark:bg-[#18243E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  {info.sector}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> Latest Session:{" "}
                  <span className="font-mono text-slate-700 dark:text-slate-300">{priceInfo.latest_date}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-cyanAccent" /> S&P 500 Constituent
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Price & Actions */}
          <div className="flex items-center justify-between md:justify-end gap-5">
            <div className="text-left md:text-right">
              <div className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                ${priceInfo.current_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <div className="flex items-center md:justify-end gap-1.5 mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border tabular-nums ${
                    isPositive
                      ? "bg-emerald-50 dark:bg-bullish-muted text-emerald-700 dark:text-bullish border-emerald-200 dark:border-bullish-border shadow-sm dark:shadow-[0_0_12px_rgba(0,229,153,0.15)]"
                      : "bg-rose-50 dark:bg-bearish-muted text-rose-700 dark:text-bearish border-rose-200 dark:border-bearish-border shadow-sm dark:shadow-[0_0_12px_rgba(255,56,92,0.15)]"
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
              onClick={() => toggleWatchlist(info.symbol)}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm ${
                isInWatchlist
                  ? "bg-amber-50 dark:bg-amberAccent-muted border-amber-300 dark:border-amberAccent-border text-amber-500 dark:text-amberAccent shadow-amber-500/10"
                  : "bg-white dark:bg-[#131D33] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-400 hover:text-amber-500"
              }`}
              title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Star className={`h-5 w-5 ${isInWatchlist ? "fill-amber-500 dark:fill-amberAccent text-amber-500 dark:text-amberAccent" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 52-Week Range Visual Slider Bar */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal flex flex-col justify-between space-y-3 transition-colors duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Activity className="h-3.5 w-3.5 text-blue-600 dark:text-cyanAccent" /> 52-Week Price Range
            </span>
            <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-300">
              {rangePct.toFixed(0)}% of Range
            </span>
          </div>

          {/* Visual Range Track with Indicator */}
          <div className="space-y-2 py-1">
            <div className="relative h-2.5 w-full bg-slate-100 dark:bg-[#131D33] rounded-full overflow-visible border border-slate-200/80 dark:border-white/[0.06]">
              {/* Range gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 dark:from-bearish dark:via-amberAccent dark:to-bullish opacity-80"></div>
              {/* Current Price Pin Marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-white border-2 border-slate-800 dark:border-[#0E1526] shadow-md dark:shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ left: `${rangePct}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              <div>
                <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">52W Low</span>
                <span className="text-slate-900 dark:text-white font-semibold">${priceInfo.low_52w.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">52W High</span>
                <span className="text-slate-900 dark:text-white font-semibold">${priceInfo.high_52w.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Volume & Activity Gauge */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal flex flex-col justify-between space-y-3 transition-colors duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-600 dark:text-violetAccent" /> Trading Volume
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                isHighVolume
                  ? "bg-emerald-50 dark:bg-bullish-muted text-emerald-700 dark:text-bullish border border-emerald-200 dark:border-bullish-border"
                  : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400"
              }`}
            >
              {volumeRatio.toFixed(0)}% of 30D Avg
            </span>
          </div>

          <div className="space-y-2 py-1">
            {/* Progress Fill */}
            <div className="h-2.5 w-full bg-slate-100 dark:bg-[#131D33] rounded-full overflow-hidden border border-slate-200/80 dark:border-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isHighVolume
                    ? "bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-cyanAccent dark:to-bullish"
                    : "bg-gradient-to-r from-slate-400 to-blue-500 dark:from-slate-600 dark:to-cyanAccent"
                }`}
                style={{ width: `${Math.min(100, volumeRatio)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              <div>
                <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Latest Volume</span>
                <span className="text-slate-900 dark:text-white font-semibold">{(priceInfo.volume / 1e6).toFixed(2)}M</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">30D Avg Volume</span>
                <span className="text-slate-700 dark:text-slate-300">{(priceInfo.avg_volume / 1e6).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Period Performance Heatmap */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-cardLight dark:shadow-terminal flex flex-col justify-between space-y-3 transition-colors duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Trailing Performance
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Historical Returns</span>
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
                      ? "bg-emerald-50 dark:bg-bullish-muted border-emerald-200 dark:border-bullish-border text-emerald-700 dark:text-bullish"
                      : "bg-rose-50 dark:bg-bearish-muted border-rose-200 dark:border-bearish-border text-rose-700 dark:text-bearish"
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">{period}</span>
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
