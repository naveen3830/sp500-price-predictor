import React, { useState, useEffect } from "react"
import { Header } from "./components/Header"
import { Sidebar } from "./components/Sidebar"
import { PopularStocks } from "./components/PopularStocks"
import { KeyMetrics } from "./components/KeyMetrics"
import { PriceChart } from "./components/PriceChart"
import { TechnicalAnalysis } from "./components/TechnicalAnalysis"
import { AIForecast } from "./components/AIForecast"
import { ExportData } from "./components/ExportData"
import {
  fetchStocks,
  fetchSectors,
  fetchStockDetail,
  type StockItem,
  type StockDetailResponse,
} from "./services/api"
import {
  TrendingUp,
  Activity,
  Cpu,
  Download,
  Loader2,
  Sparkles,
  BarChart3,
} from "lucide-react"

export const App: React.FC = () => {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [sectors, setSectors] = useState<string[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(() => {
    return localStorage.getItem("sp500_selected_symbol") || "AAPL"
  })
  const [detail, setDetail] = useState<StockDetailResponse | null>(null)
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"overview" | "technicals" | "forecast" | "export">("overview")

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sp500_watchlist")
      return saved ? JSON.parse(saved) : ["AAPL", "NVDA", "MSFT"]
    } catch {
      return ["AAPL", "NVDA", "MSFT"]
    }
  })

  // Fetch initial stocks and sectors
  useEffect(() => {
    fetchStocks().then(setStocks).catch(console.error)
    fetchSectors().then(setSectors).catch(console.error)
  }, [])

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem("sp500_watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  // Load stock detail when selected
  useEffect(() => {
    if (!selectedSymbol) {
      setDetail(null)
      return
    }

    localStorage.setItem("sp500_selected_symbol", selectedSymbol)
    setLoadingDetail(true)

    fetchStockDetail(selectedSymbol)
      .then((res) => {
        setDetail(res)
        setLoadingDetail(false)
      })
      .catch((err) => {
        console.error(err)
        setLoadingDetail(false)
      })
  }, [selectedSymbol])

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    )
  }

  const handleClearWatchlist = () => {
    setWatchlist([])
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          stocks={stocks}
          sectors={sectors}
          selectedSymbol={selectedSymbol}
          onSelectStock={setSelectedSymbol}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
          onClearWatchlist={handleClearWatchlist}
        />

        {/* Main Workspace */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Market Leaders Chip Bar */}
          <PopularStocks
            onSelectStock={setSelectedSymbol}
            currentSymbol={selectedSymbol}
          />

          {loadingDetail && !detail ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-[#0E1526]/40 rounded-2xl border border-white/[0.06] p-8">
              <Loader2 className="h-8 w-8 animate-spin text-bullish" />
              <div className="text-center space-y-1">
                <span className="text-sm font-mono text-white font-semibold block">
                  Streaming telemetry for {selectedSymbol}...
                </span>
                <span className="text-xs text-slate-500">
                  Retrieving OHLCV quotations, technical indicator signals & metadata
                </span>
              </div>
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* Bento Grid Main Key Metrics */}
              <KeyMetrics
                detail={detail}
                isInWatchlist={watchlist.includes(detail.info.symbol)}
                onToggleWatchlist={handleToggleWatchlist}
              />

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0C1322] border border-white/[0.06] overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                    activeTab === "overview"
                      ? "bg-[#18243E] text-white border border-white/10 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <BarChart3 className="h-4 w-4 text-bullish" />
                  <span>Overview &amp; Action</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("technicals")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                    activeTab === "technicals"
                      ? "bg-[#18243E] text-white border border-white/10 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Activity className="h-4 w-4 text-cyanAccent" />
                  <span>Technical Indicators</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("forecast")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                    activeTab === "forecast"
                      ? "bg-[#18243E] text-white border border-white/10 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Cpu className="h-4 w-4 text-violetAccent" />
                  <span>AI Neural Forecast</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("export")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                    activeTab === "export"
                      ? "bg-[#18243E] text-white border border-white/10 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Download className="h-4 w-4 text-amberAccent" />
                  <span>Data Export</span>
                </button>
              </div>

              {/* Dynamic Tab Panes */}
              <div className="transition-opacity duration-200">
                {activeTab === "overview" && <PriceChart symbol={detail.info.symbol} />}
                {activeTab === "technicals" && <TechnicalAnalysis symbol={detail.info.symbol} />}
                {activeTab === "forecast" && <AIForecast symbol={detail.info.symbol} />}
                {activeTab === "export" && <ExportData symbol={detail.info.symbol} />}
              </div>
            </div>
          ) : (
            /* Welcome / Empty State */
            <div className="p-12 rounded-3xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl text-center max-w-2xl mx-auto my-16 space-y-5 shadow-terminal">
              <div className="h-16 w-16 rounded-2xl bg-bullish-muted border border-bullish-border text-bullish flex items-center justify-center mx-auto shadow-glowEmerald">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  S&P 500 Market Terminal
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Select an index constituent stock from the sidebar or choose from market leaders above to stream real-time price action, algorithmic technical indicators, and deep learning price projections.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSymbol("NVDA")}
                  className="px-5 py-2.5 rounded-xl bg-bullish text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-glowEmerald hover:opacity-90 transition cursor-pointer"
                >
                  <TrendingUp className="h-4 w-4" /> Analyze NVDA
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSymbol("AAPL")}
                  className="px-5 py-2.5 rounded-xl bg-[#141E33] border border-white/10 text-white font-mono font-bold text-xs flex items-center gap-2 hover:bg-[#18243E] transition cursor-pointer"
                >
                  Analyze AAPL
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
