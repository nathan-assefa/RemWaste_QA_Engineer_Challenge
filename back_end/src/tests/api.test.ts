import request from "supertest";
import app from "../app";

// Mock authenticateUser middleware as named export
jest.mock("../middleware/authMiddleware", () => ({
  authenticateUser: (req: any, _res: any, next: any) => {
    req.user = { id: "mock-user-id" };
    next();
  },
}));

// Mock PrismaClient inside jest.mock factory to avoid hoisting issues
jest.mock("../generated/prisma", () => {
  const mockUser = {
    findUnique: jest.fn().mockResolvedValue({
      id: "mock-user-id",
      email: "mock@example.com",
      password: "mockpass",
    }),
    create: jest.fn().mockResolvedValue({
      id: "mock-user-id",
      email: "mock@example.com",
      password: "mockpass",
    }),
  };

  const mockItem = {
    findMany: jest
      .fn()
      .mockResolvedValue([
        { id: "mock-item-id", text: "Mock Item", userId: "mock-user-id" },
      ]),
    create: jest.fn().mockResolvedValue({
      id: "mock-item-id",
      text: "Mock Item",
      userId: "mock-user-id",
    }),
    update: jest.fn().mockResolvedValue({
      id: "mock-item-id",
      text: "Updated Mock",
      userId: "mock-user-id",
    }),
    delete: jest.fn().mockResolvedValue({}),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: mockUser,
      item: mockItem,
    })),
  };
});

// Set JWT_SECRET env var to avoid errors
process.env.JWT_SECRET = "test_secret";

jest.setTimeout(30000);

let token = "mocked.jwt.token";
let createdItemId: string | number = "mock-item-id";

const mockSignup = {
  email: "mock@example.com",
  password: "mockpass",
  name: "Mock User",
};
const mockLogin = { email: "mock@example.com", password: "mockpass" };
const mockItemData = { text: "Mock Item" };
const updatedItemData = { text: "Updated Mock" };

describe("Auth Controller", () => {
  it("should signup a new user successfully", async () => {
    const res = await request(app).post("/api/auth/signup").send(mockSignup);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(mockSignup.email);
  });

  it("should fail to signup if user already exists", async () => {
    // Spy on the create method to throw error once for this test
    const { PrismaClient } = require("../generated/prisma");
    const prisma = new PrismaClient();
    const createSpy = jest
      .spyOn(prisma.user, "create")
      .mockRejectedValueOnce(new Error("User already exists"));

    const res = await request(app).post("/api/auth/signup").send(mockSignup);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");

    createSpy.mockRestore();
  });

  it("should login successfully and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send(mockLogin);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body).toHaveProperty("userId");
  });

  it("should fail login with invalid credentials", async () => {
    // Spy on the findUnique method to return null for this test
    const { PrismaClient } = require("../generated/prisma");
    const prisma = new PrismaClient();
    const findUniqueSpy = jest
      .spyOn(prisma.user, "findUnique")
      .mockResolvedValueOnce(null);

    const res = await request(app).post("/api/auth/login").send(mockLogin);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");

    findUniqueSpy.mockRestore();
  });

  it("should fail login if JWT_SECRET is missing", async () => {
    const oldSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    const res = await request(app).post("/api/auth/login").send(mockLogin);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");

    process.env.JWT_SECRET = oldSecret;
  });
});

describe("Item Controller", () => {
  it("should get all items for a user", async () => {
    const res = await request(app)
      .get("/api/items")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].text).toBe(mockItemData.text);
  });

  it("should create a new item", async () => {
    const res = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${token}`)
      .send(mockItemData);

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe(mockItemData.text);
    expect(res.body).toHaveProperty("id");
  });

  it("should fail to create item without text", async () => {
    const res = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("text is required");
  });

  it("should update an existing item", async () => {
    const res = await request(app)
      .put(`/api/items/${createdItemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedItemData);

    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe(updatedItemData.text);
  });

  it("should fail to update item without text", async () => {
    const res = await request(app)
      .put(`/api/items/${createdItemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("text field is required");
  });

  it("should delete an item", async () => {
    const res = await request(app)
      .delete(`/api/items/${createdItemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect([200, 204]).toContain(res.statusCode);
  });
});
