import React, { useState, useMemo } from "react"
import { Search, Star, Trash2, X, Bookmark, Layers, Filter } from "lucide-react"
import type { StockItem } from "../services/api"

interface SidebarProps {
  stocks: StockItem[]
  sectors: string[]
  selectedSymbol: string | null
  onSelectStock: (symbol: string) => void
  watchlist: string[]
  onToggleWatchlist: (symbol: string) => void
  onClearWatchlist: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  stocks,
  sectors,
  selectedSymbol,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
  onClearWatchlist,
}) => {
  const [activeView, setActiveView] = useState<"all" | "watchlist">("all")
  const [selectedSector, setSelectedSector] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const inCurrentView = activeView === "all" || watchlist.includes(stock.symbol)
      const matchesSector = selectedSector === "All" || stock.sector === selectedSector
      const matchesSearch =
        searchQuery === "" ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      return inCurrentView && matchesSector && matchesSearch
    })
  }, [stocks, activeView, watchlist, selectedSector, searchQuery])

  return (
    <aside className="w-80 border-r border-white/[0.06] bg-[#090E1A]/60 backdrop-blur-xl flex flex-col h-[calc(100vh-4rem)] sticky top-16 shrink-0 z-10">
      {/* Navigation Tabs (Constituents vs Watchlist) */}
      <div className="p-3 border-b border-white/[0.06] bg-[#0C1322]/60">
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#080C14] border border-white/[0.05]">
          <button
            type="button"
            onClick={() => setActiveView("all")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeView === "all"
                ? "bg-[#162238] text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-bullish" />
            <span>S&P 500</span>
            <span className="font-mono text-[10px] text-slate-400">({stocks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("watchlist")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeView === "watchlist"
                ? "bg-[#162238] text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-amberAccent" />
            <span>Watchlist</span>
            <span className="font-mono text-[10px] text-slate-400">({watchlist.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-white/[0.06] space-y-2.5 bg-[#0A101E]/40">
        {/* Sector Select */}
        <div className="relative">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full appearance-none bg-[#0D1424] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-bullish/50 focus:ring-1 focus:ring-bullish/50 transition cursor-pointer pr-8"
          >
            <option value="All">All Sectors ({sectors.length})</option>
            {sectors.map((sec) => (
              <option key={sec} value={sec} className="bg-[#0D1424] text-slate-200">
                {sec}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search ticker or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D1424] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-bullish/50 focus:ring-1 focus:ring-bullish/50 transition font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Watchlist Clear Button in Watchlist View */}
        {activeView === "watchlist" && watchlist.length > 0 && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-slate-400">
              {watchlist.length} Saved {watchlist.length === 1 ? "Stock" : "Stocks"}
            </span>
            <button
              type="button"
              onClick={onClearWatchlist}
              className="flex items-center gap-1 text-[11px] text-bearish/90 hover:text-bearish font-medium transition cursor-pointer"
            >
              <Trash2 className="h-3 w-3" /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Stock Ticker Cards List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {filteredStocks.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <div className="h-10 w-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mx-auto text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-slate-400">No stocks found</p>
            <p className="text-[11px] text-slate-500">
              {activeView === "watchlist"
                ? "Add stocks to your watchlist using the star icon."
                : "Try clearing your search query or sector filter."}
            </p>
          </div>
        ) : (
          filteredStocks.map((stock) => {
            const isSelected = selectedSymbol === stock.symbol
            const inWatchlist = watchlist.includes(stock.symbol)

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol)}
                className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 border ${
                  isSelected
                    ? "bg-[#131D33] border-bullish/40 text-white shadow-lg shadow-black/40"
                    : "bg-transparent border-transparent hover:bg-[#0D1424] hover:border-white/[0.05] text-slate-300"
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-bullish shadow-[0_0_8px_#00E599]"></div>
                )}

                <div className="min-w-0 flex-1 pl-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold text-xs tracking-tight ${
                        isSelected ? "text-bullish" : "text-white group-hover:text-bullish"
                      }`}
                    >
                      {stock.symbol}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-medium tracking-wide uppercase bg-white/[0.04] text-slate-400 border border-white/[0.04]">
                      {stock.sector}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                    {stock.name}
                  </p>
                </div>

                {/* Watchlist Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleWatchlist(stock.symbol)
                  }}
                  className={`p-1.5 rounded-lg transition shrink-0 ${
                    inWatchlist
                      ? "text-amberAccent hover:bg-amberAccent/10"
                      : "text-slate-600 hover:text-slate-300 hover:bg-white/[0.05]"
                  }`}
                  title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  <Star className={`h-3.5 w-3.5 ${inWatchlist ? "fill-amberAccent" : ""}`} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
