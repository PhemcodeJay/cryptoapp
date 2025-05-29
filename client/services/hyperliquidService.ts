import axios from 'axios';

const API_BASE = '/api/hyperliquid';

interface TradeOptions {
  walletAddress?: string;
  walletSecret?: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  mode?: 'demo' | 'real';
  chain?: 'eth' | 'bsc';
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
   * Place a futures order via backend
   * @param options - Trading order options
   * @returns Promise resolving to trade result
   */
  async placeFuturesOrder(options: TradeOptions): Promise<TradeResponse> {
    try {
      const response = await axios.post(`${API_BASE}/trade`, options);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error placing futures order:', error);
      throw new Error(error?.response?.data?.message || 'Order failed');
    }
  },
};

export default hyperliquidService;
