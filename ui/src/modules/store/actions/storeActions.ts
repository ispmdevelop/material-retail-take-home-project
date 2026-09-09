import { api } from '@/lib/api';
import type { StoreItem, PurchaseDto, PurchaseResponse } from '../types/store.types';

export async function getStoreItems(): Promise<StoreItem[]> {
  const { data } = await api.get<StoreItem[]>('/store/items');
  return data;
}

export async function purchaseItem(dto: PurchaseDto): Promise<PurchaseResponse> {
  const { data } = await api.post<PurchaseResponse>('/store/purchase', dto);
  return data;
}
