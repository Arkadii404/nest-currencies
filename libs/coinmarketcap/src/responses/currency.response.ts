export interface CoinmarketcapCurrencyResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string;
    elapsed: number;
    credit_count: number;
    notice: null;
    total_count: number;
  };
  data: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    num_market_pairs: number;
    date_added: string;
    tags: string[];
    max_supply: number;
    circulating_supply: number;
    total_supply: number;
    platform: {
      id: number;
      name: string;
      symbol: string;
      slug: string;
      token_address: string;
    };
    cmc_rank: number;
    last_updated: string;
    quote: {
      USD: {
        price: number;
        volume_24h: number;
        percent_change_1h: number;
        percent_change_24h: number;
        percent_change_7d: number;
        market_cap: number;
        last_updated: string;
      };
    };
  }[];
}
