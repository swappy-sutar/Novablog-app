import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    const configService = {
      get: jest.fn().mockReturnValue('test-jwt-secret'),
    } as unknown as ConfigService;

    strategy = new JwtStrategy(configService);
  });

  it('should extract id, email, and role from JWT payload', async () => {
    const payload = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'USER',
      iat: 1234567890,
      exp: 1234567899,
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      id: 'user-123',
      email: 'test@example.com',
      role: 'USER',
    });
  });

  it('should not include extra fields from payload', async () => {
    const payload = {
      id: 'user-456',
      email: 'admin@example.com',
      role: 'ADMIN',
      iat: 1234567890,
      exp: 1234567899,
      extraField: 'should-be-excluded',
    };

    const result = await strategy.validate(payload);

    expect(result).not.toHaveProperty('iat');
    expect(result).not.toHaveProperty('exp');
    expect(result).not.toHaveProperty('extraField');
    expect(Object.keys(result)).toEqual(['id', 'email', 'role']);
  });
});
