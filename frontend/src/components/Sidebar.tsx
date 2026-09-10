import React, { useState, useMemo, useCallback } from "react"
import {
  Search,
  Star,
  Trash2,
  X,
  Bookmark,
  Layers,
  Filter,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { useStockContext } from "../context/StockContext"
import { type StockItem } from "../services/api"

const PAGE_SIZE = 10

interface StockCardProps {
  stock: StockItem
  isSelected: boolean
  inWatchlist: boolean
  onSelect: (symbol: string) => void
  onToggleWatchlist: (symbol: string) => void
}

const StockCard: React.FC<StockCardProps> = React.memo(
  ({ stock, isSelected, inWatchlist, onSelect, onToggleWatchlist }) => {
    return (
      <div
        onClick={() => onSelect(stock.symbol)}
        className={`group relative flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors duration-100 border ${
          isSelected
            ? "bg-blue-50/90 dark:bg-[#131D33] border-blue-500/40 dark:border-bullish/40 text-slate-900 dark:text-white shadow-sm dark:shadow-lg dark:shadow-black/40"
            : "bg-transparent border-transparent hover:bg-slate-100/80 dark:hover:bg-[#0D1424] hover:border-slate-200 dark:hover:border-white/[0.05] text-slate-700 dark:text-slate-300"
        }`}
      >
        {/* Active Indicator Bar */}
        {isSelected && (
          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-600 dark:bg-bullish shadow-[0_0_8px_rgba(37,99,235,0.6)] dark:shadow-[0_0_8px_#00E599]" />
        )}

        <div className="min-w-0 flex-1 pl-1 pr-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-mono font-bold text-xs tracking-tight ${
                isSelected
                  ? "text-blue-600 dark:text-bullish"
                  : "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-bullish"
              }`}
            >
              {stock.symbol}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium tracking-wide uppercase bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.04]">
              {stock.sector}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
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
              ? "text-amber-500 dark:text-amberAccent hover:bg-amber-100/60 dark:hover:bg-amberAccent/10"
              : "text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
          }`}
          title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Star className={`h-3.5 w-3.5 ${inWatchlist ? "fill-amber-500 dark:fill-amberAccent" : ""}`} />
        </button>
      </div>
    )
  }
)
StockCard.displayName = "StockCard"

export const Sidebar: React.FC = () => {
  const {
    stocks,
    sectors,
    selectedSymbol,
    selectStock,
    watchlist,
    toggleWatchlist,
    clearWatchlist,
  } = useStockContext()

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [activeView, setActiveView] = useState<"all" | "watchlist">("all")
  const [selectedSector, setSelectedSector] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleSelect = useCallback(
    (symbol: string) => {
      selectStock(symbol)
    },
    [selectStock]
  )

  const handleToggleWatchlist = useCallback(
    (symbol: string) => {
      toggleWatchlist(symbol)
    },
    [toggleWatchlist]
  )

  const filteredStocks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return stocks.filter((stock) => {
      const inCurrentView = activeView === "all" || watchlist.includes(stock.symbol)
      const matchesSector = selectedSector === "All" || stock.sector === selectedSector
      const matchesSearch =
        query === "" ||
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
      return inCurrentView && matchesSector && matchesSearch
    })
  }, [stocks, activeView, watchlist, selectedSector, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredStocks.length / PAGE_SIZE))

  // Ensure currentPage doesn't exceed totalPages
  const validCurrentPage = Math.min(currentPage, totalPages)

  const paginatedStocks = useMemo(() => {
    const start = (validCurrentPage - 1) * PAGE_SIZE
    return filteredStocks.slice(start, start + PAGE_SIZE)
  }, [filteredStocks, validCurrentPage])

  // Collapsed Sidebar View (Rail)
  if (isCollapsed) {
    return (
      <aside className="w-16 border-r border-slate-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-[#090E1A]/95 flex flex-col items-center py-4 space-y-4 h-[calc(100vh-4rem)] sticky top-16 shrink-0 z-20 transition-[width] duration-200 ease-out will-change-[width]">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#131D33] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#18243E] transition shadow-sm cursor-pointer"
          title="Expand Sidebar"
        >
          <PanelLeftOpen className="h-4 w-4 text-blue-600 dark:text-bullish" />
        </button>

        <div className="w-8 h-px bg-slate-200 dark:bg-white/[0.08]" />

        <button
          type="button"
          onClick={() => {
            setActiveView("all")
            setCurrentPage(1)
            setIsCollapsed(false)
          }}
          className={`p-2.5 rounded-xl transition cursor-pointer relative ${
            activeView === "all"
              ? "bg-blue-50 dark:bg-[#162238] text-blue-600 dark:text-bullish shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0D1424]"
          }`}
          title="All Stocks"
        >
          <Layers className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveView("watchlist")
            setCurrentPage(1)
            setIsCollapsed(false)
          }}
          className={`p-2.5 rounded-xl transition cursor-pointer relative ${
            activeView === "watchlist"
              ? "bg-amber-50 dark:bg-[#162238] text-amber-500 dark:text-amberAccent shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0D1424]"
          }`}
          title={`Watchlist (${watchlist.length})`}
        >
          <Bookmark className="h-4 w-4" />
          {watchlist.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-white text-[9px] font-mono font-bold flex items-center justify-center">
              {watchlist.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0D1424] transition cursor-pointer"
          title="Search Stocks"
        >
          <Search className="h-4 w-4" />
        </button>
      </aside>
    )
  }

  // Expanded Sidebar View
  return (
    <aside className="w-80 border-r border-slate-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-[#090E1A]/95 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shrink-0 z-10 transition-[width] duration-200 ease-out will-change-[width]">
      {/* Top Header with Collapse Button & Tabs */}
      <div className="p-3 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#0C1322]/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-bullish" /> Market Directory
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.06] transition cursor-pointer"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Tabs (Constituents vs Watchlist) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-[#080C14] border border-slate-200/80 dark:border-white/[0.05]">
          <button
            type="button"
            onClick={() => {
              setActiveView("all")
              setCurrentPage(1)
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-100 cursor-pointer ${
              activeView === "all"
                ? "bg-white dark:bg-[#162238] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/10"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>S&P 500</span>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">({stocks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView("watchlist")
              setCurrentPage(1)
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-100 cursor-pointer ${
              activeView === "watchlist"
                ? "bg-white dark:bg-[#162238] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/10"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-500 dark:text-amberAccent" />
            <span>Watchlist</span>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">({watchlist.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-slate-200/80 dark:border-white/[0.06] space-y-2 bg-slate-50/40 dark:bg-[#0A101E]/40">
        {/* Sector Select */}
        <div className="relative">
          <select
            value={selectedSector}
            onChange={(e) => {
              setSelectedSector(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full appearance-none bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 dark:focus:border-bullish/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-bullish/50 transition-colors cursor-pointer pr-8 shadow-sm"
          >
            <option value="All">All Sectors ({sectors.length})</option>
            {sectors.map((sec) => (
              <option key={sec} value={sec} className="bg-white dark:bg-[#0D1424] text-slate-800 dark:text-slate-200">
                {sec}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search symbol or company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-bullish/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-bullish/50 transition-colors font-sans shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setCurrentPage(1)
              }}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Watchlist Clear Button in Watchlist View */}
        {activeView === "watchlist" && watchlist.length > 0 && (
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {watchlist.length} Saved {watchlist.length === 1 ? "Stock" : "Stocks"}
            </span>
            <button
              type="button"
              onClick={clearWatchlist}
              className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-bearish/90 hover:text-rose-700 dark:hover:text-bearish font-medium transition cursor-pointer"
            >
              <Trash2 className="h-3 w-3" /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Stock Ticker Cards List (Paginated, Memoized) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {filteredStocks.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] flex items-center justify-center mx-auto text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-400">No stocks found</p>
            <p className="text-[11px] text-slate-500">
              {activeView === "watchlist"
                ? "Add stocks to your watchlist using the star icon."
                : "Try clearing your search query or sector filter."}
            </p>
          </div>
        ) : (
          paginatedStocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              isSelected={selectedSymbol === stock.symbol}
              inWatchlist={watchlist.includes(stock.symbol)}
              onSelect={handleSelect}
              onToggleWatchlist={handleToggleWatchlist}
            />
          ))
        )}
      </div>

      {/* Pagination Controls at Bottom */}
      {filteredStocks.length > 0 && (
        <div className="p-2.5 border-t border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#0C1322]/60 flex items-center justify-between text-xs">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {Math.min((validCurrentPage - 1) * PAGE_SIZE + 1, filteredStocks.length)}–
            {Math.min(validCurrentPage * PAGE_SIZE, filteredStocks.length)} of {filteredStocks.length}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validCurrentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#131D33] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18243E] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 px-1 font-semibold">
              {validCurrentPage}/{totalPages}
            </span>

            <button
              type="button"
              disabled={validCurrentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#131D33] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18243E] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
