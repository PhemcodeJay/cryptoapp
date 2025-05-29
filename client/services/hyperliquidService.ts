import axios from 'axios';

const API_BASE = '/api/hyperliquid';

interface TradeOptions {
  walletAddress?: string;
  balanceToUse?: number;
  signature?: string;
  chain?: string;
}

interface TradeResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Service for executing trades on Hyperliquid via backend API
 */
const hyperliquidService = {
  /**
   * Execute a futures trade by calling the backend trading bot
   * @param strategy - Trading strategy (e.g., 'MACD', 'RSI')
   * @param threshold - Profit threshold percentage
   * @param timeframe - Timeframe string ('hourly', 'daily', 'weekly')
   * @param options - Additional trade options
   * @returns Promise resolving to trade result
   */
  async tradeFutures(
    strategy: string,
    threshold: number,
    timeframe: string,
    options: TradeOptions = {}
  ): Promise<TradeResponse> {
    try {
      const payload = { strategy, threshold, timeframe, ...options };
      const response = await axios.post(`${API_BASE}/trade`, payload);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error executing trade:', error);
      throw new Error(error?.response?.data?.message || 'Trade failed');
    }
  },
};

export default hyperliquidService;
