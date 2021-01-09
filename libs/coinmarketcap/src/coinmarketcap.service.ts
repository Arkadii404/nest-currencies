import { HttpService, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Currency } from '@app/pdf-renderer/models/currency.model';
import { map } from 'rxjs/operators';

import { coinmarketcapConfig } from './config';
import { CoinmarketcapCurrencyResponse } from './responses/currency.response';

@Injectable()
export class CoinmarketcapService {
  constructor(
    private readonly httpService: HttpService,

    @Inject(coinmarketcapConfig.KEY)
    private readonly config: ConfigType<typeof coinmarketcapConfig>,
  ) {}

  public getCurrencies(): Promise<Currency[]> {
    try {
      return this.httpService
        .get<CoinmarketcapCurrencyResponse>(`${this.config.endpoint}`, {
          params: this.config.reqOptions,
          headers: {
            'X-CMC_PRO_API_KEY': this.config.key,
          },
        })
        .pipe(
          map(res =>
            res.data.data
              .map(c => ({
                name: c.name,
                symbol: c.symbol,
                change: c.quote.USD.percent_change_24h,
                price: c.quote.USD.price,
              }))
              .reverse(),
          ),
        )
        .toPromise();
    } catch (err) {
      console.log('FETCH DATA FAILED');
      throw err;
    }
  }
}
