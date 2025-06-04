import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

type ExchangeRateResponse = {
    fromCache: boolean,
    data: RateType
}

type RateType = {
    rate: number,
    timestamp: number,
}

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
            return { fromCache: true, data: cachedData };
        }

        const API_URL = this.configService.get<string>('API_URL')
        const API_KEY = this.configService.get<string>('API_KEY')

        if (!API_URL || !API_KEY) {
            throw new Error (".env variables are not defined");
        }

        const response = await firstValueFrom(
            this.httpService.get(API_URL, {
                headers: {
                    'x-api-key': API_KEY
                }
            })
        );

        const data = response.data.exchange_rate;
        const timestamp = Date.now();

        await this.cacheManager.set('rate', { rate: data, timestamp: timestamp}, 60000);

        return { fromCache: false, data: { rate: data, timestamp: timestamp} };
    }
}
