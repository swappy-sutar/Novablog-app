import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException({
        success: false,
        message: 'Forbidden resource: Administrator access required',
      });
    }
    return true;
  }
}
