export interface StockItem {
  symbol: string
  name: string
  sector: string
}

export interface PriceSummary {
  current_price: number
  prev_close: number
  change: number
  change_pct: number
  high_52w: number
  low_52w: number
  avg_volume: number
  open: number
  high: number
  low: number
  volume: number
  latest_date: string
}

export interface StockDetailResponse {
  info: StockItem
  price_info: PriceSummary | null
  returns: Record<string, number>
}

export interface HistoryPoint {
  Date: string
  Open: number
  High: number
  Low: number
  Close: number
  Volume: number
}

export interface HistoryResponse {
  symbol: string
  count: number
  history: HistoryPoint[]
}

export interface IndicatorSummary {
  rsi?: { value: number; signal: string }
  macd?: { macd: number; signal_line: number; histogram: number; signal: string }
  bollinger?: { upper: number; middle: number; lower: number; signal: string }
  trend?: string
  sma_20?: number
  sma_50?: number
}

export interface IndicatorsResponse {
  symbol: string
  summary: IndicatorSummary
  data: Array<{
    Date: string
    Close: number
    SMA_20?: number | null
    SMA_50?: number | null
    EMA_12?: number | null
    EMA_26?: number | null
    RSI?: number | null
    MACD?: number | null
    MACD_Signal?: number | null
    MACD_Histogram?: number | null
    MACD_Hist?: number | null
    BB_Upper?: number | null
    BB_Middle?: number | null
    BB_Lower?: number | null
  }>
}

export interface ForecastPoint {
  date: string
  predicted: number
  lower: number
  upper: number
}

export interface ForecastResponse {
  symbol: string
  metrics: {
    mae: number
    mse: number
    rmse: number
    r2: number
  }
  forecast: ForecastPoint[]
}

const API_BASE = "/api"

function cleanSymbol(symbol: string): string {
  return encodeURIComponent(symbol.trim().toUpperCase().replace(/[^A-Z0-9.-]/g, ""))
}

function cleanParam(param: string): string {
  return encodeURIComponent(param.trim())
}

export async function fetchStocks(sector?: string, search?: string): Promise<StockItem[]> {
  const params = new URLSearchParams()
  if (sector && sector !== "All") params.append("sector", sector)
  if (search) params.append("search", search)
  const res = await fetch(`${API_BASE}/stocks?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch stocks")
  return res.json()
}

export async function fetchSectors(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/stocks/sectors`)
  if (!res.ok) throw new Error("Failed to fetch sectors")
  return res.json()
}

export async function fetchStockDetail(symbol: string): Promise<StockDetailResponse> {
  const safeSymbol = cleanSymbol(symbol)
  const res = await fetch(`${API_BASE}/stocks/${safeSymbol}`)
  if (!res.ok) throw new Error(`Failed to load details for ${symbol}`)
  return res.json()
}

export async function fetchStockHistory(symbol: string, period = "1y"): Promise<HistoryResponse> {
  const safeSymbol = cleanSymbol(symbol)
  const safePeriod = cleanParam(period)
  const res = await fetch(`${API_BASE}/stocks/${safeSymbol}/history?period=${safePeriod}`)
  if (!res.ok) throw new Error(`Failed to load history for ${symbol}`)
  return res.json()
}

export async function fetchStockIndicators(symbol: string): Promise<IndicatorsResponse> {
  const safeSymbol = cleanSymbol(symbol)
  const res = await fetch(`${API_BASE}/stocks/${safeSymbol}/indicators`)
  if (!res.ok) throw new Error(`Failed to load indicators for ${symbol}`)
  return res.json()
}

export async function predictStock(symbol: string, forecastDays = 15, epochs = 10): Promise<ForecastResponse> {
  const safeSymbol = cleanSymbol(symbol)
  const res = await fetch(`${API_BASE}/stocks/${safeSymbol}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      forecast_days: forecastDays,
      epochs: epochs,
      prediction_days: 60,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Forecasting failed")
  }
  return res.json()
}

export function getExportUrl(symbol: string, exportType: "history" | "indicators" | "summary", fileFormat: "csv" | "json"): string {
  const safeSymbol = cleanSymbol(symbol)
  const safeType = cleanParam(exportType)
  const safeFormat = cleanParam(fileFormat)
  return `${API_BASE}/stocks/${safeSymbol}/export?export_type=${safeType}&file_format=${safeFormat}`
}
