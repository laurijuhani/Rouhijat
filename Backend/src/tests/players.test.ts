import request, { Response } from "supertest";
import { app } from "../index";
import stats from "./seed/stats";
import { setupTestDatabase } from "../jest.setup";
import prisma from "../utils/client";

describe("Players Router", () => {
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


  describe("GET /players/season/:id", () => {
    it("should return all players for a specific season", async () => {
      const response: Response = await request(app).get("/api/v1/players/season/1");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0].name).toBe("Player A");
      expect(response.body[0].nickname).toBe("A");
      expect(response.body[0].number).toBe(10);
      expect(response.body[0].points.goals).toBe(3);
      expect(response.body[0].points.pm).toBe(4);
      expect(response.body[0].games).toBe(2);
    });

    it("should return 404 if the season does not exist", async () => {
      const response: Response = await request(app).get("/api/v1/players/season/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("season not found");
    });
  });

  describe("GET /players/:id", () => {
    it("should return a player with all seasons stats", async () => {
      const response: Response = await request(app).get("/api/v1/players/2");

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Player B");
      expect(response.body.nickname).toBe("B");
      expect(response.body.number).toBe(11);
      expect(response.body.seasons.length).toBe(4);
      expect(response.body.seasons[0].seasonName).toBe("Spring");
      expect(response.body.seasons[0].games).toBe(2);
      expect(response.body.seasons[0].points.goals).toBe(1);
      expect(response.body.seasons[0].points.pm).toBe(2);
    });

    it("should return 404 if the player does not exist", async () => {
      const response: Response = await request(app).get("/api/v1/players/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("player not found");
    });
  });

  describe("POST /players", () => {
    it("should create a new player", async () => {
      const newPlayer = {
        name: "New Player",
        nickname: "NP",
        number: 99,
      };

      const response: Response = await request(app)
        .post("/api/v1/players")
        .set("Authorization", "bearer admin")
        .send(newPlayer);

      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
    });

    it ("should return 401 if not authenticated", async () => {
      const newPlayer = {
        name: "New Player",
        nickname: "NP",
        number: 99,
      };
      const response: Response = await request(app)
        .post("/api/v1/players")
        .send(newPlayer);
      expect(response.status).toBe(401);
    });

    it("should return 400 if required fields are missing", async () => {
      const newPlayer = {
        nickname: "NP",
        number: 99,
      };

      const response: Response = await request(app)
        .post("/api/v1/players")
        .set("Authorization", "bearer admin")
        .send(newPlayer);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("missing required fields");
    });
  });



  describe("DELETE /players/:id", () => {
    it("should delete a player", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/players/2")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(204);
    });

    it("should return 401 if not authenticated", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/players/2");

      expect(response.status).toBe(401);
    });

    it("should return 404 if the player does not exist", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/players/999")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("player not found");
    });
  });


  describe("PUT /players/:id", () => {
    it("should update a player", async () => {
      const updatedPlayer = {
        name: "Updated Player",
        nickname: "UP",
        number: 88,
      };

      const response: Response = await request(app)
        .put("/api/v1/players/2")
        .set("Authorization", "bearer admin")
        .send(updatedPlayer);

      expect(response.status).toBe(204);
    });

    it("should return 401 if not authenticated", async () => {
      const updatedPlayer = {
        name: "Updated Player",
        nickname: "UP",
        number: 88,
      };

      const response: Response = await request(app)
        .put("/api/v1/players/2")
        .send(updatedPlayer);

      expect(response.status).toBe(401);
    });

    it("should return 404 if the player does not exist", async () => {
      const updatedPlayer = {
        name: "Updated Player",
        nickname: "UP",
        number: 88,
      };

      const response: Response = await request(app)
        .put("/api/v1/players/999")
        .set("Authorization", "bearer admin")
        .send(updatedPlayer);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("player not found");
    });
  });
});