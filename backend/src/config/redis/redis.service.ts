import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

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
