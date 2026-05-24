import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Named export — this is what questionWorker.ts needs
export const createRedisConnection = (): Redis => {
  const client = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    maxRetriesPerRequest: null, // required for BullMQ workers
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  client.on("connect", () => console.log("✅ Redis connected"));
  client.on("error", (err: Error) => console.error("❌ Redis error:", err.message));

  return client;
};

// Default singleton instance for general use
const redis = createRedisConnection();
export default redis;