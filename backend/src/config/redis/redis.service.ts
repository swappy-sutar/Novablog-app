import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    const commonOptions = {
      enableOfflineQueue: false,
      maxRetriesPerRequest: 3,
      connectTimeout: 2000,
      commandTimeout: 1000,
    };

    if (redisUrl) {
      this.redisClient = new Redis(redisUrl, {
        ...commonOptions,
        tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
      });
    } else {
      this.redisClient = new Redis({
        ...commonOptions,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD || undefined,
      });
    }

    this.redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });

    this.redisClient.on('error', (error) => {
      console.log('❌ Redis error:', error);
    });
  }

  get client() {
    return this.redisClient;
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
