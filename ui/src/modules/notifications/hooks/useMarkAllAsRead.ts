import { useMutation } from '@tanstack/react-query';
import { markAllAsRead } from '../actions/notificationActions';

export function useMarkAllAsRead() {
  return useMutation({
    mutationFn: markAllAsRead,
  });
}
