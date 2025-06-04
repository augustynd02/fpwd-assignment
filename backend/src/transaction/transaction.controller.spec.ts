import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { ExchangeRateService } from '../shared/exchange-rate.service';

describe('TransactionController', () => {
	let controller: TransactionController;
	let exchangeRateService: ExchangeRateService;

	const mockExchangeRateService = {
		getExchangeRate: jest.fn().mockResolvedValue({
			data: {
				rate: 4.5,
				timestamp: Date.now()
			}
		})
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TransactionController],
			providers: [
				{
					provide: ExchangeRateService,
					useValue: mockExchangeRateService,
				},
			],
		}).compile();

		controller = module.get<TransactionController>(TransactionController);
		exchangeRateService = module.get<ExchangeRateService>(ExchangeRateService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should calculate and return transaction properly', async () => {
		const result = await controller.submitTransaction(10);

		expect(mockExchangeRateService.getExchangeRate).toHaveBeenCalled();
		expect(result.amountEUR).toBe(10);
		expect(result.amountPLN).toBe(45);
		expect(result.exchangeRate).toBe(4.5);
		expect(result.timestamp).toBeInstanceOf(Date);
	});
});
