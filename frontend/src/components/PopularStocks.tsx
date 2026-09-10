import React from "react"
import { Sparkles } from "lucide-react"

interface PopularStocksProps {
  onSelectStock: (symbol: string) => void
  currentSymbol: string | null
}

interface PopularStockItem {
  symbol: string
  name: string
  sector: string
}

const POPULAR_LIST: PopularStockItem[] = [
  { symbol: "NVDA", name: "Nvidia", sector: "Tech" },
  { symbol: "AAPL", name: "Apple", sector: "Tech" },
  { symbol: "MSFT", name: "Microsoft", sector: "Tech" },
  { symbol: "AMZN", name: "Amazon", sector: "Consumer" },
  { symbol: "GOOGL", name: "Alphabet", sector: "Comm" },
  { symbol: "META", name: "Meta", sector: "Comm" },
  { symbol: "TSLA", name: "Tesla", sector: "Consumer" },
  { symbol: "JPM", name: "JPMorgan", sector: "Finance" },
  { symbol: "LLY", name: "Eli Lilly", sector: "Health" },
  { symbol: "XOM", name: "ExxonMobil", sector: "Energy" },
]

export const PopularStocks: React.FC<PopularStocksProps> = ({
  onSelectStock,
  currentSymbol,
}) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase shrink-0">
        <Sparkles className="h-3.5 w-3.5 text-bullish animate-pulse" />
        <span>Market Leaders:</span>
      </div>

      <div className="flex items-center gap-2">
        {POPULAR_LIST.map((item) => {
          const isActive = currentSymbol === item.symbol

          return (
            <button
              key={item.symbol}
              type="button"
              onClick={() => onSelectStock(item.symbol)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 shrink-0 border ${
                isActive
                  ? "bg-[#111C33] border-bullish/60 text-white shadow-glowEmerald"
                  : "bg-[#0E1526]/80 border-white/[0.06] text-slate-300 hover:border-white/20 hover:bg-[#131E35]"
              }`}
            >
              <span
                className={`font-mono font-bold tracking-tight text-[12px] ${
                  isActive ? "text-bullish" : "text-white group-hover:text-bullish"
                }`}
              >
                {item.symbol}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {item.name}
              </span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-bullish shadow-[0_0_6px_#00E599]"></span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
