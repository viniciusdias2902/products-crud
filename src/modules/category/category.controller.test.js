import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCategoryController } from './category.controller.js';

describe('Category Controller', () => {
  let serviceMock;
  let categoryController;
  let reqMock;
  let resMock;

  beforeEach(() => {
    serviceMock = {
      create: vi.fn(),
      read: vi.fn(),
      readAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    categoryController = createCategoryController(serviceMock);

    reqMock = {
      validated: {
        body: {},
        query: {},
        params: {},
      },
    };

    resMock = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  describe('create', () => {
    it('should create a category and return 201 status', async () => {
      const categoryData = { name: 'Electronics' };
      const expectedCategory = { id: 1, ...categoryData };
      
      reqMock.validated.body = categoryData;
      serviceMock.create.mockResolvedValue(expectedCategory);

      await categoryController.create(reqMock, resMock);

      expect(serviceMock.create).toHaveBeenCalledWith(categoryData);
      expect(resMock.status).toHaveBeenCalledWith(201);
      expect(resMock.json).toHaveBeenCalledWith(expectedCategory);
    });
  });

  describe('read', () => {
    it('should read isolated category by id when provided', async () => {
      const id = 1;
      const expectedCategory = { id, name: 'Electronics' };
      
      reqMock.validated.query = { id };
      serviceMock.read.mockResolvedValue(expectedCategory);

      await categoryController.read(reqMock, resMock);

      expect(serviceMock.read).toHaveBeenCalledWith({ id });
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedCategory);
    });

    it('should read isolated category by name when provided and no id', async () => {
      const name = 'Electronics';
      const expectedCategory = { id: 1, name };
      
      reqMock.validated.query = { name };
      serviceMock.read.mockResolvedValue(expectedCategory);

      await categoryController.read(reqMock, resMock);

      expect(serviceMock.read).toHaveBeenCalledWith({ name });
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedCategory);
    });

    it('should read all categories when no id or name is provided', async () => {
      const expectedCategories = [{ id: 1, name: 'Electronics' }];
      
      reqMock.validated.query = {};
      serviceMock.readAll.mockResolvedValue(expectedCategories);

      await categoryController.read(reqMock, resMock);

      expect(serviceMock.readAll).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedCategories);
    });
  });

  describe('update', () => {
    it('should update a category and return 200 status', async () => {
      const id = 1;
      const data = { name: 'Home' };
      const expectedCategory = { id, ...data };
      
      reqMock.validated.params = { id };
      reqMock.validated.body = data;
      serviceMock.update.mockResolvedValue(expectedCategory);

      await categoryController.update(reqMock, resMock);

      expect(serviceMock.update).toHaveBeenCalledWith(id, data);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedCategory);
    });

    it('should return 400 if no id is provided in params', async () => {
      const data = { name: 'Home' };
      
      reqMock.validated.params = {};
      reqMock.validated.body = data;

      await categoryController.update(reqMock, resMock);

      expect(serviceMock.update).not.toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({ message: "id is required" });
    });
  });

  describe('delete', () => {
    it('should delete a category and return 204 status', async () => {
      const id = 1;
      
      reqMock.validated.params = { id };
      serviceMock.delete.mockResolvedValue(null);

      await categoryController.delete(reqMock, resMock);

      expect(serviceMock.delete).toHaveBeenCalledWith(id);
      expect(resMock.status).toHaveBeenCalledWith(204);
      expect(resMock.send).toHaveBeenCalledTimes(1);
    });
  });
});
