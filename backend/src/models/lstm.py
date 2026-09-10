import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import logging
from typing import Tuple, Dict, Any, List, Optional
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout

logger = logging.getLogger(__name__)


def validateData(data: pd.DataFrame) -> Tuple[bool, str]:
    if data is None or data.empty:
        return False, "Data is empty or None"
    if 'Close' not in data.columns:
        return False, "Missing 'Close' column in DataFrame"
    if len(data) < 100:
        return False, f"Insufficient data: {len(data)} rows (minimum 100 required)"
    return True, ""


def buildLstmModel(inputShape: Tuple[int, int], units: int = 50, dropoutRate: float = 0.2) -> Sequential:
    model = Sequential([
        LSTM(units=units, return_sequences=True, input_shape=inputShape),
        Dropout(dropoutRate),
        LSTM(units=units, return_sequences=False),
        Dropout(dropoutRate),
        Dense(units=25),
        Dense(units=1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model


def calculateMetrics(yTrue: np.ndarray, yPred: np.ndarray) -> Dict[str, float]:
    mae = mean_absolute_error(yTrue, yPred)
    mse = mean_squared_error(yTrue, yPred)
    rmse = np.sqrt(mse)
    r2 = r2_score(yTrue, yPred)
    return {
        'mae': round(float(mae), 4),
        'mse': round(float(mse), 4),
        'rmse': round(float(rmse), 4),
        'r2': round(float(r2), 4)
    }


def predictFuture(
    model: Sequential,
    lastSequence: np.ndarray,
    scaler: MinMaxScaler,
    daysAhead: int = 30
) -> np.ndarray:
    predictions = []
    currentBatch = lastSequence.reshape(1, lastSequence.shape[0], 1)

    for i in range(daysAhead):
        predScaled = model.predict(currentBatch, verbose=0)[0]
        predictions.append(predScaled)
        currentBatch = np.append(currentBatch[:, 1:, :], [[predScaled]], axis=1)

    predictionsInv = scaler.inverse_transform(predictions)
    return predictionsInv


def getPredictionConfidence(
    predictions: np.ndarray,
    historicalErrors: Optional[np.ndarray],
    confidenceLevel: float = 0.95
) -> Tuple[np.ndarray, np.ndarray]:
    if historicalErrors is None or len(historicalErrors) == 0:
        stdDev = np.std(predictions) if len(predictions) > 1 else 1.0
    else:
        stdDev = np.std(historicalErrors)

    zScores = {0.80: 1.28, 0.90: 1.645, 0.95: 1.96, 0.99: 2.576}
    zValue = zScores.get(confidenceLevel, 1.96)

    days = np.arange(1, len(predictions) + 1)
    margin = zValue * stdDev * np.sqrt(days / days[0]).reshape(-1, 1)

    lower = predictions - margin
    upper = predictions + margin
    return lower, upper


def generateFutureDates(startDate: datetime, numDays: int) -> List[str]:
    datesList = []
    currentDate = startDate
    while len(datesList) < numDays:
        currentDate += timedelta(days=1)
        if currentDate.weekday() < 5:
            datesList.append(currentDate.strftime("%Y-%m-%d"))
    return datesList


def trainAndForecast(
    data: pd.DataFrame,
    predictionDays: int = 60,
    forecastDays: int = 15,
    epochsCount: int = 10,
    units: int = 50,
    dropoutRate: float = 0.2
) -> Dict[str, Any]:
    valid, validationMessage = validateData(data)
    if not valid:
        raise ValueError(validationMessage)

    closePrices = data['Close'].values.reshape(-1, 1)
    
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaledData = scaler.fit_transform(closePrices)

    splitIndex = int(len(scaledData) * 0.9)
    trainData = scaledData[:splitIndex]
    testData = scaledData[splitIndex - predictionDays:]

    xTrain, yTrain = [], []
    for i in range(predictionDays, len(trainData)):
        xTrain.append(trainData[i - predictionDays:i, 0])
        yTrain.append(trainData[i, 0])
    xTrainArray, yTrainArray = np.array(xTrain), np.array(yTrain)
    xTrainArray = np.reshape(xTrainArray, (xTrainArray.shape[0], xTrainArray.shape[1], 1))

    xTest, yTest = [], []
    for j in range(predictionDays, len(testData)):
        xTest.append(testData[j - predictionDays:j, 0])
        yTest.append(testData[j, 0])
    xTestArray, yTestArray = np.array(xTest), np.array(yTest)
    xTestArray = np.reshape(xTestArray, (xTestArray.shape[0], xTestArray.shape[1], 1))

    model = buildLstmModel((xTrainArray.shape[1], 1), units=units, dropoutRate=dropoutRate)
    model.fit(xTrainArray, yTrainArray, epochs=epochsCount, batch_size=32, verbose=0)

    valPreds = model.predict(xTestArray, verbose=0)
    valPredsInv = scaler.inverse_transform(valPreds)
    yTestInv = scaler.inverse_transform(yTestArray.reshape(-1, 1))
    evaluationMetrics = calculateMetrics(yTestInv, valPredsInv)
    historicalErrors = (yTestInv - valPredsInv).flatten()

    lastSequence = scaledData[-predictionDays:, 0]
    futurePreds = predictFuture(model, lastSequence, scaler, daysAhead=forecastDays)
    lowerBound, upperBound = getPredictionConfidence(futurePreds, historicalErrors, 0.95)

    lastDate = pd.to_datetime(data['Date'].iloc[-1]).to_pydatetime()
    futureDates = generateFutureDates(lastDate, forecastDays)

    forecastRecords = []
    for targetDate, predictedPrice, lowPrice, highPrice in zip(futureDates, futurePreds.flatten(), lowerBound.flatten(), upperBound.flatten()):
        forecastRecords.append({
            "date": targetDate,
            "predicted": round(float(predictedPrice), 2),
            "lower": round(float(lowPrice), 2),
            "upper": round(float(highPrice), 2)
        })

    return {
        "metrics": evaluationMetrics,
        "forecast": forecastRecords
    }
