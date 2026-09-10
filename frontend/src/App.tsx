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
  LineChart as ChartIcon,
  Activity,
  Cpu,
  Download,
  Loader2,
  Sparkles,
  TrendingUp,
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Popular Shortcuts */}
          <PopularStocks
            onSelectStock={setSelectedSymbol}
            currentSymbol={selectedSymbol}
          />

          {loadingDetail && !detail ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm">Fetching S&P 500 market data for {selectedSymbol}...</span>
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* Key Metrics Banner */}
              <KeyMetrics
                detail={detail}
                isInWatchlist={watchlist.includes(detail.info.symbol)}
                onToggleWatchlist={handleToggleWatchlist}
              />

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-border/70 pb-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "overview"
                      ? "bg-primary text-primary-foreground shadow-sm shadow-emerald-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <ChartIcon className="h-4 w-4" /> Overview & Charts
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("technicals")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "technicals"
                      ? "bg-primary text-primary-foreground shadow-sm shadow-emerald-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Activity className="h-4 w-4" /> Technical Analysis
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("forecast")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "forecast"
                      ? "bg-primary text-primary-foreground shadow-sm shadow-emerald-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Cpu className="h-4 w-4" /> AI Neural Forecast
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("export")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "export"
                      ? "bg-primary text-primary-foreground shadow-sm shadow-emerald-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Download className="h-4 w-4" /> Export Data
                </button>
              </div>

              {/* Tab Views */}
              {activeTab === "overview" && <PriceChart symbol={detail.info.symbol} />}
              {activeTab === "technicals" && <TechnicalAnalysis symbol={detail.info.symbol} />}
              {activeTab === "forecast" && <AIForecast symbol={detail.info.symbol} />}
              {activeTab === "export" && <ExportData symbol={detail.info.symbol} />}
            </div>
          ) : (
            /* Welcome Empty State */
            <div className="p-12 rounded-3xl bg-card/40 border border-border/70 backdrop-blur-md text-center max-w-2xl mx-auto my-12 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-foreground">
                Welcome to S&P 500 Price Predictor
              </h2>
              <p className="text-sm text-muted-foreground">
                Select an S&P 500 stock from the sidebar or popular tickers above to explore
                historical OHLCV price charts, real-time technical indicators, and run AI-powered
                LSTM price forecasts.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSymbol("NVDA")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <TrendingUp className="h-4 w-4" /> Analyze NVDA
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSymbol("AAPL")}
                  className="px-4 py-2 rounded-xl bg-secondary text-foreground font-bold text-xs flex items-center gap-1.5"
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
