import { Module } from '@nestjs/common';
import { GcpService } from './gcp.service';

@Module({
  imports: [],
  providers: [GcpService],
  exports: [GcpService],
})
export class GcpModule {}
