
# S&P 500 Price Predictor

An interactive stock analysis and price forecasting application built for the S&P 500 index. Powered by Streamlit, deep learning (LSTM), and traditional time series models (ARIMA), this platform provides real-time market data, technical indicator analysis, customizable watchlists, and AI-driven future price projections.

## Key Features

- **Broad S&P 500 Coverage**: Tickers organized across all 11 market sectors (Technology, Finance, Healthcare, Consumer, Energy, Industrial, Telecom, Real Estate, Utilities, Materials).
- **Interactive Technical Analysis**: Candlestick charts, moving averages (SMA/EMA), Bollinger Bands, RSI, and MACD indicators.
- **AI Forecasting**: Long Short-Term Memory (LSTM) neural networks trained on historical price sequences for multi-day forward projections with confidence intervals.
- **Interactive Watchlist**: Quick-access watchlist sidebar with sector badges, one-click symbol loading, and list management.
- **Flexible Data Export**: Download historical OHLCV data, calculated technical indicators, and price forecasts in CSV or JSON format.

## Project Workflow

### 1. Data Preprocessing
- Historical data retrieved via Yahoo Finance (`yfinance`).
- Data normalized using `MinMaxScaler`.
- Sliding window of 60 days used to create input-output sequences for LSTM.
- Stationarity achieved using differencing for ARIMA.

### 2. Modeling Approaches
- **ARIMA**:
  - Hyperparameter selection via MINIC and ESACF methods.
  - Focused on short-term accuracy for linear patterns.
- **LSTM**:
  - Multi-layer LSTM architecture with dropout regularization and dense output layers.
  - Optimized with Adam optimizer and Mean Squared Error (MSE) loss.
  - Captures non-linear trends and multi-day volatility.

### 3. Deployment
- Interactive web application deployed with Streamlit and Plotly.

## Results
- **Metrics**:
  - LSTM: MAE = 2.34, MSE = 8.92, R² = 0.87.
- LSTM effectively models non-linear price trends and volatility across S&P 500 constituents.

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/naveen3830/ai_stock_prediction.git
   cd ai_stock_prediction
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Streamlit app:
   ```bash
   streamlit run src/main.py
   ```

## Future Directions
- Incorporate external factors like macroeconomic indicators and financial news sentiment.
- Explore Transformer-based architectures (e.g., Temporal Fusion Transformers).
- Combine ARIMA and LSTM into automated hybrid ensembles.
 
