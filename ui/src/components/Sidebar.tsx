import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
  Badge,
} from '@mui/material';
import {
  LocalMall,
  Inventory2Outlined,
  PersonOutlined,
  ChevronLeft,
  Menu,
  Logout,
  Storefront,
  NotificationsOutlined,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useNotifications } from '@/modules/notifications/hooks/useNotifications';

const drawerWidth = 260;
const collapsedWidth = 72;

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isSeenOnApp).length;

  const navItems = [
    { label: 'Store', icon: <Storefront />, path: '/app/store' },
    { label: 'Products', icon: <Inventory2Outlined />, path: '/app/products' },
    { label: 'Notifications', icon: <NotificationsOutlined />, path: '/app/notifications', badge: unreadCount },
    { label: 'Profile', icon: <PersonOutlined />, path: '/app/profile' },
  ];

  const handleToggle = () => setOpen((prev) => !prev);

  const handleLogout = () => {
    clearUser();
    navigate('/auth');
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: 2,
          py: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LocalMall sx={{ fontSize: 28, color: 'primary.main' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Material
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton onClick={handleToggle} size="small">
            {open ? <ChevronLeft /> : <Menu />}
          </IconButton>
        )}
      </Box>

      <Divider />

      <List sx={{ px: 2, py: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error" invisible={item.badge === 0 || !open}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            justifyContent: open ? 'flex-start' : 'center',
            color: 'error.main',
            borderRadius: 2,
            py: 1.5,
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          {open && 'Logout'}
        </Button>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: theme.zIndex.appBar - 1,
            px: 2,
            py: 1.5,
          }}
        >
          <IconButton onClick={handleToggle} sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
            <Menu />
          </IconButton>
        </Box>
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
