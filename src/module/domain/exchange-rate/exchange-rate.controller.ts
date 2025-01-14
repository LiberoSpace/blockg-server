import { Controller, Post, UseGuards } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { CloudSchedulerGuard } from '../../../guards/cloud-scheduler.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

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
