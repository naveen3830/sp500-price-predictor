import pandas as pd
import numpy as np
from typing import Dict, Any


def calculateSma(series: pd.Series, period: int = 20) -> pd.Series:
    return series.rolling(window=period).mean()


def calculateEma(series: pd.Series, period: int = 20) -> pd.Series:
    return series.ewm(span=period, adjust=False).mean()


def calculateRsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = (-delta).where(delta < 0, 0.0)

    avgGain = gain.rolling(window=period, min_periods=period).mean()
    avgLoss = loss.rolling(window=period, min_periods=period).mean()

    for i in range(period, len(series)):
        avgGain.iloc[i] = (avgGain.iloc[i - 1] * (period - 1) + gain.iloc[i]) / period
        avgLoss.iloc[i] = (avgLoss.iloc[i - 1] * (period - 1) + loss.iloc[i]) / period

    relativeStrength = avgGain / avgLoss
    rsiValues = 100 - (100 / (1 + relativeStrength))
    return rsiValues


def calculateMacd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, pd.Series]:
    fastEma = calculateEma(series, fast)
    slowEma = calculateEma(series, slow)
    macdLine = fastEma - slowEma
    signalLine = calculateEma(macdLine, signal)
    macdHistogram = macdLine - signalLine
    return {"macd": macdLine, "signal": signalLine, "histogram": macdHistogram}


def calculateBollingerBands(series: pd.Series, period: int = 20, stdDev: float = 2.0) -> Dict[str, pd.Series]:
    middleBand = calculateSma(series, period)
    standardDeviation = series.rolling(window=period).std()
    upperBand = middleBand + (standardDeviation * stdDev)
    lowerBand = middleBand - (standardDeviation * stdDev)
    return {"upper": upperBand, "middle": middleBand, "lower": lowerBand}


def calculateAtr(high: pd.Series, low: pd.Series, close: pd.Series, period: int = 14) -> pd.Series:
    previousClose = close.shift(1)
    rangeOne = high - low
    rangeTwo = (high - previousClose).abs()
    rangeThree = (low - previousClose).abs()
    trueRange = pd.concat([rangeOne, rangeTwo, rangeThree], axis=1).max(axis=1)
    return trueRange.rolling(window=period).mean()


def calculateObv(close: pd.Series, volume: pd.Series) -> pd.Series:
    priceDirection = np.sign(close.diff()).fillna(0)
    return (priceDirection * volume).cumsum()


def calculateStochastic(high: pd.Series, low: pd.Series, close: pd.Series, kPeriod: int = 14, dPeriod: int = 3) -> Dict[str, pd.Series]:
    lowestLow = low.rolling(window=kPeriod).min()
    highestHigh = high.rolling(window=kPeriod).max()
    denominator = highestHigh - lowestLow
    denominator = denominator.replace(0, np.nan)
    stochK = 100 * (close - lowestLow) / denominator
    stochD = stochK.rolling(window=dPeriod).mean()
    return {"k": stochK, "d": stochD}


def calculateAllIndicators(dataFrame: pd.DataFrame) -> pd.DataFrame:
    result = dataFrame.copy()
    if isinstance(result.columns, pd.MultiIndex):
        result.columns = result.columns.get_level_values(0)

    closePrices = result['Close']
    highPrices = result['High']
    lowPrices = result['Low']
    volumeValues = result['Volume']

    result['SMA_20'] = calculateSma(closePrices, 20)
    result['SMA_50'] = calculateSma(closePrices, 50)
    result['EMA_12'] = calculateEma(closePrices, 12)
    result['EMA_26'] = calculateEma(closePrices, 26)

    result['RSI'] = calculateRsi(closePrices)

    macdResult = calculateMacd(closePrices)
    result['MACD'] = macdResult['macd']
    result['MACD_Signal'] = macdResult['signal']
    result['MACD_Histogram'] = macdResult['histogram']

    bollingerResult = calculateBollingerBands(closePrices)
    result['BB_Upper'] = bollingerResult['upper']
    result['BB_Middle'] = bollingerResult['middle']
    result['BB_Lower'] = bollingerResult['lower']

    result['ATR'] = calculateAtr(highPrices, lowPrices, closePrices)
    result['OBV'] = calculateObv(closePrices, volumeValues)

    stochResult = calculateStochastic(highPrices, lowPrices, closePrices)
    result['Stoch_K'] = stochResult['k']
    result['Stoch_D'] = stochResult['d']

    return result


def getIndicatorSummary(dataFrame: pd.DataFrame) -> Dict[str, Any]:
    if dataFrame.empty or len(dataFrame) < 50:
        return {}

    lastRow = dataFrame.iloc[-1]

    rsiValue = float(lastRow.get('RSI', 50)) if pd.notna(lastRow.get('RSI')) else 50.0
    if rsiValue >= 70:
        rsiSignal = "Overbought"
    elif rsiValue <= 30:
        rsiSignal = "Oversold"
    else:
        rsiSignal = "Neutral"

    macdValue = float(lastRow.get('MACD', 0)) if pd.notna(lastRow.get('MACD')) else 0.0
    macdSignalValue = float(lastRow.get('MACD_Signal', 0)) if pd.notna(lastRow.get('MACD_Signal')) else 0.0
    if macdValue > macdSignalValue:
        macdSignal = "Bullish"
    elif macdValue < macdSignalValue:
        macdSignal = "Bearish"
    else:
        macdSignal = "Neutral"

    closeValue = float(lastRow['Close'])
    bbUpper = float(lastRow.get('BB_Upper', closeValue)) if pd.notna(lastRow.get('BB_Upper')) else closeValue
    bbLower = float(lastRow.get('BB_Lower', closeValue)) if pd.notna(lastRow.get('BB_Lower')) else closeValue
    if closeValue >= bbUpper:
        bbSignal = "Overbought"
    elif closeValue <= bbLower:
        bbSignal = "Oversold"
    else:
        bbSignal = "Neutral"

    sma20 = float(lastRow.get('SMA_20', closeValue)) if pd.notna(lastRow.get('SMA_20')) else closeValue
    sma50 = float(lastRow.get('SMA_50', closeValue)) if pd.notna(lastRow.get('SMA_50')) else closeValue
    movingAverageTrend = "Bullish" if (closeValue > sma20 and sma20 > sma50) else ("Bearish" if closeValue < sma20 else "Neutral")

    return {
        "rsi": {"value": round(rsiValue, 2), "signal": rsiSignal},
        "macd": {
            "macd": round(macdValue, 2),
            "signal_line": round(macdSignalValue, 2),
            "histogram": round(float(lastRow.get('MACD_Histogram', 0)), 2),
            "signal": macdSignal
        },
        "bollinger": {
            "upper": round(bbUpper, 2),
            "middle": round(float(lastRow.get('BB_Middle', closeValue)), 2),
            "lower": round(bbLower, 2),
            "signal": bbSignal
        },
        "trend": movingAverageTrend,
        "sma_20": round(sma20, 2),
        "sma_50": round(sma50, 2)
    }
