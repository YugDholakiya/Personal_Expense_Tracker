const { createClient } = require("redis");
require("dotenv").config();

// Production: set REDIS_URL (e.g. from Upstash or Redis Cloud)
// Local dev: uses REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
const redisClient = process.env.REDIS_URL
    ? createClient({ url: process.env.REDIS_URL })
    : createClient({
        password: process.env.REDIS_PASSWORD || undefined,
        socket: {
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
        },
    });

module.exports = redisClient;
