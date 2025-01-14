import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GcpService } from '../module/gcp/gcp.service';

@Injectable()
export class CloudSchedulerGuard implements CanActivate {
  constructor(private gcpService: GcpService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers['user-agent'] === 'Google-Cloud-Scheduler') {
      const isInternalServiceRequest = await this.validateRequest(
        request.headers.authorization,
      );
      if (isInternalServiceRequest) {
        return !!request.headers['x-cloudscheduler'];
      }
      return false;
    } else {
      return false;
    }
  }

  async validateRequest(token: string) {
    let result = false;
    try {
      await this.gcpService.verifyOAuth2IdToken(token.split(' ')[1]);
      result = true;
    } catch (e) {
      console.error(e);
    }
    return result;
  }
}
