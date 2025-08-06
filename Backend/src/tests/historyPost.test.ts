import request, { Response } from "supertest";
import { app } from "../index";
import historyposts from "./seed/historyposts";
import { setupTestDatabase } from "../jest.setup";
import prisma from "../utils/client";

describe("HistoryPosts Router", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await historyposts.clearHistoryPosts();
    await historyposts.seedHistoryPosts();
  });

  afterAll(async () => {
    await historyposts.clearHistoryPosts();
    await prisma.$disconnect();
  });


  describe("GET /history-posts", () => {
    it("should return all history posts", async () => {
      const response: Response = await request(app).get("/api/v1/internal/history-posts");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, title: "First Post" }),
          expect.objectContaining({ id: 2, title: "Second Post" }),
          expect.objectContaining({ id: 3, title: "Third Post" }),
        ])
      );
      expect(response.body.length).toBe(3);
    });

    it("Public path should require authentication", async () => {
      const response: Response = await request(app).get("/api/v1/public/history-posts");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

    it("should return 404 for non-existing post", async () => {
      const response: Response = await request(app)
        .get("/api/v1/public/history-posts/999")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Post not found");
    });

    it("should return a specific post by ID", async () => {
      const response: Response = await request(app)
        .get("/api/v1/public/history-posts/1")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe("First Post");
      expect(response.body.content).toBe("This is the first post content.");
    });
  });

  describe("POST /history-posts", () => {
    it("should create a new history post", async () => {
      const newPost = {
        title: "New Post",
        content: "This is a new post content.",
      };

      const response: Response = await request(app)
        .post("/api/v1/public/history-posts")
        .set("Authorization", "bearer admin")
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
    });

    it("should return 400 for missing fields", async () => {
      const response: Response = await request(app)
        .post("/api/v1/public/history-posts")
        .set("Authorization", "bearer admin")
        .send({ title: "Incomplete Post" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("missing required fields");
    });

    it("should return 401 if user is not authenticated", async () => {
      const newPost = {
        title: "Unauthorized Post",
        content: "This post should not be created.",
      };

      const response: Response = await request(app)
        .post("/api/v1/public/history-posts")
        .send(newPost);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });

  describe("POST /history-posts/reorder", () => {
    it("should reorder history posts", async () => {
      const reorderData = [
        { id: 1, order: 2 },
        { id: 2, order: 1 },
        { id: 3, order: 3 },
      ];

      const response: Response = await request(app)
        .post("/api/v1/public/history-posts/reorder")
        .set("Authorization", "bearer admin")
        .send(reorderData);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Order updated successfully");

      // Verify the order was updated
      const postsResponse: Response = await request(app).get("/api/v1/internal/history-posts");

      expect(postsResponse.status).toBe(200);
      expect(postsResponse.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, order: 2 }),
          expect.objectContaining({ id: 2, order: 1 }),
          expect.objectContaining({ id: 3, order: 3 }),
        ])
      );
    });
  });


  describe("PUT /history-posts/:id", () => {
    it("should update an existing history post", async () => {
      const updatedPost = {
        content: "Updated content for first post.",
        title: "Updated First Post",
      };

      const response: Response = await request(app)
        .put("/api/v1/public/history-posts/1")
        .set("Authorization", "bearer admin")
        .send(updatedPost);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe(updatedPost.content);
      expect(response.body.title).toBe(updatedPost.title);
    });

    it("should return 400 for missing fields", async () => {
      const response: Response = await request(app)
        .put("/api/v1/public/history-posts/1")
        .set("Authorization", "bearer admin")
        .send({ title: "Partial Update" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("missing required fields");
    });

    it("should return 404 for non-existing post", async () => {
      const response: Response = await request(app)
        .put("/api/v1/public/history-posts/999")
        .set("Authorization", "bearer admin")
        .send({ title: "non-existing post", content: "This post does not exist." });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Post not found");
    });

    it("should return 401 if user is not authenticated", async () => {
      const updatedPost = {
        content: "Unauthorized update attempt.",
        title: "Unauthorized Post",
      };

      const response: Response = await request(app)
        .put("/api/v1/public/history-posts/1")
        .send(updatedPost);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });

  describe("DELETE /history-posts/:id", () => {
    it("should delete an existing history post", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/public/history-posts/1")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe("First Post");
    });

    it("should return 404 for non-existing post", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/public/history-posts/999")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Post not found");
    });

    it("should return 401 if user is not authenticated", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/public/history-posts/1");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });
});