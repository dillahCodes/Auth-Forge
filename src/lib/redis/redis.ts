import { createClient } from "redis";
import "server-only";

export const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("connect", () => console.info("Redis Client Connected"));
client.on("error", (err) => console.info("Redis Client Error", err));

export async function getRedis() {
  if (!client.isOpen) await client.connect();
  return client;
}
