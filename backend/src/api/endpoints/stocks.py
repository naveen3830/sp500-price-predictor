import io
import json
from typing import List, Optional, Dict, Any
from datetime import date
from fastapi import APIRouter, HTTPException, Query, Response
import pandas as pd

from src.services.stockData import (
    getStocks, getAllSectors, getStockInfo,
    loadStockData, getCurrentPriceInfo, calculateReturns
)
from src.services.indicators import calculateAllIndicators, getIndicatorSummary
from src.models.lstm import trainAndForecast
from src.schemas.stock import StockItem, StockDetailResponse, ForecastResponse, PredictionRequest

router = APIRouter(prefix="/stocks", tags=["stocks"])


# List S&P 500 stocks with optional sector filter and search
@router.get("", response_model=List[StockItem])
def listStocks(
    sector: Optional[str] = Query(None, description="Filter by sector"),
    search: Optional[str] = Query(None, description="Search symbol or company name")
) -> List[StockItem]:
    return getStocks(sector=sector, search=search)


# Retrieve all unique market sectors
@router.get("/sectors", response_model=List[str])
def listSectors() -> List[str]:
    return getAllSectors()


# Retrieve stock profile, latest price summary, and trailing returns
@router.get("/{symbol}", response_model=StockDetailResponse)
def getStock(symbol: str) -> Dict[str, Any]:
    stockSymbol = symbol.upper().strip()
    stockInfo = getStockInfo(stockSymbol)
    if not stockInfo:
        raise HTTPException(status_code=404, detail=f"Stock '{stockSymbol}' not found in S&P 500 database")

    stockData = loadStockData(stockSymbol)
    priceInfo = getCurrentPriceInfo(stockData)
    stockReturns = calculateReturns(stockData)

    return {
        "info": stockInfo,
        "price_info": priceInfo,
        "returns": stockReturns
    }


# Get historical OHLCV data formatted for charting
@router.get("/{symbol}/history")
def getHistory(
    symbol: str,
    period: Optional[str] = Query("1y", description="Time period: 1m, 3m, 6m, 1y, 2y, 5y, all"),
    startDate: Optional[str] = Query(None, description="Custom start date (YYYY-MM-DD)")
) -> Dict[str, Any]:
    stockSymbol = symbol.upper().strip()
    stockInfo = getStockInfo(stockSymbol)
    if not stockInfo:
        raise HTTPException(status_code=404, detail=f"Stock '{stockSymbol}' not found")

    if not startDate:
        todayDate = date.today()
        periodMap = {
            "1m": todayDate.replace(month=todayDate.month - 1 if todayDate.month > 1 else 12),
            "3m": todayDate.replace(month=todayDate.month - 3 if todayDate.month > 3 else todayDate.month + 9),
            "6m": todayDate.replace(month=todayDate.month - 6 if todayDate.month > 6 else todayDate.month + 6),
            "1y": todayDate.replace(year=todayDate.year - 1),
            "2y": todayDate.replace(year=todayDate.year - 2),
            "5y": todayDate.replace(year=todayDate.year - 5),
            "all": "2015-01-01"
        }
        computedDate = periodMap.get(period.lower(), "2023-01-01")
        startString = computedDate.strftime("%Y-%m-%d") if isinstance(computedDate, date) else str(computedDate)
    else:
        startString = startDate

    historyData = loadStockData(stockSymbol, startDate=startString)
    if historyData.empty:
        raise HTTPException(status_code=500, detail=f"Failed to fetch market data for '{stockSymbol}'")

    dataFrame = historyData.copy()
    dataFrame["Date"] = dataFrame["Date"].dt.strftime("%Y-%m-%d")
    historyRecords = dataFrame[["Date", "Open", "High", "Low", "Close", "Volume"]].to_dict(orient="records")

    return {
        "symbol": stockSymbol,
        "count": len(historyRecords),
        "history": historyRecords
    }


# Calculate and return full technical indicators plus current signal ratings
@router.get("/{symbol}/indicators")
def getIndicators(symbol: str) -> Dict[str, Any]:
    stockSymbol = symbol.upper().strip()
    stockData = loadStockData(stockSymbol)
    if stockData.empty:
        raise HTTPException(status_code=404, detail=f"Could not load data for '{stockSymbol}'")

    indicatorsData = calculateAllIndicators(stockData)
    indicatorSummary = getIndicatorSummary(indicatorsData)

    recentData = indicatorsData.tail(252).copy()
    recentData["Date"] = recentData["Date"].dt.strftime("%Y-%m-%d")
    
    indicatorRecords = recentData.where(pd.notnull(recentData), None).to_dict(orient="records")

    return {
        "symbol": stockSymbol,
        "summary": indicatorSummary,
        "data": indicatorRecords
    }


# Train LSTM model and generate forward price projections
@router.post("/{symbol}/predict", response_model=ForecastResponse)
def predictStock(symbol: str, requestData: PredictionRequest) -> Dict[str, Any]:
    stockSymbol = symbol.upper().strip()
    stockData = loadStockData(stockSymbol)
    if stockData.empty:
        raise HTTPException(status_code=404, detail=f"Could not load data for '{stockSymbol}'")

    try:
        predictionResults = trainAndForecast(
            data=stockData,
            predictionDays=requestData.prediction_days,
            forecastDays=requestData.forecast_days,
            epochsCount=requestData.epochs
        )
        return {
            "symbol": stockSymbol,
            "metrics": predictionResults["metrics"],
            "forecast": predictionResults["forecast"]
        }
    except Exception as errorDetails:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(errorDetails)}")


# Export dataset in CSV or JSON
@router.get("/{symbol}/export")
def exportStockData(
    symbol: str,
    exportType: str = Query("history", description="Type of data: history, indicators, summary"),
    fileFormat: str = Query("csv", description="Format: csv or json")
) -> Response:
    stockSymbol = symbol.upper().strip()
    stockData = loadStockData(stockSymbol)
    if stockData.empty:
        raise HTTPException(status_code=404, detail=f"Data for '{stockSymbol}' not found")

    exportDataFrame = stockData.copy()
    exportDataFrame["Date"] = exportDataFrame["Date"].dt.strftime("%Y-%m-%d")

    if exportType == "indicators":
        exportDataFrame = calculateAllIndicators(stockData)
        exportDataFrame["Date"] = exportDataFrame["Date"].dt.strftime("%Y-%m-%d")
    elif exportType == "summary":
        priceInfo = getCurrentPriceInfo(stockData)
        stockReturns = calculateReturns(stockData)
        summaryRecords = []
        if priceInfo:
            summaryRecords.append({"Metric": "Current Price", "Value": str(priceInfo['current_price'])})
            summaryRecords.append({"Metric": "Daily Change", "Value": f"{priceInfo['change']} ({priceInfo['change_pct']}%)"})
            summaryRecords.append({"Metric": "52W High", "Value": str(priceInfo['high_52w'])})
            summaryRecords.append({"Metric": "52W Low", "Value": str(priceInfo['low_52w'])})
            summaryRecords.append({"Metric": "Average Volume", "Value": str(priceInfo['avg_volume'])})
        if stockReturns:
            for returnPeriod, returnValue in stockReturns.items():
                summaryRecords.append({"Metric": f"Return ({returnPeriod})", "Value": f"{returnValue}%"})
        exportDataFrame = pd.DataFrame(summaryRecords)

    if fileFormat.lower() == "json":
        jsonContent = exportDataFrame.to_json(orient="records", indent=2)
        return Response(
            content=jsonContent,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={stockSymbol}_{exportType}.json"}
        )
    else:
        csvContent = exportDataFrame.to_csv(index=False)
        return Response(
            content=csvContent,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={stockSymbol}_{exportType}.csv"}
        )
