import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { of } from 'rxjs';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
    let service: ExchangeRateService;
    let httpService: HttpService;
    let cacheManager: Cache;
    let configService: ConfigService;

    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
    };

    const mockHttpService = {
        get: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExchangeRateService,
                { provide: HttpService, useValue: mockHttpService },
                { provide: CACHE_MANAGER, useValue: mockCacheManager },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<ExchangeRateService>(ExchangeRateService);
        httpService = module.get<HttpService>(HttpService);
        cacheManager = module.get<Cache>(CACHE_MANAGER);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return cached data when available', async () => {
        const cachedData = {
            rate: 4.25,
            timestamp: Date.now() - 30000,
        };

        mockCacheManager.get.mockResolvedValue(cachedData);

        const result = await service.getExchangeRate();

        expect(mockCacheManager.get).toHaveBeenCalledWith('rate');
        expect(result).toEqual({
            fromCache: true,
            data: {
                rate: 4.25,
                secondsLeft: 30,
            },
        });
        expect(mockHttpService.get).not.toHaveBeenCalled();
    });

    it('should fetch from API when cache is empty', async () => {
        mockCacheManager.get.mockResolvedValue(null);
        mockConfigService.get
            .mockReturnValueOnce('https://api.exchange.com/rate')
            .mockReturnValueOnce('test-api-key');

        const mockApiResponse = {
            data: { exchange_rate: 4.85 },
        };

        mockHttpService.get.mockReturnValue(of(mockApiResponse));

        const result = await service.getExchangeRate();

        expect(mockHttpService.get).toHaveBeenCalledWith(
            'https://api.exchange.com/rate',
            { headers: { 'x-api-key': 'test-api-key' } }
        );
        expect(mockCacheManager.set).toHaveBeenCalledWith(
            'rate',
            { rate: 4.85, timestamp: expect.any(Number) },
            60000
        );
        expect(result).toEqual({
            fromCache: false,
            data: { rate: 4.85, secondsLeft: 60 },
        });
    });
});
