import request, { Response } from "supertest";
import { app } from "../index";
import stats from "./seed/stats";
import { setupTestDatabase } from "../jest.setup";
import prisma from "../utils/client";

describe("Points Router", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });
  beforeEach(async () => {
    await stats.clearStats();
    await stats.seedStats();
  }); 

  afterAll(async () => {
    await stats.clearStats();
    await prisma.$disconnect();
  });


  describe("GET /points/:id", () => {
    it("should return all points for a specific game", async () => {
      const response: Response = await request(app).get("/api/v1/public/points/1")
      .set("Authorization", "bearer admin");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].playerId).toBe(1);
      expect(response.body[0].goals).toBe(2);
      expect(response.body[0].assists).toBe(1);
      expect(response.body[0].pm).toBe(3);
    });

    it("should return 404 if the game does not exist", async () => {
      const response: Response = await request(app).get("/api/v1/public/points/999")
      .set("Authorization", "bearer admin"); 

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("game not found");
    });
  });

  describe("POST /points/:id", () => {
    it("should add points to a game", async () => {
      await prisma.game.create({
        data: {
          id: 10,
          homeTeam: "Test",
          awayTeam: "Test 2",
          homeScore: 3,
          awayScore: 2,
          gameDate: new Date("2023-01-01T00:00:00.000Z"),
          seasonId: 1,
        },
      }); 


      const playerData = [
        { playerId: 1, goals: 2, assists: 1, pm: 3 },
        { playerId: 2, goals: 0, assists: 1, pm: 1 },
      ];

      const response: Response = await request(app)
        .post("/api/v1/public/points/10")
        .set("Authorization", "bearer admin")
        .send({ playerData });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("points added");

      const points = await prisma.point.findMany({
        where: { gameId: 10 },
      });

      expect(points.length).toBe(2);
    });

    it("should return 400 if playerData is missing", async () => {
      const response: Response = await request(app)
        .post("/api/v1/public/points/1")
        .set("Authorization", "bearer admin")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("missing required fields");
    });

    it("should return 401 if not authenticated", async () => {
      const playerData = [
        { playerId: 1, goals: 2, assists: 1, pm: 3 },
        { playerId: 2, goals: 0, assists: 1, pm: 1 },
      ];

      const response: Response = await request(app)
        .post("/api/v1/public/points/1")
        .send({ playerData });

      expect(response.status).toBe(401);
    });

    it("should return 404 if the game does not exist", async () => {
      const playerData = [
        { playerId: 1, goals: 2, assists: 1, pm: 3 },
        { playerId: 2, goals: 0, assists: 1, pm: 1 },
      ];

      const response: Response = await request(app)
        .post("/api/v1/public/points/999")
        .set("Authorization", "bearer admin")
        .send({ playerData });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("game not found");
    });
  });

  describe("PUT /points/:id", () => {
    it("should update points for a game", async () => {
      const playerData = [
        { playerId: 1, goals: 3, assists: 2, pm: 4 },
        { playerId: 2, goals: -1, assists: -1, pm: -1 }, // This will be deleted
      ];

      const response: Response = await request(app)
        .put("/api/v1/public/points/1")
        .set("Authorization", "bearer admin")
        .send({ playerData });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("points updated");

      const points = await prisma.point.findMany({
        where: { gameId: 1 },
      });

      expect(points.length).toBe(1);
    });

    it("should return 400 if playerData is missing", async () => {
      const response: Response = await request(app)
        .put("/api/v1/public/points/1")
        .set("Authorization", "bearer admin")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("missing required fields");
    });

    it("should return 401 if not authenticated", async () => {
      const playerData = [
        { playerId: 1, goals: 3, assists: 2, pm: 4 },
        { playerId: 2, goals: -1, assists: -1, pm: -1 },
      ];

      const response: Response = await request(app)
        .put("/api/v1/public/points/1")
        .send({ playerData });

      expect(response.status).toBe(401);
    });

    it("should return 404 if the game does not exist", async () => {
      const playerData = [
        { playerId: 1, goals: 3, assists: 2, pm: 4 },
        { playerId: 2, goals: -1, assists: -1, pm: -1 },
      ];

      const response: Response = await request(app)
        .put("/api/v1/public/points/999")
        .set("Authorization", "bearer admin")
        .send({ playerData });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("game not found");
    });
  });
});