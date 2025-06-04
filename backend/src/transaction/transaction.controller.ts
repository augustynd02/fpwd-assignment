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

    // Memory storage for transactions - may be replaced with a DB query
    private transactions: Transaction[] = [];

    @Post()
    async submitTransaction(@Body('amount') amount: number) {
        const { data } = await this.exchangeRateService.getExchangeRate();

        const amountPLN = amount * data.rate;
        const timestamp = new Date();

        const transaction: Transaction = {
            amountEUR: amount,
            amountPLN: amountPLN,
            exchangeRate: data.rate,
            timestamp: timestamp
        }
        this.transactions.push(transaction);
        console.log(this.transactions);

        return transaction;
    }
}
