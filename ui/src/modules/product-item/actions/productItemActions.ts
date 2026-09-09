import { api } from '@/lib/api';
import type { ProductItem, CreateProductItemDto, UpdateProductItemDto } from '../types/product-item.types';

export async function getProductItems(productId: string): Promise<ProductItem[]> {
  const { data } = await api.get<ProductItem[]>('/product-items', { params: { productId } });
  return data;
}

export async function createProductItem(dto: CreateProductItemDto): Promise<ProductItem> {
  const { data } = await api.post<ProductItem>('/product-items', dto);
  return data;
}

export async function updateProductItem(id: string, dto: UpdateProductItemDto): Promise<ProductItem> {
  const { data } = await api.put<ProductItem>(`/product-items/${id}`, dto);
  return data;
}

export async function deleteProductItem(id: string): Promise<void> {
  await api.delete(`/product-items/${id}`);
}
