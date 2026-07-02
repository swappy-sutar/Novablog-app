import { ExecutionContext } from '@nestjs/common';
import { OptionalJwtAuthGuard } from './optional-jwt.guard';

describe('OptionalJwtAuthGuard', () => {
  let guard: OptionalJwtAuthGuard;
  const mockContext = {} as ExecutionContext;

  beforeEach(() => {
    guard = new OptionalJwtAuthGuard();
  });

  it('should return null when authentication fails (no error thrown)', () => {
    const result = guard.handleRequest(null, null, null, mockContext);
    expect(result).toBeNull();
  });

  it('should return null when there is an error', () => {
    const result = guard.handleRequest(new Error('fail'), null, null, mockContext);
    expect(result).toBeNull();
  });

  it('should return the user when authentication succeeds', () => {
    const user = { id: 'user-1', email: 'test@test.com', role: 'USER' };
    const result = guard.handleRequest(null, user, null, mockContext);
    expect(result).toEqual(user);
  });
});
