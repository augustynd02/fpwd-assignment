import { Controller, Get } from '@nestjs/common';
import { ExchangeRateService } from '../shared/exchange-rate.service';


@Controller('exchange')
export class ExchangeController {
    constructor(private readonly exchangeRateService: ExchangeRateService) { }

    @Get()
    async fetchExchangeRate() {
        return this.exchangeRateService.getExchangeRate();
    }
}
