import request, { Response } from "supertest";
import { app } from "../index";
import goalies from "./seed/goalies";
import { setupTestDatabase } from "../jest.setup";
import prisma from "../utils/client";


describe("Goalies Router", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });
  beforeEach(async () => {
    await goalies.clearGoalies();
    await goalies.seedGoalies();
  });

  afterAll(async () => {
    await goalies.clearGoalies();
    await prisma.$disconnect();
  });

  describe("GET /goalies", () => {
    it("should return all goalies", async () => {
      const response: Response = await request(app).get("/api/v1/goalies");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body[0].name).toBe("Goalie A");
      expect(response.body[0].nickname).toBe("A");
      expect(response.body[0].number).toBe(30);
    });
  });

  describe("GET /goalies/:id", () => {
    it("should return a goalie by id", async () => {
      const response: Response = await request(app).get("/api/v1/goalies/2");

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Goalie B");
      expect(response.body.nickname).toBe("B");
      expect(response.body.number).toBeNull();
    });

    it("should return 404 if the goalie does not exist", async () => {
      const response: Response = await request(app).get("/api/v1/goalies/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("goalie not found");
    });

    it("should return 400 if the id is not a number", async () => {
      const response: Response = await request(app).get("/api/v1/goalies/abc");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("malformatted id");
    });
  });


  describe("POST /goalies", () => {
    it("should create a new goalie", async () => {
      const newGoalie = {
        name: "Goalie D",
        nickname: "D",
        number: 35,
      };

      const response: Response = await request(app)
        .post("/api/v1/goalies")
        .set("Authorization", "bearer admin")
        .send(newGoalie);

      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
    });

    it("should return 400 if the name is missing", async () => {
      const newGoalie = {
        nickname: "D",
        number: 35,
      };

      const response: Response = await request(app)
        .post("/api/v1/goalies")
        .set("Authorization", "bearer admin")
        .send(newGoalie);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("name missing");
    });

    it("should return 401 if not authenticated", async () => {
      const newGoalie = {
        name: "Goalie D",
        nickname: "D",
        number: 35,
      };

      const response: Response = await request(app)
        .post("/api/v1/goalies")
        .send(newGoalie);

      expect(response.status).toBe(401);
    });
  });

  describe("PUT /goalies/:id", () => {
    it("should update a goalie", async () => {
      const updatedGoalie = {
        name: "Updated Goalie A",
        nickname: "UA",
        number: 31,
      };

      const response: Response = await request(app)
        .put("/api/v1/goalies/1")
        .set("Authorization", "bearer admin")
        .send(updatedGoalie);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Goalie A");
      expect(response.body.nickname).toBe("UA");
      expect(response.body.number).toBe(31);
    });

    it("should return 404 if the goalie does not exist", async () => {
      const updatedGoalie = {
        name: "Updated Goalie D",
        nickname: "UD",
        number: 36,
      };

      const response: Response = await request(app)
        .put("/api/v1/goalies/999")
        .set("Authorization", "bearer admin")
        .send(updatedGoalie);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("goalie not found");
    });

    it("should return 400 if the id is not a number", async () => {
      const updatedGoalie = {
        name: "Updated Goalie D",
        nickname: "UD",
        number: 36,
      };

      const response: Response = await request(app)
        .put("/api/v1/goalies/abc")
        .set("Authorization", "bearer admin")
        .send(updatedGoalie);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("malformatted id");
    });

    it("should return 401 if not authenticated", async () => {
      const updatedGoalie = {
        name: "Updated Goalie A",
        nickname: "UA",
        number: 31,
      };

      const response: Response = await request(app)
        .put("/api/v1/goalies/1")
        .send(updatedGoalie);

      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /goalies/:id", () => {
    it("should delete a goalie", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/goalies/2")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(204);
    });

    it("should return 404 if the goalie does not exist", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/goalies/999")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("goalie not found");
    });

    it("should return 400 if the id is not a number", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/goalies/abc")
        .set("Authorization", "bearer admin");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("malformatted id");
    });
  });
  describe("DELETE /goalies/:id without authentication", () => {
    it("should return 401 if not authenticated", async () => {
      const response: Response = await request(app)
        .delete("/api/v1/goalies/2");

      expect(response.status).toBe(401);
    });
  });

  
});