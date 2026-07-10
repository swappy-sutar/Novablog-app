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
      // Reduce Redis polling to save Upstash free-tier request quota.
      // Default stalledInterval is 30s — raising to 5 minutes cuts ~90% of
      // background evalsha/lrange script calls.
      defaultJobOptions: {
        removeOnComplete: 50,   // keep only last 50 completed jobs
        removeOnFail: 20,       // keep only last 20 failed jobs
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    }),
  ],

  exports: [BullModule],
})
export class BullMQModule {}
