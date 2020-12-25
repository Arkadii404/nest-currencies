import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { CurrensyModule } from './currensy/currensy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CurrensyModule,
    TelegrafModule.forRoot({
      token: process.env.TG_TOKEN,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
