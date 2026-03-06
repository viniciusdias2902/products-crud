import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCategoryService } from "./category.service.js";

describe("Category Service", () => {
  let repositoryMock;
  let categoryService;

  beforeEach(() => {
    repositoryMock = {
      create: vi.fn(),
      read: vi.fn(),
      readAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    categoryService = createCategoryService(repositoryMock);
  });

  describe("create", () => {
    it("should create a category via repository", async () => {
      const data = { name: "Electronics" };
      const expectedCategory = { id: 1, ...data };
      repositoryMock.create.mockResolvedValue(expectedCategory);

      const result = await categoryService.create(data);

      expect(repositoryMock.create).toHaveBeenCalledWith(data);
      expect(repositoryMock.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });
  });

  describe("read", () => {
    it("should read a category by data", async () => {
      const data = { id: 1 };
      const expectedCategory = { id: 1, name: "Electronics" };
      repositoryMock.read.mockResolvedValue(expectedCategory);

      const result = await categoryService.read(data);

      expect(repositoryMock.read).toHaveBeenCalledWith(data);
      expect(repositoryMock.read).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });
  });

  describe("readAll", () => {
    it("should read all categories", async () => {
      const expectedCategories = [{ id: 1, name: "Electronics" }];
      repositoryMock.readAll.mockResolvedValue(expectedCategories);

      const result = await categoryService.readAll();

      expect(repositoryMock.readAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategories);
    });
  });

  describe("update", () => {
    it("should update a category", async () => {
      const id = 1;
      const data = { name: "Home" };
      const expectedCategory = { id, ...data };
      repositoryMock.update.mockResolvedValue(expectedCategory);

      const result = await categoryService.update(id, data);

      expect(repositoryMock.update).toHaveBeenCalledWith(id, data);
      expect(repositoryMock.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });
  });

  describe("delete", () => {
    it("should delete a category", async () => {
      const id = 1;
      const expectedCategory = { id, name: "Toys" };
      repositoryMock.delete.mockResolvedValue(expectedCategory);

      const result = await categoryService.delete(id);

      expect(repositoryMock.delete).toHaveBeenCalledWith(id);
      expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });
  });
});
