import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

import { ExchangeRateService } from './shared/exchange-rate.service';
import { ExchangeController } from './exchange/exchange.controller';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({}),
    ConfigModule.forRoot()
  ],
  controllers: [ExchangeController],
  providers: [ExchangeRateService],
})
export class AppModule {}
