import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CurrencyModule,
    TelegrafModule.forRoot({
      token: process.env.TG_TOKEN,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
