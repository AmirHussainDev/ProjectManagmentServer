import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CurrencyService {
  private readonly API_URL =
    'https://v6.exchangerate-api.com/v6/a5a1d3bf0310904320697798/latest/USD';

  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,

    private httpService: HttpService,
  ) {}

  async getCurrencyRates(): Promise<Record<string, number>> {
    // Check if we have currency data in the DB and if it's recent
    const currencyData = await this.currencyRepository.find({
      order: { lastUpdate: 'DESC' },
      take: 1,
    });
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    const now = new Date();

    if (
      currencyData &&
      currencyData.length &&
      now.getTime() - new Date(currencyData[0].lastUpdate).getTime() <
        oneDayInMillis
    ) {
      // Return cached data if it’s not older than a day
      return currencyData[0].conversionRates;
    } else {
      // Fetch new data from the API and update the DB
      const { data } = await lastValueFrom(this.httpService.get(this.API_URL));
      const updatedRates = data.conversion_rates;

      if (currencyData && currencyData.length) {
        // Update existing record
        currencyData[0].conversionRates = updatedRates;
        currencyData[0].lastUpdate = now;
        await this.currencyRepository.save(currencyData[0]);
      } else {
        // Insert new record
        const newCurrencyData = this.currencyRepository.create({
          conversionRates: updatedRates,
          lastUpdate: now,
        });
        await this.currencyRepository.save(newCurrencyData);
      }
      return updatedRates;
    }
  }
}
