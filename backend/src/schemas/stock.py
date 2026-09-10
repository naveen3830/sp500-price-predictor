from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class StockItem(BaseModel):
    symbol: str
    name: str
    sector: str


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


class StockDetailResponse(BaseModel):
    info: StockItem
    price_info: Optional[PriceSummary] = None
    returns: Dict[str, float] = {}


class ForecastPoint(BaseModel):
    date: str
    predicted: float
    lower: float
    upper: float


class ModelMetrics(BaseModel):
    mae: float
    mse: float
    rmse: float
    r2: float


class ForecastResponse(BaseModel):
    symbol: str
    metrics: ModelMetrics
    forecast: List[ForecastPoint]


class PredictionRequest(BaseModel):
    forecast_days: int = Field(default=15, ge=1, le=60)
    epochs: int = Field(default=10, ge=3, le=50)
    prediction_days: int = Field(default=60, ge=20, le=120)
