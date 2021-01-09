import { registerAs } from '@nestjs/config';

export const coinmarketcapConfig = registerAs('coinmarketcap', () => ({
  key: process.env.COINMARKETCUP_API_KEY,
  endpoint:
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  reqOptions: {
    start: 1,
    limit: 5,
    convert: 'USD',
  },
}));
