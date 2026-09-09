import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  DoneAll as DoneAllIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import type { Notification } from '../types/notification.types';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  isPending: boolean;
}

export function NotificationsList({ notifications, onMarkRead, onMarkAllRead, isPending }: NotificationsListProps) {
  const unreadCount = notifications.filter((n) => !n.isSeenOnApp).length;

  if (notifications.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          No notifications
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          You will see stock alerts here when items fall below their threshold.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {unreadCount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            startIcon={<DoneAllIcon />}
            onClick={onMarkAllRead}
            disabled={isPending}
            size="small"
          >
            Mark all as read
          </Button>
        </Box>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow
                key={notification.id}
                sx={{
                  bgcolor: notification.isSeenOnApp ? 'inherit' : 'action.hover',
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: notification.isSeenOnApp ? 400 : 600 }}>
                    {notification.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {notification.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={notification.action}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  {notification.isSeenOnApp ? (
                    <Chip label="Seen" size="small" color="success" variant="outlined" />
                  ) : (
                    <Chip label="Unread" size="small" color="warning" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  {!notification.isSeenOnApp && (
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => onMarkRead(notification.id)}
                      disabled={isPending}
                    >
                      Mark
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
