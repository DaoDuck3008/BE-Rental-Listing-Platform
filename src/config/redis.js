import Redis from "ioredis";

let redis;

export const initRedis = () => {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy(times) {
      return Math.min(times * 100, 2000);
    },
  });

  redis.on("connect", () => {
    console.log(">>> Redis connected");
  });

  redis.on("error", (error) => {
    console.error(">>> Redis connection error: ", error);
  });

  return redis;
};

export const getRedis = () => {
  if (!redis) {
    throw new Error("Redis not initialized.");
  }

  return redis;
};
