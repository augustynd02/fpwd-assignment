import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeRateService } from '../shared/exchange-rate.service';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let exchangeRateService: ExchangeRateService;

  const mockExchangeRateService = {
    getExchangeRate: jest.fn().mockResolvedValue({
      fromCache: false,
      data: {
        rate: 4.5,
        timestamp: 1749065855786, // random mock timestamp
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [
        {
          provide: ExchangeRateService,
          useValue: mockExchangeRateService,
        },
      ],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    exchangeRateService = module.get<ExchangeRateService>(ExchangeRateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch exchange rate', async () => {
    const result = await controller.fetchExchangeRate();

    expect(exchangeRateService.getExchangeRate).toHaveBeenCalled();
    expect(result).toEqual({
      fromCache: false,
      data: {
        rate: 4.5,
        timestamp: 1749065855786,
      },
    });
  });
});
