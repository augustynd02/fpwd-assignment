import { Controller, Post, Body } from '@nestjs/common';
import { ExchangeRateService } from '../shared/exchange-rate.service';

interface Transaction {
  amountEUR: number;
  amountPLN: number;
  exchangeRate: number;
  timestamp: Date;
}

@Controller('transaction')
export class TransactionController {
    constructor(private readonly exchangeRateService: ExchangeRateService) { }

    @Post()
    async submitTransaction(@Body('amount') amount: number) {
        const { rate } = await this.exchangeRateService.getExchangeRate();

        const amountPLN = amount * rate;
        const timestamp = new Date();

        // TODO: store transaction
        const transaction: Transaction = {
            amountEUR: amount,
            amountPLN: amountPLN,
            exchangeRate: rate,
            timestamp: timestamp
        }

        return transaction;
    }
}
