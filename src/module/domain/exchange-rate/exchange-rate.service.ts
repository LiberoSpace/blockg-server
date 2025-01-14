import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from './exchange-rate.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { env } from 'process';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
  ) {}

  async fetchExchangeRate() {
    const response = await axios
      .get(`/v6/${env.EXCHANGE_RATE_API_KEY}/latest/USD`, {
        baseURL: 'https://v6.exchangerate-api.com',
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    const responseBody = response.data;
    await this.exchangeRateRepository.insert({
      date: new Date(responseBody.time_last_update_utc),
      conversionRate: responseBody.conversion_rates,
    });
  }

  async getLatestExchangeRate(): Promise<ExchangeRate> {
    const latestExchangeRate = (
      await this.exchangeRateRepository.find({
        order: { date: 'DESC' },
        take: 1,
      })
    )[0];

    if (!latestExchangeRate) {
      new InternalServerErrorException('하나의 환율도 없습니다.');
    }
    return latestExchangeRate;
  }
}
