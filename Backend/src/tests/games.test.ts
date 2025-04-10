import request, { Response } from "supertest";
import { app } from "../index";
import stats from "./seed/stats";
import { setupTestDatabase } from "../jest.setup";
import prisma from "../utils/client";

describe("Games Router", () => {
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


  describe("GET /games", () => {
    it("should return all games", async () => {
      const response: Response = await request(app).get("/api/v1/games");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(8);
    });

    it("should return 200 and the correct game if it exists", async () => {
      const response: Response = await request(app).get("/api/v1/games/1");
      
      expect(response.status).toBe(200);
      expect(response.body.homeTeam).toBe("Team A");
      expect(response.body.points.length).toBe(2);
      expect(response.body.points[0].player.name).toBe("Player A");
      expect(response.body.points[0].player.number).toBe(10);
      expect(response.body.points[0].goals).toBe(2);
      expect(response.body.points[0].assists).toBe(1);
      expect(response.body.points[0].pm).toBe(3);
    });

    it("should return 404 if the game does not exist", async () => {
      const response: Response = await request(app).get("/api/v1/games/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("game not found");
    });
  });


  describe("GET /games/season/:id", () => {
    it("should return all games for a specific season", async () => {
      const response: Response = await request(app).get("/api/v1/games/season/1");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it("should return 404 if the season does not exist", async () => {
      const response: Response = await request(app).get("/api/v1/games/season/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("game not found");
    });

    it("should return all games for the current season", async () => {
      const response: Response = await request(app).get("/api/v1/games/season/current");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });


  describe("POST /games", () => {
    it("should create a new game", async () => {
      const newGame = {
        homeTeam: "Team Q",
        awayTeam: "Team R",
        homeScore: 3,
        awayScore: 2,
        gameDate: "2023-01-09T00:00:00.000Z",
        seasonId: 1,
      };

      const response: Response = await request(app)
        .post("/api/v1/games")
        .set("Authorization", "bearer admin")
        .send(newGame);

      expect(response.status).toBe(201);
      expect(response.body.homeTeam).toBe("Team Q");
    });

    it("should return 401 if the user is not logged in", async () => {
      const newGame = {
        homeTeam: "Team Q",
        awayTeam: "Team R",
        homeScore: 3,
        awayScore: 2,
        gameDate: "2023-01-09T00:00:00.000Z",
        seasonId: 1,
      };

      const response: Response = await request(app)
        .post("/api/v1/games")
        .send(newGame);

      expect(response.status).toBe(401);
    });
  });


  describe("PUT /games/:id", () => {
    it("should update an existing game", async () => {
      const updatedGame = {
        homeTeam: "Team A",
        awayTeam: "Team B",
        homeScore: 4,
        awayScore: 3,
        gameDate: "2023-01-10T00:00:00.000Z",
        seasonId: 1,
      };

      const response: Response = await request(app)
        .put("/api/v1/games/1")
        .set("Authorization", "bearer admin")
        .send(updatedGame);

      expect(response.status).toBe(204);
    });

    it("should return 404 if the game does not exist", async () => {
      const updatedGame = {
        homeTeam: "Team A",
        awayTeam: "Team B",
        homeScore: 4,
        awayScore: 3,
        gameDate: "2023-01-10T00:00:00.000Z",
        seasonId: 1,
      };

      const response: Response = await request(app)
        .put("/api/v1/games/999")
        .set("Authorization", "bearer admin")
        .send(updatedGame);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("game not found");
    });
  });


  describe("DELETE /games/:id", () => {
    it("should delete an existing game", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/games/1")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(204);
    });

    it("should return 404 if the game does not exist", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/games/999")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("game not found");
    });
  });
});