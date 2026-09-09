import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { WarningAmber, Notifications, DoneAll } from '@mui/icons-material';
import type { Notification } from '../types/notification.types';

interface NotificationAlertProps {
  open: boolean;
  notifications: Notification[];
  onClose: () => void;
  onViewAll: () => void;
  onMarkAllRead: () => void;
  isPending: boolean;
}

export function NotificationAlert({ open, notifications, onClose, onViewAll, onMarkAllRead, isPending }: NotificationAlertProps) {
  const unread = notifications.filter((n) => !n.isSeenOnApp);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: 'warning.lighter',
        }}
      >
        <WarningAmber color="warning" />
        Unread Stock Alerts
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You have <strong>{unread.length} unread notification(s)</strong> about your stock levels.
          Some items are running low and may need restocking.
        </Typography>

        <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Latest alerts
          </Typography>
          <List dense disablePadding>
            {unread.slice(0, 3).map((n) => (
              <ListItem key={n.id} disablePadding sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Notifications fontSize="small" sx={{ color: 'warning.main' }} />
                </ListItemIcon>
                <ListItemText
                  primary={n.title}
                  secondary={n.description}
                />
              </ListItem>
            ))}
            {unread.length > 3 && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}>
                +{unread.length - 3} more
              </Typography>
            )}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          startIcon={<DoneAll />}
          onClick={() => { onMarkAllRead(); onClose(); }}
          disabled={isPending}
          color="primary"
        >
          Mark all as read
        </Button>
        <Button
          variant="contained"
          onClick={() => { onViewAll(); onClose(); }}
        >
          View all notifications
        </Button>
      </DialogActions>
    </Dialog>
  );
}
