from typing import List, Dict, Optional
from pydantic import BaseModel, Field

# Request payload for training and forecasting prices
class PredictionRequest(BaseModel):
    forecast_days: int = Field(default=15, ge=1, le=60)
    epochs: int = Field(default=10, ge=3, le=50)
    prediction_days: int = Field(default=60, ge=20, le=120)


# Response item representing an S&P 500 constituent
class StockItem(BaseModel):
    symbol: str
    name: str
    sector: str


# Real-time quote and 52-week summary metrics
class PriceSummary(BaseModel):
    current_price: float
    prev_close: float
    change: float
    change_pct: float
    high_52w: float
    low_52w: float
    avg_volume: float
    open: float
    high: float
    low: float
    volume: float
    latest_date: str


# Detailed response including profile, price summary, and trailing returns
class StockDetailResponse(BaseModel):
    info: StockItem
    price_info: Optional[PriceSummary] = None
    returns: Dict[str, float] = {}


# Single predicted future date point with 95% confidence intervals
class ForecastPoint(BaseModel):
    date: str
    predicted: float
    lower: float
    upper: float


# Evaluation metrics for the trained LSTM neural network
class ModelMetrics(BaseModel):
    mae: float
    mse: float
    rmse: float
    r2: float


# Complete forecast response payload with evaluation metrics and projection points
class ForecastResponse(BaseModel):
    symbol: str
    metrics: ModelMetrics
    forecast: List[ForecastPoint]
