import os
import ccxt
import pandas as pd
import numpy as np
import requests
import argparse
from dotenv import load_dotenv
from ta.volatility import BollingerBands
from ta.trend import MACD
from ta.momentum import RSIIndicator, StochasticOscillator
from datetime import datetime

# Load .env
load_dotenv()

class TradingBot:
    def __init__(self, strategy, timeframe, balance, wallet, signature, threshold):
        # CLI parameters
        self.strategy = strategy
        self.timeframe = timeframe
        self.trade_usd = float(balance)
        self.wallet = wallet
        self.signature = signature
        self.threshold = float(threshold)

        # Config from .env
        self.api_key = os.getenv("API_KEY")
        self.api_secret = os.getenv("API_SECRET")
        self.telegram_token = os.getenv("TELEGRAM_TOKEN")
        self.telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID")
        self.symbol = os.getenv("SYMBOL", "DOGE/USDT")
        self.limit = int(os.getenv("LIMIT", 500))

        # Derived config
        self.stop_loss_pct = 0.10
        self.take_profit_min_pct = 0.50
        self.take_profit_max_pct = 1.00
        self.in_position = False
        self.entry_price = 0
        self.demo_mode = not (self.api_key and self.api_secret)

        # Logging setup
        self.log_dir = os.path.join(os.getcwd(), f"logs/{self.timeframe}")
        os.makedirs(self.log_dir, exist_ok=True)
        self.trades_file = os.path.join(self.log_dir, "trades.csv")
        self.signals_file = os.path.join(self.log_dir, "signals.log")
        self._init_logs()

        # Exchange setup
        self.exchange = self._init_exchange()

    def _init_logs(self):
        if not os.path.exists(self.trades_file):
            with open(self.trades_file, 'w') as f:
                f.write("timestamp,mode,trade_type,price,amount,reason\n")
        if not os.path.exists(self.signals_file):
            with open(self.signals_file, 'w') as f:
                f.write("=== Trading Signals Log ===\n")

    def _init_exchange(self):
        if self.demo_mode:
            print("DEMO mode enabled")
            return ccxt.binance()
        try:
            exchange = ccxt.binance({
                'apiKey': self.api_key,
                'secret': self.api_secret,
                'enableRateLimit': True,
                'options': {'adjustForTimeDifference': True}
            })
            exchange.fetch_balance()
            return exchange
        except Exception as e:
            print(f"Exchange init failed: {e}")
            self.demo_mode = True
            return ccxt.binance()

    def _log_signal(self, msg):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(self.signals_file, 'a') as f:
            f.write(f"[{timestamp}] {msg}\n")

    def send_telegram(self, msg):
        if not self.telegram_token or not self.telegram_chat_id:
            return
        url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
        try:
            requests.post(url, data={"chat_id": self.telegram_chat_id, "text": msg})
        except Exception as e:
            print(f"Telegram error: {e}")

    def fetch_data(self):
        try:
            bars = self.exchange.fetch_ohlcv(self.symbol, timeframe=self.timeframe, limit=self.limit)
            df = pd.DataFrame(bars, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            return df
        except Exception as e:
            self._log_signal(f"Fetch error: {e}")
            return self._generate_sample_data()

    def _generate_sample_data(self):
        self._log_signal("Using generated sample data")
        freq_map = {"1h": "H", "1d": "D", "1w": "W"}
        freq = freq_map.get(self.timeframe, "H")
        date_rng = pd.date_range(end=datetime.now(), periods=self.limit, freq=freq)
        base = np.random.uniform(0.05, 0.15)
        price = base * (1 + np.cumsum(np.random.randn(self.limit) * 0.002))
        df = pd.DataFrame({
            'timestamp': date_rng,
            'open': price * 0.998,
            'high': price * 1.002,
            'low': price * 0.995,
            'close': price,
            'volume': np.random.uniform(1e6, 5e6, self.limit)
        })
        return df

    def apply_indicators(self, df):
        df['ma20'] = df['close'].rolling(20).mean()
        df['ma200'] = df['close'].rolling(200).mean()
        bb = BollingerBands(close=df['close'])
        df['bb_upper'] = bb.bollinger_hband()
        df['bb_lower'] = bb.bollinger_lband()
        macd = MACD(close=df['close'])
        df['macd'] = macd.macd()
        df['macd_signal'] = macd.macd_signal()
        rsi = RSIIndicator(close=df['close'])
        df['rsi'] = rsi.rsi()
        stoch = StochasticOscillator(high=df['high'], low=df['low'], close=df['close'])
        df['stoch_rsi'] = stoch.stoch()
        return df

    def log_trade(self, trade_type, price, amount, reason):
        timestamp = datetime.utcnow().isoformat()
        mode = "DEMO" if self.demo_mode else "LIVE"
        with open(self.trades_file, 'a') as f:
            f.write(f"{timestamp},{mode},{trade_type},{price:.8f},{amount:.8f},{reason}\n")
        self._log_signal(f"Trade {trade_type} at {price:.4f} | {reason}")

    def execute_trade(self, trade_type, price, amount, reason):
        msg = f"[{'DEMO' if self.demo_mode else 'LIVE'}] {trade_type} {amount:.4f} {self.symbol} @ {price:.4f} | {reason}"
        print(msg)
        self.send_telegram(msg)
        self.log_trade(trade_type, price, amount, reason)

    def run_strategy(self, df):
        for i in range(200, len(df)):
            row = df.iloc[i]
            price = row['close']

            if not self.in_position:
                if (price < row['bb_lower'] and 
                    row['macd'] > row['macd_signal'] and 
                    row['rsi'] < 30 and 
                    row['stoch_rsi'] < 20 and 
                    price > row['ma200']):
                    
                    self.entry_price = price
                    amount = self.trade_usd / price
                    self.execute_trade("BUY", price, amount, "Strategy Triggered")
                    self.in_position = True
            else:
                if price <= self.entry_price * (1 - self.stop_loss_pct):
                    self.execute_trade("SELL", price, self.trade_usd / self.entry_price, "Stop Loss")
                    self.in_position = False
                elif price >= self.entry_price * (1 + np.random.uniform(self.take_profit_min_pct, self.take_profit_max_pct)):
                    self.execute_trade("SELL", price, self.trade_usd / self.entry_price, "Take Profit")
                    self.in_position = False

    def run(self):
        self._log_signal(f"Running {self.strategy} strategy on {self.timeframe} timeframe")
        try:
            df = self.fetch_data()
            df = self.apply_indicators(df)
            self.run_strategy(df)
        except Exception as e:
            self._log_signal(f"Execution error: {e}")
        finally:
            self._log_signal("Session ended")

# === Main Entry Point ===
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Trading bot runner")
    parser.add_argument("--strategy", type=str, default="MACD", help="Trading strategy (e.g., MACD)")
    parser.add_argument("--timeframe", type=str, default="1h", help="Timeframe (1h, 1d, 1w)")
    parser.add_argument("--balance", type=float, default=20, help="USDT balance to trade")
    parser.add_argument("--wallet", type=str, required=True, help="Wallet address")
    parser.add_argument("--signature", type=str, required=True, help="Wallet signature")
    parser.add_argument("--threshold", type=float, default=50.0, help="Signal threshold")
    args = parser.parse_args()

    bot = TradingBot(
        strategy=args.strategy,
        timeframe=args.timeframe,
        balance=args.balance,
        wallet=args.wallet,
        signature=args.signature,
        threshold=args.threshold
    )
    bot.run()
