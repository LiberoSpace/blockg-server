import { Controller, Post, UseGuards } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { CloudSchedulerGuard } from 'src/guards/cloud-scheduler.guard';

@Controller('blockg/api/v1/exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @UseGuards(CloudSchedulerGuard)
  @Post('')
  async fetchExchangeRate() {
    await this.exchangeRateService.fetchExchangeRate();
  }
}
