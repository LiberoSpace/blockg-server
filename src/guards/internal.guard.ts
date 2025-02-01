import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class InternalGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (
      request.headers['x-our-secret-power'] === 'tmddnjscksdudWkdWKdzmfhtm!'
    ) {
      return true;
    }
    return false;
  }
}
