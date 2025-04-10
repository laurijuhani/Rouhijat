import prisma from "../../utils/client";

export const seedSeasons = async () => {
  await prisma.season.createMany({
    data: [
      { id: 1, name: "Spring" },
      { id: 2, name: "Summer" },
      { id: 3, name: "Fall" },
      { id: 4, name: "Winter" },
    ]
  });

  await prisma.setting.create({
    data: {
      key: "currentSeason",
      value: "2",
   }
  });
};


export const clearSeasons = async () => {
  await prisma.season.deleteMany({});
  await prisma.setting.deleteMany({});
}; 