import { Module } from '@nestjs/common';
import { ExchangeRateModule } from './exchange-rate.module';
import { GcpModule } from '../../../module/gcp/gcp.module';

@Module({
  imports: [ExchangeRateModule, GcpModule],
})
export class ExchangeRateHttpModule {}
