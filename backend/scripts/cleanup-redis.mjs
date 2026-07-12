/**
 * cleanup-redis.mjs
 * -----------------
 * Run this once to flush stale BullMQ keys that have been eating your
 * Upstash 500k/day request quota.
 *
 * Usage (from the /backend directory):
 *   node scripts/cleanup-redis.mjs
 *
 * Make sure your .env file has REDIS_URL set.
 */

import Redis from 'ioredis';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.error('❌ REDIS_URL environment variable is not set.');
  process.exit(1);
}

const client = new Redis(redisUrl, {
  tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
  maxRetriesPerRequest: 3,
});

client.on('error', (err) => console.error('Redis error:', err));

/**
 * Delete all keys matching a pattern using SCAN (safe — never uses KEYS command).
 */
async function deleteByPattern(pattern) {
  let cursor = '0';
  let total = 0;
  do {
    const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = nextCursor;
    if (keys.length > 0) {
      await client.del(...keys);
      total += keys.length;
      process.stdout.write(`  Deleted ${keys.length} keys matching "${pattern}" (total so far: ${total})\n`);
    }
  } while (cursor !== '0');
  return total;
}

async function main() {
  console.log('🔌 Connected to Redis. Starting cleanup...\n');

  // ── BullMQ internal keys (the main culprit) ──────────────────────────────
  // These accumulate completed/failed/delayed job metadata and stalled-check
  // sorted sets that BullMQ polls constantly via evalsha scripts.
  const bullPatterns = [
    'bull:email:completed',
    'bull:email:failed',
    'bull:email:delayed',
    'bull:email:wait',
    'bull:email:active',
    'bull:email:paused',
    'bull:email:events',
    'bull:email:meta',
    'bull:email:*',   // catch-all for any remaining bull:email: subkeys
  ];

  console.log('── BullMQ keys ──────────────────────────────────────────');
  let bullTotal = 0;
  for (const pattern of bullPatterns) {
    const count = await deleteByPattern(pattern);
    bullTotal += count;
  }
  console.log(`✅ BullMQ cleanup done: ${bullTotal} keys removed.\n`);

  // ── Throttler keys (set by @nestjs/throttler-storage-redis) ─────────────
  console.log('── Throttler keys ───────────────────────────────────────');
  const throttlerCount = await deleteByPattern('THROTTLER:*');
  console.log(`✅ Throttler cleanup done: ${throttlerCount} keys removed.\n`);

  await client.quit();
  console.log('🎉 Done! Redis is now clean.');
  console.log('   The Upstash daily request counter resets at midnight UTC.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  client.disconnect();
  process.exit(1);
});
