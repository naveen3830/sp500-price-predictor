import React, { useState } from "react"
import { Search, Star, Trash2, ChevronRight, Layers } from "lucide-react"
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
  const [selectedSector, setSelectedSector] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredStocks = stocks.filter((stock) => {
    const matchesSector = selectedSector === "All" || stock.sector === selectedSector
    const matchesSearch =
      searchQuery === "" ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSector && matchesSearch
  })

  return (
    <aside className="w-80 border-r border-border/60 bg-card/20 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shrink-0">
      {/* Search & Sector Filter */}
      <div className="p-4 border-b border-border/50 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Sector Filter
          </label>
          <span className="text-[11px] text-muted-foreground font-mono">
            {filteredStocks.length} Stocks
          </span>
        </div>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full bg-secondary/50 border border-border/80 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
        >
          <option value="All">All Sectors</option>
          {sectors.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search S&P 500 symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border/80 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          />
        </div>
      </div>

      {/* Stock Selection List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          S&P 500 Constituents
        </div>
        {filteredStocks.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No stocks match criteria
          </div>
        ) : (
          filteredStocks.map((stock) => {
            const isSelected = selectedSymbol === stock.symbol
            const inWatchlist = watchlist.includes(stock.symbol)

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol)}
                className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition border text-sm ${
                  isSelected
                    ? "bg-primary/10 border-primary/40 text-foreground font-medium shadow-sm"
                    : "border-transparent hover:bg-secondary/40 hover:border-border/50 text-foreground/90"
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground group-hover:text-primary transition">
                      {stock.symbol}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/40 truncate max-w-[90px]">
                      {stock.sector}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleWatchlist(stock.symbol)
                    }}
                    className={`p-1.5 rounded-md transition ${
                      inWatchlist
                        ? "text-amber-400 hover:bg-amber-400/10"
                        : "text-muted-foreground/40 hover:text-amber-400 hover:bg-secondary/60"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${inWatchlist ? "fill-amber-400" : ""}`} />
                  </button>
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition ${
                      isSelected ? "text-primary" : ""
                    }`}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Watchlist Footer / Drawer */}
      <div className="border-t border-border/60 p-4 bg-card/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>Watchlist ({watchlist.length})</span>
          </div>
          {watchlist.length > 0 && (
            <button
              type="button"
              onClick={onClearWatchlist}
              title="Clear all watchlist items"
              className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        {watchlist.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">
            Click the star on any stock to pin it here for one-click access.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {watchlist.map((sym) => {
              const isSelected = selectedSymbol === sym
              return (
                <div
                  key={sym}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                    isSelected
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-secondary/60 border-border hover:bg-secondary hover:border-primary/50 text-foreground"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectStock(sym)}
                    className="hover:underline"
                  >
                    {sym}
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWatchlist(sym)}
                    className="text-muted-foreground hover:text-destructive ml-0.5"
                    title={`Remove ${sym}`}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
