import { Controller, Get } from '@nestjs/common';

import { ExchangeRateService } from '../services/exchange-rate.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('환율')
@Controller('blockg/public-api/v1/exchange-rate')
export class ExchangeRatePublicController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @ApiOperation({
    description: '최신 환율 가져오기',
  })
  @ApiOkResponse({
    description:
      '최신 환율 JSON 객체. USD를 1로 기준하였을 때 환율. 자세한 내용은 객체 모양참조.',
  })
  @Get('')
  async getLatestExchangeRate() {
    return await this.exchangeRateService.getLatestExchangeRate();
  }
}
