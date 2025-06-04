import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

type RateType = {
    rate: number,
    timestamp: number
}

type ExchangeRateResponse = {
    fromCache: boolean;
    data: {
        rate: number;
        secondsLeft: number;
    };
};

@Injectable()
export class ExchangeRateService {
    constructor(
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) { }

    async getExchangeRate(): Promise<ExchangeRateResponse> {
        const cachedData = await this.cacheManager.get<RateType>('rate');
        if (cachedData) {
            const dataAgeMs = Date.now() - cachedData.timestamp;
            const secondsLeft = Math.max(0, 60 - Math.floor(dataAgeMs / 1000));

            return {
                fromCache: true,
                data: {
                    rate: cachedData.rate,
                    secondsLeft: secondsLeft
                }
            };
        }

        const API_URL = this.configService.get<string>('API_URL')
        const API_KEY = this.configService.get<string>('API_KEY')

        if (!API_URL || !API_KEY) {
            throw new Error(".env variables are not defined");
        }

        const response = await firstValueFrom(
            this.httpService.get(API_URL, {
                headers: {
                    'x-api-key': API_KEY
                }
            })
        );

        const rate = response.data.exchange_rate;
        const timestamp = Date.now();

        await this.cacheManager.set('rate', { rate, timestamp }, 60000);

        return {
            fromCache: false,
            data: {
                rate,
                secondsLeft: 60
            }
        };
    }
}
