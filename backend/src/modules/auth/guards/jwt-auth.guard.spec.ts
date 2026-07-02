import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  const mockContext = {} as ExecutionContext;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should throw UnauthorizedException when no auth token is provided', () => {
    expect(() =>
      guard.handleRequest(null, null, { message: 'No auth token' }, mockContext),
    ).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when no authorization token was found', () => {
    expect(() =>
      guard.handleRequest(
        null,
        null,
        { message: 'No authorization token was found' },
        mockContext,
      ),
    ).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when JWT is expired', () => {
    expect(() =>
      guard.handleRequest(null, null, { message: 'jwt expired' }, mockContext),
    ).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when token is invalid', () => {
    expect(() =>
      guard.handleRequest(
        null,
        null,
        { message: 'invalid token', name: 'JsonWebTokenError' },
        mockContext,
      ),
    ).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user is null (generic)', () => {
    expect(() =>
      guard.handleRequest(null, null, null, mockContext),
    ).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when there is an error', () => {
    expect(() =>
      guard.handleRequest(new Error('some error'), null, null, mockContext),
    ).toThrow(UnauthorizedException);
  });

  it('should return the user when authentication succeeds', () => {
    const user = { id: 'user-1', email: 'test@test.com', role: 'USER' };
    const result = guard.handleRequest(null, user, null, mockContext);
    expect(result).toEqual(user);
  });
});
