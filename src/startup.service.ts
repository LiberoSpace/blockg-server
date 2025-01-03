import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class StartupService implements OnModuleInit, OnApplicationBootstrap {
  private readonly logger = new Logger(StartupService.name);
  private startTime: number;
  constructor() {
    this.logger.debug('StartupService constructor');
    this.startTime = Date.now();
  }

  onModuleInit() {}

  onApplicationBootstrap() {
    const endTime = Date.now();
    const startupTime = endTime - this.startTime;
    this.logger.debug(`NestJS Application startup time: ${startupTime}ms`);
  }
}
