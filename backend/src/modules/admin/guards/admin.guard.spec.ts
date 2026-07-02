import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  const createMockContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('should allow access for ADMIN role', () => {
    const context = createMockContext({ id: 'admin-1', role: 'ADMIN' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException for USER role', () => {
    const context = createMockContext({ id: 'user-1', role: 'USER' });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user is null', () => {
    const context = createMockContext(null);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user is undefined', () => {
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
