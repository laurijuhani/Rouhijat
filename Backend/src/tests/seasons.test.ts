import request, { Response } from "supertest";
import { app }  from "../index"; 
import { clearSeasons, seedSeasons } from "./seed/seasons";
import { setupTestDatabase } from "../jest.setup";
import prisma from "../utils/client";

describe("Seasons Router", () => {
  beforeAll(async () => {
      await setupTestDatabase();
    });
  beforeEach(async () => {
    await clearSeasons();
    await seedSeasons();
  });

  afterAll(async () => {
    await clearSeasons();
    await prisma.$disconnect();
  });


  describe("GET /seasons", () => {
    it("should return all seasons", async () => {
      const response: Response = await request(app).get("/api/v1/seasons");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[1].active).toBe(true);
      expect(response.body[0].name).toBe("Spring");
    });


    it("should return 200 and the correct season if it exists", async () => {
      const response: Response = await request(app).get("/api/v1/seasons/1");

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Spring");
    });

    it("should return 404 if the season does not exist", async () => {
      const response: Response = await request(app).get("/api/v1/seasons/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("season not found");
    });

    it("should return 200 and the current season", async () => {
      const response: Response = await request(app).get("/api/v1/seasons/current");

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Summer");
    });


    it("Should add a new season if the user is logged in", async () => {
      const newSeason = {
        name: "Test Season",
      };

      const response: Response = await request(app)
        .post("/api/v1/seasons")
        .set("Authorization", "bearer admin")
        .send(newSeason);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Test Season");
    });



    it("Should return 401 if the user is not logged in", async () => {
      const newSeason = {
        name: "Test Season",
      };

      const response: Response = await request(app)
        .post("/api/v1/seasons")
        .send(newSeason);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

  });
});