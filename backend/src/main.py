import os
import sys
import logging
from typing import Dict

backendDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backendDir not in sys.path:
    sys.path.insert(0, backendDir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.endpoints.stocks import router as stocksRouter

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sp500Backend")

app = FastAPI(
    title="S&P 500 Price Predictor API",
    description="Backend API powering S&P 500 stock analysis, technical indicators, and LSTM price predictions.",
    version="2.0.0"
)

# Enable CORS for React frontend (Vite default is 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
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
        "version": "2.0.0",
        "docs": "/docs",
        "status": "online"
    }


@app.get("/health")
def healthCheck() -> Dict[str, str]:
    return {"status": "healthy"}
