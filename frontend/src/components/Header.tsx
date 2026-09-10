import React, { useEffect, useState } from "react"
import { Activity, AlertCircle, Sun, Moon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking")
  const [latency, setLatency] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " UTC"
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const checkLatency = async () => {
      const start = performance.now()
      try {
        const res = await fetch("/api/stocks/sectors")
        const end = performance.now()
        if (res.ok) {
          setBackendStatus("online")
          setLatency(Math.round(end - start))
        } else {
          setBackendStatus("offline")
          setLatency(null)
        }
      } catch {
        setBackendStatus("offline")
        setLatency(null)
      }
    }

    checkLatency()
    const interval = setInterval(checkLatency, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-slate-200/80 dark:border-white/[0.06] bg-white/85 dark:bg-[#090E1A]/85 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Market Intelligence Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 dark:from-bullish dark:to-cyanAccent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative h-10 w-10 rounded-xl bg-white dark:bg-[#0C1220] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-md dark:shadow-lg">
              <span className="font-mono font-black text-base tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-500 to-emerald-500 dark:from-bullish dark:via-cyanAccent dark:to-white">
                500
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                S&P 500 <span className="font-light text-slate-500 dark:text-slate-400">Predictor</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 dark:bg-bullish/10 text-blue-600 dark:text-bullish border border-blue-500/20 dark:border-bullish/25">
                Terminal v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Institutional Market Analytics &bull; Deep Learning Neural Projections
            </p>
          </div>
        </div>

        {/* Live Market Bar, Telemetry & Theme Switcher */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 text-xs">
          {/* Market Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-[#0F172A]/70 border border-slate-200/80 dark:border-white/[0.06] text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-bullish opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-bullish"></span>
            </span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold tracking-wide">MARKET FEED</span>
            <span className="text-slate-400 dark:text-slate-500 font-mono">|</span>
            <span className="text-slate-600 dark:text-slate-400 font-mono tabular-nums">{currentTime}</span>
          </div>

          {/* Backend Status with Telemetry */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#0E1526]/80 shadow-sm">
            {backendStatus === "checking" && (
              <>
                <Activity className="h-3.5 w-3.5 text-amber-500 dark:text-amberAccent animate-pulse" />
                <span className="text-amber-600 dark:text-amberAccent font-mono font-medium text-[11px]">Connecting...</span>
              </>
            )}
            {backendStatus === "online" && (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-bullish shadow-[0_0_8px_rgba(16,185,129,0.8)] dark:shadow-[0_0_8px_rgba(0,229,153,0.8)]"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-700 dark:text-slate-200 font-medium text-[11px]">API Online</span>
                  {latency !== null && (
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[0.05] px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-white/[0.05]">
                      {latency}ms
                    </span>
                  )}
                </div>
              </>
            )}
            {backendStatus === "offline" && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-rose-500 dark:text-bearish" />
                <span className="text-rose-600 dark:text-bearish font-mono font-medium text-[11px]">Offline</span>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0E1526] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#141D32] transition-all shadow-sm cursor-pointer flex items-center justify-center"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-200 hover:rotate-12" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
