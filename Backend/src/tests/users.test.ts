import request, { Response } from "supertest";
import prisma from "../utils/client";
import { app }  from "../index"; 
import { setupTestDatabase } from "../jest.setup";


describe("Users Router", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe("PUT /changerole", () => {
    it("should return 401 if the user is not authorized", async () => {
      const response: Response = await request(app)
        .put("/api/v1/users/changerole")
        .send({ id: "1", role: "admin" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

    it("should return 400 if parameters are missing", async () => {
      const response = await request(app)
        .put("/api/v1/users/changerole")
        .set("Authorization", "bearer admin")
        .send({}); // Missing `id` and `role`

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing parameters");
    });

    it("should return 404 if the user to modify is not found", async () => {
      const response = await request(app)
        .put("/api/v1/users/changerole")
        .set("Authorization", "bearer admin")
        .send({ id: "nonexistent-id", role: "admin" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });

    it("should update the user role if authorized", async () => {
      // Create a test user in the database
      const testUser = await prisma.user.create({
        data: {
          id: "2",
          email: "test2@test.com",
          name: "Test User 2",
          role: "user",
          picture: "https://example.com/picture2.jpg",
        },
      });

      const response = await request(app)
        .put("/api/v1/users/changerole")
        .set("Authorization", "bearer admin")
        .send({ id: testUser.id, role: "admin" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Role updated");

      // Verify the role was updated in the database
      const updatedUser = await prisma.user.findUnique({ where: { id: testUser.id } });
      expect(updatedUser?.role).toBe("admin");
    });
  });

  describe("GET /", () => {
    it("should return 401 if the user is not authenticated", async () => {
      const response = await request(app).get("/api/v1/users");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

    it("should return a list of users", async () => {
      // Create test users in the database
      await prisma.user.createMany({
        data: [
          { id: "1", email: "user1@test.com", name: "User 1", role: "user", picture: "https://example.com/picture1.jpg" },
          { id: "2", email: "user2@test.com", name: "User 2", role: "admin", picture: "https://example.com/picture2.jpg" },
        ],
      });

      const response = await request(app)
                              .get("/api/v1/users")
                              .set("Authorization", "bearer admin");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: "1", email: "user1@test.com", name: "User 1", role: "user", picture: "https://example.com/picture1.jpg", createdAt: expect.any(String), updatedAt: expect.any(String) },
        { id: "2", email: "user2@test.com", name: "User 2", role: "admin", picture: "https://example.com/picture2.jpg", createdAt: expect.any(String), updatedAt: expect.any(String) },
      ]);
    });
  });
});