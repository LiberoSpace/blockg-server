import { Controller, Post, UseGuards } from '@nestjs/common';

import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { CloudSchedulerGuard } from '../../../../guards/cloud-scheduler.guard';
import { ExchangeRateService } from '../services/exchange-rate.service';

@Controller('blockg/api/v1/exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @ApiExcludeEndpoint()
  @UseGuards(CloudSchedulerGuard)
  @Post('')
  async fetchExchangeRate() {
    await this.exchangeRateService.fetchExchangeRate();
  }
}
