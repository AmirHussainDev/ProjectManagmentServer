import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('api/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('rates')
  async getCurrencyRates() {
    return this.currencyService.getCurrencyRates();
  }
}
