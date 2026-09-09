import { useMutation } from '@tanstack/react-query';
import { markAsRead } from '../actions/notificationActions';

export function useMarkAsRead() {
  return useMutation({
    mutationFn: markAsRead,
  });
}
