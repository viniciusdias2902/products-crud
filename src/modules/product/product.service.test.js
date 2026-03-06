import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductService } from './product.service.js';

describe('Product Service', () => {
  let productRepositoryMock;
  let categoryRepositoryMock;
  let productService;

  beforeEach(() => {
    productRepositoryMock = {
      create: vi.fn(),
      readAll: vi.fn(),
      read: vi.fn(),
      readByCategory: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    };
    categoryRepositoryMock = {
      read: vi.fn(),
    };
    productService = createProductService(productRepositoryMock, categoryRepositoryMock);
  });

  describe('create', () => {
    it('should calculate sku based on category name and product count, and create product', async () => {
      const data = { name: 'Keyboard', price: 100, categoryId: 2 };
      const categoryMock = { id: 2, name: 'Electronics' };
      
      categoryRepositoryMock.read.mockResolvedValue(categoryMock);
      productRepositoryMock.count.mockResolvedValue(5); // So count(category) + 1 = 6

      // category: 'Electronics' -> prefix 'ELE'
      // count: 5 -> count + 1 = 6
      // expected sku: 'ELE-6'
      const expectedSku = 'ELE-6';
      const expectedProduct = { id: 10, ...data, sku: expectedSku };

      productRepositoryMock.create.mockResolvedValue(expectedProduct);

      const result = await productService.create(data);

      expect(categoryRepositoryMock.read).toHaveBeenCalledWith({ id: data.categoryId });
      expect(productRepositoryMock.count).toHaveBeenCalledWith(data.categoryId);
      expect(productRepositoryMock.create).toHaveBeenCalledWith({
        ...data,
        sku: expectedSku,
      });
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('readAll', () => {
    it('should read all products', async () => {
      const expectedProducts = [{ id: 1, name: 'Keyboard' }];
      productRepositoryMock.readAll.mockResolvedValue(expectedProducts);

      const result = await productService.readAll();

      expect(productRepositoryMock.readAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('read', () => {
    it('should read a product by specific data', async () => {
      const data = { id: 1 };
      const expectedProduct = { id: 1, name: 'Keyboard' };
      productRepositoryMock.read.mockResolvedValue(expectedProduct);

      const result = await productService.read(data);

      expect(productRepositoryMock.read).toHaveBeenCalledWith(data);
      expect(productRepositoryMock.read).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('readByCategory', () => {
    it('should read products by category id', async () => {
      const categoryId = 2;
      const expectedProducts = [{ id: 1, name: 'Keyboard', categoryId }];
      productRepositoryMock.readByCategory.mockResolvedValue(expectedProducts);

      const result = await productService.readByCategory(categoryId);

      expect(productRepositoryMock.readByCategory).toHaveBeenCalledWith(categoryId);
      expect(productRepositoryMock.readByCategory).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = 1;
      const data = { price: 150 };
      const expectedProduct = { id, name: 'Keyboard', ...data };
      productRepositoryMock.update.mockResolvedValue(expectedProduct);

      const result = await productService.update(id, data);

      expect(productRepositoryMock.update).toHaveBeenCalledWith(id, data);
      expect(productRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      const id = 1;
      const expectedProduct = { id, name: 'To Delete' };
      productRepositoryMock.delete.mockResolvedValue(expectedProduct);

      const result = await productService.delete(id);

      expect(productRepositoryMock.delete).toHaveBeenCalledWith(id);
      expect(productRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProduct);
    });
  });
});
