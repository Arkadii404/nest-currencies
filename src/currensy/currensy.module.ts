import { HttpModule, Module } from '@nestjs/common';
import { CurrensyService } from './currensy.service';

@Module({
  providers: [CurrensyService],
  imports: [HttpModule],
})
export class CurrensyModule {
  constructor(private readonly currencyService: CurrensyService) {
    this.currencyService.getCurrencies().subscribe(
      data =>
        console.log('Success: ', this.currencyService.handleCurrencies(data)),
      err => console.log('Error: ', err),
    );
  }
}
