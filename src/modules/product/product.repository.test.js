import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductRepository } from './product.repository.js';

describe('Product Repository', () => {
  let prismaMock;
  let productRepository;

  beforeEach(() => {
    prismaMock = {
      product: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
    };
    productRepository = createProductRepository(prismaMock);
  });

  describe('create', () => {
    it('should create a product and return it', async () => {
      const data = { name: 'Laptop', price: 1000 };
      const expectedProduct = { id: 1, ...data };
      prismaMock.product.create.mockResolvedValue(expectedProduct);

      const result = await productRepository.create(data);

      expect(prismaMock.product.create).toHaveBeenCalledWith({ data });
      expect(prismaMock.product.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('readAll', () => {
    it('should return all products', async () => {
      const expectedProducts = [{ id: 1, name: 'Laptop' }];
      prismaMock.product.findMany.mockResolvedValue(expectedProducts);

      const result = await productRepository.readAll();

      expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('read', () => {
    it('should return a product when found', async () => {
      const data = { id: 1 };
      const expectedProduct = { id: 1, name: 'Laptop' };
      prismaMock.product.findUnique.mockResolvedValue(expectedProduct);

      const result = await productRepository.read(data);

      expect(prismaMock.product.findUnique).toHaveBeenCalledWith({ where: data });
      expect(prismaMock.product.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('readByCategory', () => {
    it('should return products for a specific category', async () => {
      const categoryId = 2;
      const expectedProducts = [{ id: 1, name: 'Laptop', categoryId }];
      prismaMock.product.findMany.mockResolvedValue(expectedProducts);

      const result = await productRepository.readByCategory(categoryId);

      expect(prismaMock.product.findMany).toHaveBeenCalledWith({ where: { categoryId } });
      expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const id = 1;
      const data = { price: 1200 };
      const expectedProduct = { id, name: 'Laptop', ...data };
      prismaMock.product.update.mockResolvedValue(expectedProduct);

      const result = await productRepository.update(id, data);

      expect(prismaMock.product.update).toHaveBeenCalledWith({ where: { id }, data });
      expect(prismaMock.product.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('delete', () => {
    it('should delete and return the product', async () => {
      const id = 1;
      const expectedProduct = { id, name: 'Laptop' };
      prismaMock.product.delete.mockResolvedValue(expectedProduct);

      const result = await productRepository.delete(id);

      expect(prismaMock.product.delete).toHaveBeenCalledWith({ where: { id } });
      expect(prismaMock.product.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('count', () => {
    it('should return the product count for a category', async () => {
      const categoryId = 2;
      const expectedCount = 5;
      prismaMock.product.count.mockResolvedValue(expectedCount);

      const result = await productRepository.count(categoryId);

      expect(prismaMock.product.count).toHaveBeenCalledWith({ where: { categoryId } });
      expect(prismaMock.product.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCount);
    });
  });
});
