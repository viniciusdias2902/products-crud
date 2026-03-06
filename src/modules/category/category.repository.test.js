import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCategoryRepository } from "./category.repository.js";

describe("Category Repository", () => {
  let prismaMock;
  let categoryRepository;

  beforeEach(() => {
    prismaMock = {
      category: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };
    categoryRepository = createCategoryRepository(prismaMock);
  });

  describe("create", () => {
    it("should create a category and return it", async () => {
      const data = { name: "Electronics" };
      const expectedCategory = { id: 1, ...data };
      prismaMock.category.create.mockResolvedValue(expectedCategory);

      const result = await categoryRepository.create(data);

      expect(prismaMock.category.create).toHaveBeenCalledWith({ data });
      expect(prismaMock.category.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });
  });

  describe("read", () => {
    it("should return a category when found", async () => {
      const data = { id: 1 };
      const expectedCategory = { id: 1, name: "Electronics" };
      prismaMock.category.findUnique.mockResolvedValue(expectedCategory);

      const result = await categoryRepository.read(data);

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: data,
      });
      expect(prismaMock.category.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });
  });

  describe("readAll", () => {
    it("should return all categories", async () => {
      const expectedCategories = [{ id: 1, name: "Electronics" }];
      prismaMock.category.findMany.mockResolvedValue(expectedCategories);

      const result = await categoryRepository.readAll();

      expect(prismaMock.category.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategories);
    });
  });

  describe("update", () => {
    it("should update and return the category", async () => {
      const id = 1;
      const data = { name: "New Name" };
      const expectedCategory = { id, ...data };
      prismaMock.category.update.mockResolvedValue(expectedCategory);

      const result = await categoryRepository.update(id, data);

      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id },
        data,
      });
      expect(prismaMock.category.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });
  });

  describe("delete", () => {
    it("should delete and return the category", async () => {
      const id = 1;
      const expectedCategory = { id, name: "To Delete" };
      prismaMock.category.delete.mockResolvedValue(expectedCategory);

      const result = await categoryRepository.delete(id);

      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaMock.category.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });
  });
});
