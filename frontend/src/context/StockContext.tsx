import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  fetchStocks,
  fetchSectors,
  fetchStockDetail,
  fetchStockHistory,
  fetchStockIndicators,
  type StockItem,
  type StockDetailResponse,
  type HistoryPoint,
  type IndicatorsResponse,
} from "../services/api"

export type TabType = "overview" | "technicals" | "forecast" | "export"

interface StockContextType {
  stocks: StockItem[]
  sectors: string[]
  selectedSymbol: string | null
  detail: StockDetailResponse | null
  loadingDetail: boolean
  activeTab: TabType
  watchlist: string[]
  selectStock: (symbol: string) => void
  toggleWatchlist: (symbol: string) => void
  clearWatchlist: () => void
  setActiveTab: (tab: TabType) => void
  getCachedHistory: (symbol: string, period: string) => Promise<HistoryPoint[]>
  getCachedIndicators: (symbol: string) => Promise<IndicatorsResponse>
}

const StockContext = createContext<StockContextType | undefined>(undefined)

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [sectors, setSectors] = useState<string[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(() => {
    try {
      return localStorage.getItem("sp500_selected_symbol") || "AAPL"
    } catch {
      return "AAPL"
    }
  })
  const [detail, setDetail] = useState<StockDetailResponse | null>(null)
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sp500_watchlist")
      return saved ? JSON.parse(saved) : ["AAPL", "NVDA", "MSFT"]
    } catch {
      return ["AAPL", "NVDA", "MSFT"]
    }
  })

  // In-memory caches to prevent redundant network requests and provide instantaneous UI feedback
  const detailCache = useRef<Map<string, StockDetailResponse>>(new Map())
  const historyCache = useRef<Map<string, HistoryPoint[]>>(new Map())
  const indicatorsCache = useRef<Map<string, IndicatorsResponse>>(new Map())

  // Initial load of stock list and sectors
  useEffect(() => {
    fetchStocks().then(setStocks).catch(console.error)
    fetchSectors().then(setSectors).catch(console.error)
  }, [])

  // Persist watchlist
  useEffect(() => {
    try {
      localStorage.setItem("sp500_watchlist", JSON.stringify(watchlist))
    } catch (e) {
      console.error("Failed to save watchlist", e)
    }
  }, [watchlist])

  // Fetch or serve stock detail with in-memory cache
  useEffect(() => {
    if (!selectedSymbol) {
      setDetail(null)
      return
    }

    try {
      localStorage.setItem("sp500_selected_symbol", selectedSymbol)
    } catch (e) {
      console.error(e)
    }

    // Check cache first
    if (detailCache.current.has(selectedSymbol)) {
      setDetail(detailCache.current.get(selectedSymbol)!)
      setLoadingDetail(false)
      return
    }

    setLoadingDetail(true)
    let isCancelled = false

    fetchStockDetail(selectedSymbol)
      .then((res) => {
        if (!isCancelled) {
          detailCache.current.set(selectedSymbol, res)
          setDetail(res)
          setLoadingDetail(false)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error(err)
          setLoadingDetail(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [selectedSymbol])

  const selectStock = useCallback((symbol: string) => {
    setSelectedSymbol(symbol)
  }, [])

  const toggleWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    )
  }, [])

  const clearWatchlist = useCallback(() => {
    setWatchlist([])
  }, [])

  // Cached history getter
  const getCachedHistory = useCallback(async (symbol: string, period: string): Promise<HistoryPoint[]> => {
    const key = `${symbol}_${period}`
    if (historyCache.current.has(key)) {
      return historyCache.current.get(key)!
    }
    const res = await fetchStockHistory(symbol, period)
    historyCache.current.set(key, res.history)
    return res.history
  }, [])

  // Cached indicators getter
  const getCachedIndicators = useCallback(async (symbol: string): Promise<IndicatorsResponse> => {
    if (indicatorsCache.current.has(symbol)) {
      return indicatorsCache.current.get(symbol)!
    }
    const res = await fetchStockIndicators(symbol)
    indicatorsCache.current.set(symbol, res)
    return res
  }, [])

  const contextValue = useMemo<StockContextType>(
    () => ({
      stocks,
      sectors,
      selectedSymbol,
      detail,
      loadingDetail,
      activeTab,
      watchlist,
      selectStock,
      toggleWatchlist,
      clearWatchlist,
      setActiveTab,
      getCachedHistory,
      getCachedIndicators,
    }),
    [
      stocks,
      sectors,
      selectedSymbol,
      detail,
      loadingDetail,
      activeTab,
      watchlist,
      selectStock,
      toggleWatchlist,
      clearWatchlist,
      setActiveTab,
      getCachedHistory,
      getCachedIndicators,
    ]
  )

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  )
}

export const useStockContext = (): StockContextType => {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error("useStockContext must be used within a StockProvider")
  }
  return context
}
