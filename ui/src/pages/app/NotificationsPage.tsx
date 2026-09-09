import { Typography, Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNotifications } from '@/modules/notifications/hooks/useNotifications';
import { useMarkAsRead } from '@/modules/notifications/hooks/useMarkAsRead';
import { useMarkAllAsRead } from '@/modules/notifications/hooks/useMarkAllAsRead';
import { NotificationsList } from '@/modules/notifications/components/NotificationsList';

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleMarkRead = (id: string) => {
    markAsRead.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        enqueueSnackbar('Notification marked as read', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Failed to mark notification as read', { variant: 'error' });
      },
    });
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        enqueueSnackbar('All notifications marked as read', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Failed to mark all as read', { variant: 'error' });
      },
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Notifications
      </Typography>

      {isLoading ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          Loading notifications...
        </Typography>
      ) : (
        <NotificationsList
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          isPending={markAsRead.isPending || markAllAsRead.isPending}
        />
      )}
    </Box>
  );
}
