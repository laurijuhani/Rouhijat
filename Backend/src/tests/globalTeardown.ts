import fs from "fs";
import path from "path";

const prismaDir = path.resolve(__dirname, "../../prisma");

const globalTeardown = async () => {
  fs.readdirSync(prismaDir).forEach(file => {
    if (file.startsWith("test-")) {
      const fullPath = path.join(prismaDir, file);
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.warn(`⚠️ Failed to delete ${file}:`, err);
      }
    }
  });
};

export default globalTeardown;