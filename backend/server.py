# server.py
import yfinance as yf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SafeBets Data API")

# Allow your app to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace "*" with your app domain
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/history/{symbol}")
def get_history(symbol: str):
    stock = yf.Ticker(symbol)
    hist = stock.history(period="1mo")  # last month
    dates = hist.index.strftime("%Y-%m-%d").tolist()
    prices = hist["Close"].round(2).tolist()
    return {"dates": dates, "prices": prices}


@app.get("/quote/{symbol}")
def get_quote(symbol: str):
    return {"price": get_history(symbol)["prices"][0]}
