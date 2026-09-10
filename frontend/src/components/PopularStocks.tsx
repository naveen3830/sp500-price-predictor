import React from "react"
import { Sparkles } from "lucide-react"
import { useStockContext } from "../context/StockContext"

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

export const PopularStocks: React.FC = () => {
  const { selectStock, selectedSymbol } = useStockContext()

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase shrink-0">
        <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-bullish animate-pulse" />
        <span>Market Leaders:</span>
      </div>

      <div className="flex items-center gap-2">
        {POPULAR_LIST.map((item) => {
          const isActive = selectedSymbol === item.symbol

          return (
            <button
              key={item.symbol}
              type="button"
              onClick={() => selectStock(item.symbol)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 shrink-0 border cursor-pointer ${
                isActive
                  ? "bg-blue-50/90 dark:bg-[#111C33] border-blue-500/70 dark:border-bullish/60 text-blue-900 dark:text-white shadow-sm dark:shadow-glowEmerald"
                  : "bg-white/90 dark:bg-[#0E1526]/80 border-slate-200/80 dark:border-white/[0.06] text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#131E35]"
              }`}
            >
              <span
                className={`font-mono font-bold tracking-tight text-[12px] ${
                  isActive
                    ? "text-blue-600 dark:text-bullish"
                    : "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-bullish"
                }`}
              >
                {item.symbol}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                {item.name}
              </span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-bullish shadow-[0_0_6px_rgba(37,99,235,0.8)] dark:shadow-[0_0_6px_#00E599]"></span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
