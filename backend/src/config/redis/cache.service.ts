import { Injectable } from '@nestjs/common';

import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisService.client.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  async set(key: string, value: any, ttl: number = 300) {
    await this.redisService.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string) {
    await this.redisService.client.del(key);
  }

  async deleteByPattern(pattern: string) {
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

    return new Promise((resolve, reject) => {
      stream.on('end', async () => {
        await pipeline.exec();

        resolve(true);
      });

      stream.on('error', reject);
    });
  }

  async reset() {
    await this.redisService.client.flushall();
  }
}
