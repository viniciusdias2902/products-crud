import { describe, it, expect, beforeEach, afterEach, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";
import { prisma } from "../../lib/prisma.js";

const app = createApp();

describe("Category Integration Tests", () => {
  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /categories", () => {
    it("should successfully create a category", async () => {
      const response = await request(app)
        .post("/categories")
        .send({ name: "electronics" });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("electronics");
      expect(response.body.id).toBeDefined();

      const dbCategory = await prisma.category.findUnique({
        where: { id: response.body.id },
      });
      expect(dbCategory).not.toBeNull();
    });

    it("should return validation error for missing name", async () => {
      const response = await request(app).post("/categories").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("GET /categories", () => {
    it("should list categories", async () => {
      await prisma.category.create({ data: { name: "electronics" } });

      const response = await request(app).get("/categories");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("electronics");
    });
  });

  describe("PUT /categories/:id", () => {
    it("should successfully update a category", async () => {
      const category = await prisma.category.create({
        data: { name: "electronics" },
      });

      const response = await request(app)
        .put(`/categories/${category.id}`)
        .send({ name: "updated electronics" });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("updated electronics");
    });
  });

  describe("DELETE /categories/:id", () => {
    it("should successfully delete a category", async () => {
      const category = await prisma.category.create({
        data: { name: "electronics" },
      });

      const response = await request(app).delete(`/categories/${category.id}`);

      expect(response.status).toBe(204);

      const dbCategory = await prisma.category.findUnique({
        where: { id: category.id },
      });
      expect(dbCategory).toBeNull();
    });
  });
});
