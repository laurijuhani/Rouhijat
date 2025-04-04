import redisClient from "./redisClient";

const deleteCacheForPattern = async (pattern: string) => {
  let offset = 0;

  do {
    const { cursor, keys } = await redisClient.scan(offset, {
      MATCH: pattern,
      COUNT: 50,
    });

    offset = cursor;

    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redisClient.del(key)));
    }
  } while (offset !== 0);
};

export default deleteCacheForPattern;