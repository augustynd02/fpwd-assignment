import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

import { ExchangeRateService } from './shared/exchange-rate.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({}),
    ConfigModule.forRoot()
  ],
  controllers: [],
  providers: [ExchangeRateService],
})
export class AppModule {}
