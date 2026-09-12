import os
import time
import pickle
import logging
from datetime import date
from typing import List, Dict, Optional, Any
import pandas as pd
import numpy as np
import yfinance as yf

logger = logging.getLogger(__name__)

stockDatabase: Dict[str, Dict[str, str]] = {
    # Technology
    "AAPL": {"name": "Apple Inc.", "sector": "Technology"},
    "MSFT": {"name": "Microsoft Corporation", "sector": "Technology"},
    "GOOGL": {"name": "Alphabet Inc. Class A", "sector": "Technology"},
    "GOOG": {"name": "Alphabet Inc. Class C", "sector": "Technology"},
    "AMZN": {"name": "Amazon.com Inc.", "sector": "Technology"},
    "META": {"name": "Meta Platforms Inc.", "sector": "Technology"},
    "NVDA": {"name": "NVIDIA Corporation", "sector": "Technology"},
    "TSLA": {"name": "Tesla Inc.", "sector": "Technology"},
    "AMD": {"name": "Advanced Micro Devices", "sector": "Technology"},
    "INTC": {"name": "Intel Corporation", "sector": "Technology"},
    "ADBE": {"name": "Adobe Inc.", "sector": "Technology"},
    "CRM": {"name": "Salesforce Inc.", "sector": "Technology"},
    "CSCO": {"name": "Cisco Systems Inc.", "sector": "Technology"},
    "AVGO": {"name": "Broadcom Inc.", "sector": "Technology"},
    "TXN": {"name": "Texas Instruments", "sector": "Technology"},
    "ORCL": {"name": "Oracle Corporation", "sector": "Technology"},
    "QCOM": {"name": "Qualcomm Inc.", "sector": "Technology"},
    "IBM": {"name": "IBM Corporation", "sector": "Technology"},
    "NOW": {"name": "ServiceNow Inc.", "sector": "Technology"},
    "ACN": {"name": "Accenture plc", "sector": "Technology"},
    "PANW": {"name": "Palo Alto Networks", "sector": "Technology"},
    "AMAT": {"name": "Applied Materials Inc.", "sector": "Technology"},
    "INTU": {"name": "Intuit Inc.", "sector": "Technology"},
    "MU": {"name": "Micron Technology Inc.", "sector": "Technology"},
    
    # Finance
    "JPM": {"name": "JPMorgan Chase & Co.", "sector": "Finance"},
    "BAC": {"name": "Bank of America Corp.", "sector": "Finance"},
    "WFC": {"name": "Wells Fargo & Company", "sector": "Finance"},
    "GS": {"name": "Goldman Sachs Group Inc.", "sector": "Finance"},
    "MS": {"name": "Morgan Stanley", "sector": "Finance"},
    "C": {"name": "Citigroup Inc.", "sector": "Finance"},
    "SCHW": {"name": "Charles Schwab Corp.", "sector": "Finance"},
    "BLK": {"name": "BlackRock Inc.", "sector": "Finance"},
    "V": {"name": "Visa Inc.", "sector": "Finance"},
    "MA": {"name": "Mastercard Inc.", "sector": "Finance"},
    "AXP": {"name": "American Express Co.", "sector": "Finance"},
    "BRK.B": {"name": "Berkshire Hathaway Inc.", "sector": "Finance"},
    "SPGI": {"name": "S&P Global Inc.", "sector": "Finance"},
    "CB": {"name": "Chubb Limited", "sector": "Finance"},
    "MMC": {"name": "Marsh & McLennan Companies", "sector": "Finance"},
    "PGR": {"name": "Progressive Corporation", "sector": "Finance"},
    
    # Healthcare
    "JNJ": {"name": "Johnson & Johnson", "sector": "Healthcare"},
    "UNH": {"name": "UnitedHealth Group Inc.", "sector": "Healthcare"},
    "PFE": {"name": "Pfizer Inc.", "sector": "Healthcare"},
    "ABBV": {"name": "AbbVie Inc.", "sector": "Healthcare"},
    "MRK": {"name": "Merck & Co. Inc.", "sector": "Healthcare"},
    "TMO": {"name": "Thermo Fisher Scientific", "sector": "Healthcare"},
    "ABT": {"name": "Abbott Laboratories", "sector": "Healthcare"},
    "LLY": {"name": "Eli Lilly and Company", "sector": "Healthcare"},
    "BMY": {"name": "Bristol-Myers Squibb", "sector": "Healthcare"},
    "AMGN": {"name": "Amgen Inc.", "sector": "Healthcare"},
    "ISRG": {"name": "Intuitive Surgical Inc.", "sector": "Healthcare"},
    "MDT": {"name": "Medtronic plc", "sector": "Healthcare"},
    "DHR": {"name": "Danaher Corporation", "sector": "Healthcare"},
    "CVS": {"name": "CVS Health Corporation", "sector": "Healthcare"},
    "GILD": {"name": "Gilead Sciences Inc.", "sector": "Healthcare"},
    
    # Consumer
    "WMT": {"name": "Walmart Inc.", "sector": "Consumer"},
    "PG": {"name": "Procter & Gamble Co.", "sector": "Consumer"},
    "KO": {"name": "Coca-Cola Company", "sector": "Consumer"},
    "PEP": {"name": "PepsiCo Inc.", "sector": "Consumer"},
    "COST": {"name": "Costco Wholesale Corp.", "sector": "Consumer"},
    "HD": {"name": "Home Depot Inc.", "sector": "Consumer"},
    "NKE": {"name": "Nike Inc.", "sector": "Consumer"},
    "MCD": {"name": "McDonald's Corporation", "sector": "Consumer"},
    "SBUX": {"name": "Starbucks Corporation", "sector": "Consumer"},
    "DIS": {"name": "Walt Disney Company", "sector": "Consumer"},
    "CMCSA": {"name": "Comcast Corporation", "sector": "Consumer"},
    "TGT": {"name": "Target Corporation", "sector": "Consumer"},
    "LOW": {"name": "Lowe's Companies Inc.", "sector": "Consumer"},
    "TJX": {"name": "TJX Companies Inc.", "sector": "Consumer"},
    "MDLZ": {"name": "Mondelez International", "sector": "Consumer"},
    "BKNG": {"name": "Booking Holdings Inc.", "sector": "Consumer"},
    
    # Energy
    "XOM": {"name": "Exxon Mobil Corporation", "sector": "Energy"},
    "CVX": {"name": "Chevron Corporation", "sector": "Energy"},
    "COP": {"name": "ConocoPhillips", "sector": "Energy"},
    "SLB": {"name": "Schlumberger Limited", "sector": "Energy"},
    "EOG": {"name": "EOG Resources Inc.", "sector": "Energy"},
    "MPC": {"name": "Marathon Petroleum Corp.", "sector": "Energy"},
    "VLO": {"name": "Valero Energy Corp.", "sector": "Energy"},
    "PSX": {"name": "Phillips 66", "sector": "Energy"},
    "OXY": {"name": "Occidental Petroleum", "sector": "Energy"},
    "HAL": {"name": "Halliburton Company", "sector": "Energy"},
    
    # Industrial
    "BA": {"name": "Boeing Company", "sector": "Industrial"},
    "HON": {"name": "Honeywell International", "sector": "Industrial"},
    "UPS": {"name": "United Parcel Service", "sector": "Industrial"},
    "CAT": {"name": "Caterpillar Inc.", "sector": "Industrial"},
    "GE": {"name": "General Electric Co.", "sector": "Industrial"},
    "MMM": {"name": "3M Company", "sector": "Industrial"},
    "LMT": {"name": "Lockheed Martin Corp.", "sector": "Industrial"},
    "RTX": {"name": "Raytheon Technologies", "sector": "Industrial"},
    "DE": {"name": "Deere & Company", "sector": "Industrial"},
    "UNP": {"name": "Union Pacific Corporation", "sector": "Industrial"},
    "ETN": {"name": "Eaton Corporation", "sector": "Industrial"},
    "WM": {"name": "Waste Management Inc.", "sector": "Industrial"},
    
    # Telecom
    "VZ": {"name": "Verizon Communications", "sector": "Telecom"},
    "T": {"name": "AT&T Inc.", "sector": "Telecom"},
    "TMUS": {"name": "T-Mobile US Inc.", "sector": "Telecom"},
    "NFLX": {"name": "Netflix Inc.", "sector": "Telecom"},
    "WBD": {"name": "Warner Bros. Discovery", "sector": "Telecom"},
    
    # Real Estate
    "AMT": {"name": "American Tower Corp.", "sector": "Real Estate"},
    "PLD": {"name": "Prologis Inc.", "sector": "Real Estate"},
    "CCI": {"name": "Crown Castle Inc.", "sector": "Real Estate"},
    "SPG": {"name": "Simon Property Group", "sector": "Real Estate"},
    "EQIX": {"name": "Equinix Inc.", "sector": "Real Estate"},
    "PSA": {"name": "Public Storage", "sector": "Real Estate"},
    "O": {"name": "Realty Income Corporation", "sector": "Real Estate"},
    
    # Utilities
    "NEE": {"name": "NextEra Energy Inc.", "sector": "Utilities"},
    "DUK": {"name": "Duke Energy Corp.", "sector": "Utilities"},
    "SO": {"name": "Southern Company", "sector": "Utilities"},
    "AEP": {"name": "American Electric Power", "sector": "Utilities"},
    "SRE": {"name": "Sempra", "sector": "Utilities"},
    "EXC": {"name": "Exelon Corporation", "sector": "Utilities"},
    "XEL": {"name": "Xcel Energy Inc.", "sector": "Utilities"},
    
    # Materials
    "LIN": {"name": "Linde plc", "sector": "Materials"},
    "APD": {"name": "Air Products & Chemicals", "sector": "Materials"},
    "SHW": {"name": "Sherwin-Williams Co.", "sector": "Materials"},
    "ECL": {"name": "Ecolab Inc.", "sector": "Materials"},
    "FCX": {"name": "Freeport-McMoRan Inc.", "sector": "Materials"},
    "NEM": {"name": "Newmont Corporation", "sector": "Materials"},
    "CTVA": {"name": "Corteva Inc.", "sector": "Materials"},
}

cacheStore: Dict[str, Dict[str, Any]] = {}
cacheTtlSeconds = 86400
cacheDirectory = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "cache")
os.makedirs(cacheDirectory, exist_ok=True)


def validateSymbol(symbol: str) -> bool:
    if not symbol or not isinstance(symbol, str):
        return False
    cleaned = symbol.replace(".", "").replace("-", "")
    return cleaned.isalnum() and len(symbol) <= 10


def getAllSectors() -> List[str]:
    return sorted(list(set(item["sector"] for item in stockDatabase.values())))


def getStocks(sector: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, str]]:
    results = []
    searchLower = search.lower().strip() if search else None
    
    for symbol, info in sorted(stockDatabase.items()):
        if sector and sector != "All" and info["sector"] != sector:
            continue
        if searchLower:
            if searchLower not in symbol.lower() and searchLower not in info["name"].lower():
                continue
        results.append({
            "symbol": symbol,
            "name": info["name"],
            "sector": info["sector"]
        })
    return results


def getStockInfo(symbol: str) -> Optional[Dict[str, str]]:
    sym = symbol.upper().strip()
    info = stockDatabase.get(sym)
    if info:
        return {"symbol": sym, "name": info["name"], "sector": info["sector"]}
    return None


def loadStockData(symbol: str, startDate: str = "2015-01-01", endDate: Optional[str] = None) -> pd.DataFrame:
    sym = symbol.upper().strip()
    if not validateSymbol(sym):
        logger.error(f"Invalid symbol: {sym}")
        return pd.DataFrame()

    if endDate is None:
        endDate = date.today().strftime("%Y-%m-%d")

    cleanStartDate = startDate.replace("-", "")
    cleanEndDate = endDate.replace("-", "")
    cacheKey = f"{sym}{cleanStartDate}{cleanEndDate}"
    currentTime = time.time()
    
    # 1. Check in-memory store
    if cacheKey in cacheStore:
        entry = cacheStore[cacheKey]
        if currentTime - entry["timestamp"] < cacheTtlSeconds:
            return entry["data"].copy()

    # 2. Check on-disk cache
    diskFilePath = os.path.join(cacheDirectory, f"{cacheKey}.pkl")
    if os.path.exists(diskFilePath):
        try:
            fileModTime = os.path.getmtime(diskFilePath)
            if currentTime - fileModTime < cacheTtlSeconds:
                with open(diskFilePath, "rb") as fileHandle:
                    cachedFrame = pickle.load(fileHandle)
                cacheStore[cacheKey] = {"data": cachedFrame, "timestamp": currentTime}
                return cachedFrame.copy()
        except Exception as readError:
            logger.warning(f"Failed to read disk cache for {sym}: {readError}")

    # 3. Download fresh data
    try:
        logger.info(f"Downloading stock data for {sym} from {startDate} to {endDate}")
        data = yf.download(sym, start=startDate, end=endDate, progress=False)

        if data.empty:
            logger.warning(f"No data returned for {sym}")
            return pd.DataFrame()

        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)

        data.columns.name = None
        data.index.name = "Date"
        data.reset_index(inplace=True)

        data["Date"] = pd.to_datetime(data["Date"])
        data = data.ffill().bfill()

        # Update in-memory cache
        cacheStore[cacheKey] = {"data": data, "timestamp": currentTime}

        # Update disk cache
        try:
            with open(diskFilePath, "wb") as fileHandle:
                pickle.dump(data, fileHandle)
        except Exception as writeError:
            logger.warning(f"Failed to write disk cache for {sym}: {writeError}")

        return data.copy()

    except Exception as errorDetails:
        logger.error(f"Error downloading stock data for {sym}: {errorDetails}")
        return pd.DataFrame()


def getCurrentPriceInfo(data: pd.DataFrame) -> Optional[Dict[str, Any]]:
    if data is None or data.empty or len(data) < 2:
        return None

    try:
        df = data.copy()
        currentPrice = float(df['Close'].iloc[-1])
        prevPrice = float(df['Close'].iloc[-2])
        priceChange = currentPrice - prevPrice
        changePct = (priceChange / prevPrice) * 100 if prevPrice != 0 else 0.0

        oneYearData = df.tail(252)
        high52w = float(oneYearData['High'].max())
        low52w = float(oneYearData['Low'].min())
        avgVolume = float(oneYearData['Volume'].mean())

        return {
            'current_price': round(currentPrice, 2),
            'prev_close': round(prevPrice, 2),
            'change': round(priceChange, 2),
            'change_pct': round(changePct, 2),
            'high_52w': round(high52w, 2),
            'low_52w': round(low52w, 2),
            'avg_volume': round(avgVolume, 0),
            'open': round(float(df['Open'].iloc[-1]), 2),
            'high': round(float(df['High'].iloc[-1]), 2),
            'low': round(float(df['Low'].iloc[-1]), 2),
            'volume': round(float(df['Volume'].iloc[-1]), 0),
            'latest_date': df['Date'].iloc[-1].strftime("%Y-%m-%d")
        }
    except Exception as errorDetails:
        logger.error(f"Error calculating price info: {errorDetails}")
        return None


def calculateReturns(data: pd.DataFrame, periods: Optional[List[int]] = None) -> Dict[str, float]:
    if data is None or data.empty:
        return {}

    if periods is None:
        periods = [5, 20, 60, 252]

    periodNames = {
        5: '1W',
        20: '1M',
        60: '3M',
        252: '1Y'
    }

    try:
        df = data.copy()
        currentPrice = float(df['Close'].iloc[-1])
        calculatedReturns = {}

        for periodValue in periods:
            if len(df) > periodValue:
                pastPrice = float(df['Close'].iloc[-(periodValue + 1)])
                if pastPrice > 0:
                    periodReturn = ((currentPrice - pastPrice) / pastPrice) * 100
                    periodName = periodNames.get(periodValue, f'{periodValue}D')
                    calculatedReturns[periodName] = round(periodReturn, 2)
        return calculatedReturns
    except Exception as errorDetails:
        logger.error(f"Error calculating returns: {errorDetails}")
        return {}
