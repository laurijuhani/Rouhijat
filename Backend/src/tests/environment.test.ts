import { setupTestDatabase } from "../jest.setup";
import { prisma } from "../utils/client";

describe("Environment Setup", () => {
  beforeAll(async () => {
      await setupTestDatabase();
    });
    afterAll(async () => {
      await prisma.$disconnect();
    });
  it("should connect to the SQLite database and perform a basic query", async () => {
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        picture: "https://example.com/picture.png",
      },
    });

    // Retrieve the user
    const retrievedUser = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });

    // Assert the user was created and retrieved successfully
    expect(retrievedUser).not.toBeNull();
    expect(retrievedUser?.email).toBe(testUser.email);
    expect(retrievedUser?.name).toBe(testUser.name);
  });
});