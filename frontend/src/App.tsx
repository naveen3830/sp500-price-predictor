import React from "react"
import { ThemeProvider } from "./context/ThemeContext"
import { StockProvider, useStockContext } from "./context/StockContext"
import { Header } from "./components/Header"
import { Sidebar } from "./components/Sidebar"
import { KeyMetrics } from "./components/KeyMetrics"
import { PriceChart } from "./components/PriceChart"
import { TechnicalAnalysis } from "./components/TechnicalAnalysis"
import { AIForecast } from "./components/AIForecast"
import { ExportData } from "./components/ExportData"
import {
  TrendingUp,
  Activity,
  Cpu,
  Download,
  Loader2,
  Sparkles,
  BarChart3,
} from "lucide-react"

const MainContent: React.FC = () => {
  const {
    selectedSymbol,
    detail,
    loadingDetail,
    activeTab,
    setActiveTab,
    selectStock,
  } = useStockContext()

  return (
    <div className="min-h-screen bg-[#F0F4FA] dark:bg-[#080C14] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Workspace */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 space-y-5 overflow-y-auto">
          {/* Top Navigation Tabs (Placed above/at the top) */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-[#0C1322] border border-slate-200/80 dark:border-white/[0.06] overflow-x-auto shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                activeTab === "overview"
                  ? "bg-slate-100 dark:bg-[#18243E] text-blue-600 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-bullish" />
              <span>Overview &amp; Action</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("technicals")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                activeTab === "technicals"
                  ? "bg-slate-100 dark:bg-[#18243E] text-blue-600 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Activity className="h-4 w-4 text-blue-600 dark:text-cyanAccent" />
              <span>Technical Indicators</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("forecast")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                activeTab === "forecast"
                  ? "bg-slate-100 dark:bg-[#18243E] text-indigo-600 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Cpu className="h-4 w-4 text-indigo-600 dark:text-violetAccent" />
              <span>Forecasting</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("export")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                activeTab === "export"
                  ? "bg-slate-100 dark:bg-[#18243E] text-amber-600 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Download className="h-4 w-4 text-amber-500 dark:text-amberAccent" />
              <span>Data Export</span>
            </button>
          </div>

          {loadingDetail && !detail ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white/90 dark:bg-[#0E1526]/40 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] p-8 shadow-cardLight dark:shadow-terminal">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-bullish" />
              <div className="text-center space-y-1">
                <span className="text-sm font-mono text-slate-900 dark:text-white font-semibold block">
                  Streaming telemetry for {selectedSymbol}...
                </span>
                <span className="text-xs text-slate-500">
                  Retrieving OHLCV quotations, technical indicator signals & metadata
                </span>
              </div>
            </div>
          ) : detail ? (
            <div className="space-y-5">
              {/* Bento Grid Main Key Metrics */}
              <KeyMetrics />

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
            <div className="p-12 rounded-3xl bg-white/90 dark:bg-[#0E1526]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl text-center max-w-2xl mx-auto my-16 space-y-5 shadow-cardLight dark:shadow-terminal">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-bullish-muted border border-blue-200 dark:border-bullish-border text-blue-600 dark:text-bullish flex items-center justify-center mx-auto shadow-sm dark:shadow-glowEmerald">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  S&P 500 Market Terminal
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Select an index constituent stock from the sidebar to stream real-time price action, algorithmic technical indicators, and price forecasting.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => selectStock("NVDA")}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 dark:bg-bullish text-white dark:text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-sm dark:shadow-glowEmerald hover:opacity-90 transition cursor-pointer"
                >
                  <TrendingUp className="h-4 w-4" /> Analyze NVDA
                </button>
                <button
                  type="button"
                  onClick={() => selectStock("AAPL")}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#141E33] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-mono font-bold text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#18243E] transition cursor-pointer shadow-sm"
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

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <StockProvider>
        <MainContent />
      </StockProvider>
    </ThemeProvider>
  )
}

export default App
