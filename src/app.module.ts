import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CurrensyModule } from './currensy/currensy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CurrensyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
