import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Currensy } from './models/currensy.model';
import { ProcessedCurrency } from './models/processed-currency.model';

@Injectable()
export class CurrensyService {
  private readonly endpoint =
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

  private readonly reqOptions = {
    start: 1,
    limit: 5,
    convert: 'USD',
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public getCurrencies(): Observable<Currensy[]> {
    const options = Object.entries(this.reqOptions)
      .map(i => `${i[0]}=${i[1]}`)
      .join('&');

    return this.httpService
      .get(`${this.endpoint}?${options}`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.configService.get('COINMARKETCUP_API_KEY'),
        },
      })
      .pipe(map(res => res.data.data));
  }

  public handleCurrencies(currencies: Currensy[]): ProcessedCurrency[] {
    return currencies.map(i => {
      return {
        name: i.name,
        symbol: i.symbol,
        change: i.quote.USD.percent_change_24h,
      };
    });
  }
}
