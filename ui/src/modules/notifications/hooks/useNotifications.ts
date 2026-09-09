import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../actions/notificationActions';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });
}
