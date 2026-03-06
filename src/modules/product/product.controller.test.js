import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductController } from './product.controller.js';

describe('Product Controller', () => {
  let serviceMock;
  let productController;
  let reqMock;
  let resMock;

  beforeEach(() => {
    serviceMock = {
      create: vi.fn(),
      read: vi.fn(),
      readAll: vi.fn(),
      readByCategory: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    productController = createProductController(serviceMock);

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
    it('should create a product and return 201 status', async () => {
      const data = { name: 'Laptop', price: 1000, categoryId: 1 };
      const expectedProduct = { id: 1, ...data, sku: 'ELE-1' };
      
      reqMock.validated.body = data;
      serviceMock.create.mockResolvedValue(expectedProduct);

      await productController.create(reqMock, resMock);

      expect(serviceMock.create).toHaveBeenCalledWith(data);
      expect(resMock.status).toHaveBeenCalledWith(201);
      expect(resMock.json).toHaveBeenCalledWith(expectedProduct);
    });
  });

  describe('read', () => {
    it('should read a product by id when provided', async () => {
      const id = 1;
      const expectedProduct = { id, name: 'Laptop' };
      
      reqMock.validated.query = { id };
      serviceMock.read.mockResolvedValue(expectedProduct);

      await productController.read(reqMock, resMock);

      expect(serviceMock.read).toHaveBeenCalledWith({ id });
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedProduct);
    });

    it('should read a product by sku when provided without id', async () => {
      const sku = 'ELE-1';
      const expectedProduct = { id: 1, name: 'Laptop', sku };
      
      reqMock.validated.query = { sku };
      serviceMock.read.mockResolvedValue(expectedProduct);

      await productController.read(reqMock, resMock);

      expect(serviceMock.read).toHaveBeenCalledWith({ sku });
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedProduct);
    });

    it('should read products by categoryId when provided without id and sku', async () => {
      const categoryId = 2;
      const expectedProducts = [{ id: 1, name: 'Laptop', categoryId }];
      
      reqMock.validated.query = { categoryId };
      serviceMock.readByCategory.mockResolvedValue(expectedProducts);

      await productController.read(reqMock, resMock);

      expect(serviceMock.readByCategory).toHaveBeenCalledWith(categoryId);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedProducts);
    });

    it('should read all products when no specific query params are provided', async () => {
      const expectedProducts = [{ id: 1, name: 'Laptop' }];
      
      reqMock.validated.query = {};
      serviceMock.readAll.mockResolvedValue(expectedProducts);

      await productController.read(reqMock, resMock);

      expect(serviceMock.readAll).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedProducts);
    });
  });

  describe('update', () => {
    it('should update a product and return 200 status', async () => {
      const id = 1;
      const data = { price: 1200 };
      const expectedProduct = { id, name: 'Laptop', ...data };
      
      reqMock.validated.params = { id };
      reqMock.validated.body = data;
      serviceMock.update.mockResolvedValue(expectedProduct);

      await productController.update(reqMock, resMock);

      expect(serviceMock.update).toHaveBeenCalledWith(id, data);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expectedProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product and return 204 status', async () => {
      const id = 1;
      
      reqMock.validated.params = { id };
      serviceMock.delete.mockResolvedValue(null);

      await productController.delete(reqMock, resMock);

      expect(serviceMock.delete).toHaveBeenCalledWith(id);
      expect(resMock.status).toHaveBeenCalledWith(204);
      expect(resMock.send).toHaveBeenCalledTimes(1);
    });
  });
});
