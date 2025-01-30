import { Module } from '@nestjs/common';
import { ExchangeRateModule } from './exchange-rate.module';
import { GcpModule } from '../../../module/gcp/gcp.module';
import { ExchangeRateController } from './controllers/exchange-rate.controller';
import { ExchangeRatePublicController } from './controllers/exchange-rate.public.controller';

@Module({
  imports: [ExchangeRateModule, GcpModule],
  controllers: [ExchangeRateController, ExchangeRatePublicController],
})
export class ExchangeRateHttpModule {}
