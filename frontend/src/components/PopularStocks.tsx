import React from "react"
import { Flame } from "lucide-react"

interface PopularStocksProps {
  onSelectStock: (symbol: string) => void
  currentSymbol: string | null
}

const POPULAR_LIST = [
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "META", name: "Meta" },
  { symbol: "JPM", name: "JPMorgan" },
  { symbol: "LLY", name: "Eli Lilly" },
]

export const PopularStocks: React.FC<PopularStocksProps> = ({
  onSelectStock,
  currentSymbol,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0 mr-1">
        <Flame className="h-3.5 w-3.5 fill-amber-400" /> Popular:
      </div>
      <div className="flex items-center gap-2">
        {POPULAR_LIST.map((item) => {
          const active = currentSymbol === item.symbol
          return (
            <button
              key={item.symbol}
              type="button"
              onClick={() => onSelectStock(item.symbol)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition shrink-0 flex items-center gap-1.5 ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary/40 border-border/80 text-foreground hover:bg-secondary hover:border-border"
              }`}
            >
              <span>{item.symbol}</span>
              <span className="text-[10px] opacity-70 font-normal">{item.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
