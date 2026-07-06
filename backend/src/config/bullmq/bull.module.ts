import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

const getRedisConnectionOptions = () => {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const parsed = new URL(redisUrl);
      return {
        host: parsed.hostname,
        port: Number(parsed.port),
        username: parsed.username || undefined,
        password: parsed.password || undefined,
        tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
      };
    } catch (e) {
      console.error('Failed to parse REDIS_URL, falling back to host/port', e);
    }
  }
  return {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined,
  };
};

@Module({
  imports: [
    BullModule.forRoot({
      connection: getRedisConnectionOptions(),
    }),
  ],

  exports: [BullModule],
})
export class BullMQModule {}
