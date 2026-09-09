import { api } from '@/lib/api';
import type { CreateProductDto, UpdateProductDto, ProductListItem, Product } from '../types/product.types';

export async function getProducts(): Promise<ProductListItem[]> {
  const { data } = await api.get<ProductListItem[]>('/products');
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(dto: CreateProductDto): Promise<ProductListItem> {
  const { data } = await api.post<ProductListItem>('/products', dto);
  return data;
}

export async function updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, dto);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
