import { Module } from '@nestjs/common';
import { ExchangeRateModule } from './exchange-rate.module';
import { GCPModule } from 'src/module/gcp/gcp.module';

@Module({
  imports: [ExchangeRateModule, GCPModule],
})
export class ExchangeRateHttpModule {}
