import prisma from "../utils/client";
import fs from "fs";
import path from "path";
import {v4 as uuidv4} from "uuid";

const addHistoryPost = async (content: string, title: string) => {
  if (!content || !title) {
    throw new Error('Missing required fields');
  }

  const { content: updatedContent, images: replacements } = addImagesToPost(content);

  return await prisma.historyPost.create({
    data: {
      content: updatedContent,
      title: title,
      images: replacements,
    },
  });
};


const getHistoryPosts = async () => {
  const noOrderPosts = await prisma.historyPost.findMany({
    where: { order: null },
    orderBy: { createdAt: 'desc' },
  });

  const orderedPosts = await prisma.historyPost.findMany({
    where: { NOT: { order: null } },
    orderBy: { order: 'asc' },
  });

  return [...noOrderPosts, ...orderedPosts];
}; 

const getHistoryPostById = async (id: number) => {
  return await prisma.historyPost.findUnique({ where: { id } });
};

const updateHistoryPost = async (id: number, content: string, title: string) => {
  const post = await prisma.historyPost.findUnique({ where: { id } });
  if (!post) {
    throw new Error('Post not found');
  }

  deleteImages(post.images);

  const { content: updatedContent, images: replacements } = addImagesToPost(content);

  return await prisma.historyPost.update({
    where: { id },
    data: { content: updatedContent, title, images: replacements },
  });
};

const updateHistoryPostsOrder = async (orderData: { id: number; order: number }[]) => {
  const updates = orderData.map(({ id, order }) =>
    prisma.historyPost.update({
      where: { id },
      data: { order },
    })
  );
  await Promise.all(updates);
};

const deleteHistoryPost = async (id: number) => {
  const post = await prisma.historyPost.findUnique({ where: { id } });
  if (!post) {
    throw new Error('Post not found');
  }

  deleteImages(post.images);

  await prisma.historyPost.delete({ where: { id } });
  return post;
};


const addImagesToPost = (content: string) => {
  const imgRegex = /<img[^>]+src="(data:image\/[^">]+)"/g;
  let match: RegExpExecArray | null;
  const replacements: { base64: string, url: string }[] = [];
  const tempId = uuidv4() as string;

  while ((match = imgRegex.exec(content)) !== null) {
    const base64 = match[1];

    const extMatch = base64.match(/^data:image\/(\w+);base64,/);
    const ext = extMatch ? extMatch[1] : 'png';

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

    const filename = `image-${tempId}-${Date.now()}.${ext}`;
    const filePath = path.join(__dirname, "..", "..", "media/posts", filename);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, base64Data, 'base64');

    // TODO: Check if the url is correct
    const url = `/media/posts/${filename}`;
    replacements.push({ base64, url });
  }

  replacements.forEach(({ base64, url }) => {
    content = content.replace(base64, url);
  });

  return { content, images: replacements.map(r => r.url) };
};


const deleteImages = (images: string[]) => {
  images.forEach(image => {
    const filePath = path.join(__dirname, "..", "..", "media/posts", image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

export default {
  addHistoryPost,
  getHistoryPosts,
  getHistoryPostById,
  updateHistoryPost,
  updateHistoryPostsOrder,
  deleteHistoryPost,
};