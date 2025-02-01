import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class InternalGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers['user-agent'] === 'tmddnjscksdudWkdWKdzmfhtm!') {
      return true;
    }
    return false;
  }
}
