import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/Sidebar';
import { useNotifications } from '@/modules/notifications/hooks/useNotifications';
import { useMarkAllAsRead } from '@/modules/notifications/hooks/useMarkAllAsRead';
import { NotificationAlert } from '@/modules/notifications/components/NotificationAlert';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useNotifications();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = notifications.filter((n) => !n.isSeenOnApp).length;
  const onNotificationsPage = location.pathname === '/app/notifications';

  const [showAlert, setShowAlert] = useState(false);
  const prevUnreadRef = useRef(0);

  useEffect(() => {
    if (unreadCount > 0 && unreadCount !== prevUnreadRef.current && !onNotificationsPage) {
      setShowAlert(true);
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount, onNotificationsPage]);

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>

      <NotificationAlert
        open={showAlert}
        notifications={notifications}
        onClose={() => setShowAlert(false)}
        onViewAll={() => { setShowAlert(false); navigate('/app/notifications'); }}
        onMarkAllRead={() => { handleMarkAllRead(); setShowAlert(false); }}
        isPending={markAllAsRead.isPending}
      />
    </Box>
  );
}
