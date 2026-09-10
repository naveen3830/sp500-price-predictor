import React from "react"
import { Download, FileSpreadsheet, FileCode, Table, Sparkles, Database } from "lucide-react"
import { getExportUrl } from "../services/api"

interface ExportDataProps {
  symbol: string
}

export const ExportData: React.FC<ExportDataProps> = ({ symbol }) => {
  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-cyanAccent-muted border border-cyanAccent-border flex items-center justify-center text-cyanAccent">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Quantitative Data Export Hub
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Export historical price series, computed technical indicators, and fundamental metrics for {symbol} in CSV or JSON formats.
          </p>
        </div>

        <span className="font-mono text-xs px-3 py-1 rounded-lg bg-[#080C14] border border-white/[0.08] text-slate-300">
          Selected: {symbol}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Historical OHLCV Card */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-bullish-muted border border-bullish-border flex items-center justify-center text-bullish">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Historical OHLCV Series</h4>
            <p className="text-xs text-slate-400">
              Clean daily Open, High, Low, Close, and Volume time-series records from 2015 to current market session.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
            <a
              href={getExportUrl(symbol, "history", "csv")}
              download={`${symbol}_historical.csv`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#141E33] hover:bg-bullish hover:text-slate-950 text-white text-xs font-mono font-bold transition duration-150 border border-white/10"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </a>
            <a
              href={getExportUrl(symbol, "history", "json")}
              download={`${symbol}_historical.json`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#141E33] hover:bg-bullish hover:text-slate-950 text-white text-xs font-mono font-bold transition duration-150 border border-white/10"
            >
              <FileCode className="h-3.5 w-3.5" /> JSON
            </a>
          </div>
        </div>

        {/* Technical Indicators Card */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-cyanAccent-muted border border-cyanAccent-border flex items-center justify-center text-cyanAccent">
              <Table className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Technical Indicator Matrix</h4>
            <p className="text-xs text-slate-400">
              Complete computed matrices including SMA, EMA, RSI, MACD, Bollinger Bands, ATR, OBV, and Stochastics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
            <a
              href={getExportUrl(symbol, "indicators", "csv")}
              download={`${symbol}_indicators.csv`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#141E33] hover:bg-cyanAccent hover:text-slate-950 text-white text-xs font-mono font-bold transition duration-150 border border-white/10"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </a>
            <a
              href={getExportUrl(symbol, "indicators", "json")}
              download={`${symbol}_indicators.json`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#141E33] hover:bg-cyanAccent hover:text-slate-950 text-white text-xs font-mono font-bold transition duration-150 border border-white/10"
            >
              <FileCode className="h-3.5 w-3.5" /> JSON
            </a>
          </div>
        </div>

        {/* Summary Snapshot Card */}
        <div className="p-5 rounded-2xl bg-[#0E1526]/80 border border-white/[0.08] backdrop-blur-xl shadow-terminal flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-violetAccent-muted border border-violetAccent-border flex items-center justify-center text-violetAccent">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Executive Metrics Snapshot</h4>
            <p className="text-xs text-slate-400">
              Snapshot containing latest quotation, 52W extremes, multi-period trailing returns, and signal summaries.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
            <a
              href={getExportUrl(symbol, "summary", "csv")}
              download={`${symbol}_summary.csv`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#141E33] hover:bg-violetAccent hover:text-slate-950 text-white text-xs font-mono font-bold transition duration-150 border border-white/10"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </a>
            <a
              href={getExportUrl(symbol, "summary", "json")}
              download={`${symbol}_summary.json`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#141E33] hover:bg-violetAccent hover:text-slate-950 text-white text-xs font-mono font-bold transition duration-150 border border-white/10"
            >
              <FileCode className="h-3.5 w-3.5" /> JSON
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
