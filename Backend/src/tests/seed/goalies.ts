import prisma from "../../utils/client";

const goalies = [
  {
    id: 1,
    name: "Goalie A",
    nickname: "A",
    number: 30,
  },
  {
    id: 2,
    name: "Goalie B",
    nickname: "B",
  },
  {
    id: 3,
    name: "Goalie C",
    number: 32,
  },
];

const seedGoalies = async () => {
  await prisma.goalie.createMany({ data: goalies });
};

const clearGoalies = async () => {
  await prisma.goalie.deleteMany({});
};

export default { seedGoalies, clearGoalies };