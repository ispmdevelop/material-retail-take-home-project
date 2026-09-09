import { api } from '@/lib/api';
import type { Notification } from '../types/notification.types';

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get<Notification[]>('/notifications');
  return data;
}

export async function markAsRead(id: string): Promise<Notification> {
  const { data } = await api.patch<Notification>(`/notifications/${id}/read`);
  return data;
}

export async function markAllAsRead(): Promise<{ updatedCount: number }> {
  const { data } = await api.patch<{ updatedCount: number }>('/notifications/mark-all-read');
  return data;
}
