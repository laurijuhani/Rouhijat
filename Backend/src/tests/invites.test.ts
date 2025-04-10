import { app } from "../index";
import request, { Response } from "supertest";
import prisma from "../utils/client";
import { setupTestDatabase } from "../jest.setup";

describe("Invites Router", () => {
  beforeAll(async () => {
      await setupTestDatabase();
    });
  beforeEach(async () => {
    await prisma.invitedEmail.deleteMany();
  });
  afterAll(async () => {
    await prisma.invitedEmail.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET /invites", () => {
    it("should return all invites", async () => {
      const response: Response = await request(app)
        .get("/api/v1/invites")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    it("should return 401 if unauthorized", async () => {
      const response: Response = await request(app)
        .get("/api/v1/invites");

      expect(response.status).toBe(401);
    });
  });


  describe("POST /invites", () => {
    it("should create a new invite", async () => {
      const newInvite = {
        email: "test@test.com"
      };

      const response: Response = await request(app)
        .post("/api/v1/invites")
        .set("Authorization", "bearer admin")
        .send(newInvite);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Invitation sent");
      expect(response.body).toHaveProperty("message");
    });

    it("should return 401 if unauthorized", async () => {
      const newInvite = {
        email: "test@test.com"
      };

      const response: Response = await request(app)
        .post("/api/v1/invites")
        .send(newInvite);

      expect(response.status).toBe(401);
    });
  });


  describe("DELETE /invites/:email", () => {
    it("should delete an invite", async () => {
      await prisma.invitedEmail.create({
        data: {
          email: "test@test.com",
        }
      });
      
      const response: Response = await request(app)
        .delete("/api/v1/invites/test@test.com")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(204);
    });

    it("should return 401 if unauthorized", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/invites/test@test.com");

      expect(response.status).toBe(401);
    });
  });
  

});