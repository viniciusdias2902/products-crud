import { describe, it, expect, beforeEach, afterEach, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";
import { prisma } from "../../lib/prisma.js";

const app = createApp();

describe("Product Integration Tests", () => {
  let categoryId;

  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const category = await prisma.category.create({ data: { name: "tech" } });
    categoryId = category.id;
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /products", () => {
    it("should successfully create a product if category exists", async () => {
      const mockProductParams = {
        name: "laptop",
        price: 999.99,
        stock: 10,
        categoryId: categoryId,
      };

      const response = await request(app)
        .post("/products")
        .send(mockProductParams);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("laptop");
      expect(response.body.sku).toBeDefined();

      const dbProduct = await prisma.product.findUnique({
        where: { id: response.body.id },
      });
      expect(dbProduct).not.toBeNull();
    });

    it("should return validation error for missing name", async () => {
      const response = await request(app).post("/products").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it("should return 500 if category does not exist", async () => {
      const fakeCategoryId = "00000000-0000-0000-0000-000000000000";
      const mockProductParams = {
        name: "laptop",
        price: 999.99,
        stock: 10,
        categoryId: fakeCategoryId,
      };

      const response = await request(app)
        .post("/products")
        .send(mockProductParams);

      expect(response.status).toBe(500);
    });
  });

  describe("GET /products", () => {
    it("should list products", async () => {
      await prisma.product.create({
        data: {
          name: "laptop",
          price: 999.99,
          stock: 10,
          sku: "TEC-1",
          categoryId: categoryId,
        },
      });

      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("laptop");
    });
  });

  describe("PUT /products/:id", () => {
    it("should update a product", async () => {
      const product = await prisma.product.create({
        data: {
          name: "laptop",
          price: 999.99,
          stock: 10,
          sku: "TEC-1",
          categoryId: categoryId,
        },
      });

      const updateData = { name: "gaming laptop", price: 1200.0 };

      const response = await request(app)
        .put(`/products/${product.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("gaming laptop");
      expect(Number(response.body.price)).toBe(1200);
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a product", async () => {
      const product = await prisma.product.create({
        data: {
          name: "laptop",
          price: 999.99,
          stock: 10,
          sku: "TEC-1",
          categoryId: categoryId,
        },
      });

      const response = await request(app).delete(`/products/${product.id}`);

      expect(response.status).toBe(204);

      const dbProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });
      expect(dbProduct).toBeNull();
    });
  });
});
