import { registerAs } from '@nestjs/config';

export const coinmarketcapConfig = registerAs('coinmarketcap', () => ({
  key: process.env.COINMARKETCUP_API_KEY,
}));
