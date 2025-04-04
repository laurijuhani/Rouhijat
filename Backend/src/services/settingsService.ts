import redisClient from "../utils/redisClient";
import prisma from "../utils/client";
import { Setting } from "@prisma/client";


const getSetting = async (key: string): Promise<Setting | null> => {
  const cachedSetting = await redisClient.get(key);
  if (cachedSetting) {
    return JSON.parse(cachedSetting) as Setting;
  }

  const setting = await prisma.setting.findUnique({
    where: {
      key,
    },
  });

  if (setting) {
    void redisClient.set(key, JSON.stringify(setting), {
      EX: 3600,
    });
  }

  return setting;
}; 


const setSetting = async (key: string, value: string, keysToDelete: string[]): Promise<Setting> => {
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  void redisClient.set(key, JSON.stringify(setting), {
    EX: 3600,
  });

  for (const keyToDelete of keysToDelete) {
    void redisClient.del(keyToDelete);
  }

  return setting;
};

const deleteSetting = async (key: string): Promise<void> => {
  await prisma.setting.delete({
    where: { key },
  });

  void redisClient.del(key);
};

export default {
  getSetting,
  setSetting,
  deleteSetting,
};