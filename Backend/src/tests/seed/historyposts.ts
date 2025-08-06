import prisma from "../../utils/client";


const historyPosts = [
  {
    id: 1,
    title: "First Post",
    content: "This is the first post content.",
    order: 1,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    images: ["image1.jpg", "image2.jpg"],
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is the second post content.",
    createdAt: new Date("2023-01-02T00:00:00.000Z"),
    images: ["image3.jpg"],
  },
  {
    id: 3,
    title: "Third Post",
    content: "This is the third post content.",
    order: 3,
    createdAt: new Date("2023-01-03T00:00:00.000Z"),
    images: [],
  },
];

const seedHistoryPosts = async () => {
  await prisma.historyPost.createMany({ data: historyPosts });
}; 

const clearHistoryPosts = async () => {
  await prisma.historyPost.deleteMany({});
}; 

export default {
  seedHistoryPosts,
  clearHistoryPosts,
}; 
