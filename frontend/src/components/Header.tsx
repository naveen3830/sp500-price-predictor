import React, { useEffect, useState } from "react"
import { TrendingUp, Activity, CheckCircle2, AlertCircle } from "lucide-react"

export const Header: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    fetch("/api/stocks/sectors")
      .then((res) => {
        if (res.ok) setBackendStatus("online")
        else setBackendStatus("offline")
      })
      .catch(() => setBackendStatus("offline"))
  }, [])

  return (
    <header className="border-b border-border/60 bg-card/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                S&P 500 Price Predictor
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.0
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Institutional-grade market analytics, technical indicators & AI neural forecasting
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/30">
            <Activity className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
            <span className="text-muted-foreground">FastAPI Backend:</span>
            {backendStatus === "checking" && (
              <span className="text-amber-400 font-medium">Connecting...</span>
            )}
            {backendStatus === "online" && (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Online
              </span>
            )}
            {backendStatus === "offline" && (
              <span className="text-red-400 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Offline (port 8000)
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
