import React from "react"
import { Star, TrendingUp, TrendingDown, DollarSign, BarChart2, Calendar } from "lucide-react"
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

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xl shadow-black/20">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center font-bold text-xl text-emerald-400 shrink-0">
            {info.symbol}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                {info.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border/80">
                {info.sector}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Latest: {priceInfo.latest_date}
              </span>
              <span>•</span>
              <span>S&P 500 Index Constituent</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="text-right">
            <div className="text-3xl font-black tracking-tight text-foreground">
              ${priceInfo.current_price.toFixed(2)}
            </div>
            <div
              className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>
                {isPositive ? "+" : ""}
                {priceInfo.change.toFixed(2)} ({isPositive ? "+" : ""}
                {priceInfo.change_pct.toFixed(2)}%)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleWatchlist(info.symbol)}
            className={`p-3 rounded-xl border transition flex items-center justify-center ${
              isInWatchlist
                ? "bg-amber-400/10 border-amber-400/40 text-amber-400"
                : "bg-secondary/40 border-border hover:bg-secondary text-muted-foreground hover:text-amber-400"
            }`}
            title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star className={`h-5 w-5 ${isInWatchlist ? "fill-amber-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> 52-Week High
          </span>
          <p className="text-lg font-bold text-foreground mt-1">
            ${priceInfo.high_52w.toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-rose-400" /> 52-Week Low
          </span>
          <p className="text-lg font-bold text-foreground mt-1">
            ${priceInfo.low_52w.toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5 text-cyan-400" /> Avg Daily Volume
          </span>
          <p className="text-lg font-bold text-foreground mt-1">
            {(priceInfo.avg_volume / 1e6).toFixed(2)}M
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5 text-violet-400" /> Today's Volume
          </span>
          <p className="text-lg font-bold text-foreground mt-1">
            {(priceInfo.volume / 1e6).toFixed(2)}M
          </p>
        </div>
      </div>

      {/* Trailing Returns */}
      {Object.keys(returns).length > 0 && (
        <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/60 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-2">
            Trailing Returns:
          </span>
          <div className="flex items-center gap-3">
            {Object.entries(returns).map(([period, ret]) => {
              const pos = ret >= 0
              return (
                <div
                  key={period}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${
                    pos
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}
                >
                  <span className="text-muted-foreground font-normal">{period}:</span>
                  <span>
                    {pos ? "+" : ""}
                    {ret.toFixed(2)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
