import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ExchangeRateService {
    constructor(
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) { }

    async getExchangeRate() {
        const cachedRate = await this.cacheManager.get('rate');
        if (cachedRate) {
            return { fromCache: true, rate: cachedRate };
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

        const data = response.data;

        await this.cacheManager.set('rate', data, 60000);

        return { fromCache: false, rate: data };
    }
}
