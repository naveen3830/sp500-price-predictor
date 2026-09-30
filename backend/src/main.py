import logging
from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.endpoints.stocks import router as stocksRouter

# Set up the appplication level logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sp500Backend")

# Initialize fastapi server
app = FastAPI(
    title="S&P 500 Price Predictor API",
    description="Backend API powering S&P 500 stock analysis, technical indicators, and LSTM price predictions.",
    version="1.0.0"
)

# Enable CORS for frontend
allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sp500-frontend-dev-1000490214833.asia-south1.run.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowedOrigins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(stocksRouter, prefix="/api")


@app.get("/")
def root() -> Dict[str, str]:
    return {
        "app": "S&P 500 Price Predictor API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "online"
    }


@app.get("/health")
def healthCheck() -> Dict[str, str]:
    return {
        "status": "online"
    }