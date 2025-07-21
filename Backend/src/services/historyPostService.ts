import prisma from "../utils/client";
import fs from "fs";
import path from "path";

const addHistoryPost = async (content: string, title: string) => {
  const imgRegex = /<img[^>]+src="(data:image\/[^">]+)"/g;
  let match: RegExpExecArray | null;
  const replacements: { base64: string, url: string }[] = [];

  while ((match = imgRegex.exec(content)) !== null) {
    const base64 = match[1];

    const extMatch = base64.match(/^data:image\/(\w+);base64,/);
    const ext = extMatch ? extMatch[1] : 'png';

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

    const filename = `image-${Date.now()}.${ext}`;
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

  await prisma.historyPost.create({
    data: {
      content: content,
      title: title,
    },
  });

  return { content, title };
};


const getHistoryPosts = async () => {
  return await prisma.historyPost.findMany({}); 
}; 

const updateHistoryPost = async (id: number, content: string, title: string) => {
  const post = await prisma.historyPost.findUnique({ where: { id } });
  if (!post) {
    throw new Error('Post not found');
  }

  return await prisma.historyPost.update({
    where: { id },
    data: { content, title },
  });
};

const deleteHistoryPost = async (id: number) => {
  const post = await prisma.historyPost.findUnique({ where: { id } });
  if (!post) {
    throw new Error('Post not found');
  }

  await prisma.historyPost.delete({ where: { id } });
  return post;
};

export default {
  addHistoryPost,
  getHistoryPosts,
  updateHistoryPost,
  deleteHistoryPost,
};