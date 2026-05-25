import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const createRedisConnection = (): Redis => {
  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  client.on("connect", () => console.log("✅ Redis connected"));
  client.on("error", (err: Error) => console.error("❌ Redis error:", err.message));

  return client;
};

const redis = createRedisConnection();
export default redis;
