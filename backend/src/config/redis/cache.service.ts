import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redisService.client.get(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    } catch (err) {
      console.warn(`⚠️ Redis Cache GET error for key "${key}":`, err.message || err);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 300) {
    try {
      await this.redisService.client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (err) {
      console.warn(`⚠️ Redis Cache SET error for key "${key}":`, err.message || err);
    }
  }

  async del(key: string) {
    try {
      await this.redisService.client.del(key);
    } catch (err) {
      console.warn(`⚠️ Redis Cache DEL error for key "${key}":`, err.message || err);
    }
  }

  async deleteByPattern(pattern: string) {
    try {
      const stream = this.redisService.client.scanStream({
        match: pattern,
      });

      const pipeline = this.redisService.client.pipeline();

      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          keys.forEach((key) => {
            pipeline.del(key);
          });
        }
      });

      return new Promise((resolve) => {
        stream.on('end', async () => {
          try {
            await pipeline.exec();
          } catch (err) {
            console.warn(`⚠️ Redis Cache deleteByPattern pipeline exec error:`, err.message || err);
          }
          resolve(true);
        });

        stream.on('error', (err) => {
          console.warn(`⚠️ Redis Cache deleteByPattern stream error for pattern "${pattern}":`, err.message || err);
          resolve(false);
        });
      });
    } catch (err) {
      console.warn(`⚠️ Redis Cache deleteByPattern outer error for pattern "${pattern}":`, err.message || err);
      return false;
    }
  }

  async reset() {
    try {
      await this.redisService.client.flushall();
    } catch (err) {
      console.warn('⚠️ Redis Cache RESET error:', err.message || err);
    }
  }
}

