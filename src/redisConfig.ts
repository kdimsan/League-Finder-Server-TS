const Redis = require("ioredis");
import { promisify } from "util";

const redis = new Redis();

function getRedis(value: string) {
  const syncRedisGet = promisify(redis.get).bind(redis);

  return syncRedisGet(value);
}

function setRedis(key: string, value: string) {
  const syncRedisSet = promisify(redis.set).bind(redis);

  return syncRedisSet(key, value);
}

redis.on("connect", () => {
  console.log("Conexão estabelecida com sucesso com o servidor Redis.");
});

// Tratar erros de conexão
redis.on("error", (err: any) => {
  console.error("Erro ao conectar com o servidor Redis:", err);
});

export { redis, getRedis, setRedis };
