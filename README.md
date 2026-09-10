
# S&P 500 Price Predictor

An interactive stock analysis and price forecasting application built for the S&P 500 index. Featuring a decoupled architecture with a **FastAPI** backend and a modern **React + Vite + Tailwind CSS** frontend, this platform provides real-time market data, technical indicator analysis, customizable watchlists, and AI-driven future price projections powered by deep learning (LSTM).

## Key Features

- **Broad S&P 500 Coverage**: Constituent stocks organized across all market sectors.
- **Interactive Technical Analysis**: Candlestick charts, moving averages (SMA/EMA), Bollinger Bands, RSI, and MACD indicators.
- **AI Forecasting**: Long Short-Term Memory (LSTM) neural networks trained on historical price sequences for multi-day forward projections with confidence intervals.
- **Interactive Watchlist**: Quick-access watchlist sidebar with sector badges, one-click symbol loading, and list management.
- **Flexible Data Export**: Download historical OHLCV data, calculated technical indicators, and price forecasts in CSV or JSON format.

## Architecture

- **Backend**: FastAPI with async endpoints, yfinance for real-time market data, scikit-learn & TensorFlow for LSTM forecasting, and in-memory TTL caching.
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, Lucide icons, and Recharts.

## How to Run

### 1. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The API server starts at `http://localhost:8000`. Interactive API docs are available at `http://localhost:8000/docs`.

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The web application runs at `http://localhost:5173`.

> **Note**: The legacy Streamlit application has been preserved in the `streamlit-app` branch.

## Future Directions
- Incorporate external factors like macroeconomic indicators and financial news sentiment.
- Explore Transformer-based architectures (e.g., Temporal Fusion Transformers).
- Combine ARIMA and LSTM into automated hybrid ensembles.
 
