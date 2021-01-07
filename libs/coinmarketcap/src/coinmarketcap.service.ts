import { Currency } from '@app/domain/models/currency.model';
import { HttpService, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { map } from 'rxjs/operators';

import { coinmarketcapConfig } from './config';
import { CoinmarketcapCurrencyResponse } from './responses/currency.response';

@Injectable()
export class CoinmarketcapService {
  private readonly endpoint =
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

  private readonly reqOptions = {
    start: 1,
    limit: 5,
    convert: 'USD',
  };

  constructor(
    private readonly httpService: HttpService,

    @Inject(coinmarketcapConfig.KEY)
    private readonly config: ConfigType<typeof coinmarketcapConfig>,
  ) {}

  public getCurrencies(): Promise<Currency[]> {
    return this.httpService
      .get<CoinmarketcapCurrencyResponse>(`${this.endpoint}`, {
        params: this.reqOptions,
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
  }
}
