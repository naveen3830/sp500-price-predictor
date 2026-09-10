import React from "react"
import { Download, FileText, Code2, Sparkles, Table } from "lucide-react"
import { getExportUrl } from "../services/api"

interface ExportDataProps {
  symbol: string
}

export const ExportData: React.FC<ExportDataProps> = ({ symbol }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md space-y-1">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" /> Data Export Center
        </h3>
        <p className="text-xs text-muted-foreground">
          Download real-time datasets for {symbol} in clean comma-separated values (CSV)
          or JavaScript Object Notation (JSON) format.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Historical OHLCV */}
        <div className="p-5 rounded-2xl bg-card/40 border border-border/70 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Historical OHLCV Data</h4>
            <p className="text-xs text-muted-foreground">
              Open, High, Low, Close, and Volume time-series records from 2015 to present.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
            <a
              href={getExportUrl(symbol, "history", "csv")}
              download={`${symbol}_historical.csv`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </a>
            <a
              href={getExportUrl(symbol, "history", "json")}
              download={`${symbol}_historical.json`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition"
            >
              <Code2 className="h-3.5 w-3.5" /> JSON
            </a>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="p-5 rounded-2xl bg-card/40 border border-border/70 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Table className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Technical Indicators</h4>
            <p className="text-xs text-muted-foreground">
              Calculated SMA, EMA, RSI, MACD, Bollinger Bands, ATR, OBV, and Stochastic values.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
            <a
              href={getExportUrl(symbol, "indicators", "csv")}
              download={`${symbol}_indicators.csv`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </a>
            <a
              href={getExportUrl(symbol, "indicators", "json")}
              download={`${symbol}_indicators.json`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition"
            >
              <Code2 className="h-3.5 w-3.5" /> JSON
            </a>
          </div>
        </div>

        {/* Summary Snapshot */}
        <div className="p-5 rounded-2xl bg-card/40 border border-border/70 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Summary Snapshot</h4>
            <p className="text-xs text-muted-foreground">
              Current price snapshot, 52W ranges, average volume, and multi-period return metrics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
            <a
              href={getExportUrl(symbol, "summary", "csv")}
              download={`${symbol}_summary.csv`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </a>
            <a
              href={getExportUrl(symbol, "summary", "json")}
              download={`${symbol}_summary.json`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition"
            >
              <Code2 className="h-3.5 w-3.5" /> JSON
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
