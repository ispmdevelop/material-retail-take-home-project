import { Box, Paper, Typography, Avatar, Divider, Chip } from '@mui/material';
import { Person as PersonIcon, Badge, Business, CalendarToday, Key } from '@mui/icons-material';
import { useAuthStore } from '@/modules/auth/store/authStore';

function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const token = localStorage.getItem('token') || '';
  const decoded = decodeJwt(token);

  const infoRows = [
    { icon: <PersonIcon />, label: 'Email', value: user.email },
    { icon: <Badge />, label: 'Name', value: user.name },
    { icon: <Business />, label: 'Organization ID', value: user.organizationId },
    { icon: <CalendarToday />, label: 'Account created', value: new Date(user.createdAt).toLocaleDateString() },
    { icon: <Key />, label: 'Token expires', value: decoded?.exp ? new Date(decoded.exp * 1000).toLocaleString() : '—' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Profile
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: 'primary.main',
              fontSize: '1.75rem',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user.email}
            </Typography>
            <Chip
              label="Active"
              size="small"
              color="success"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {infoRows.map((row) => (
            <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                {row.icon}
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', width: 160 }}>
                {row.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {row.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {decoded && (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            JWT Payload
          </Typography>
          <Box
            component="pre"
            sx={{
              bgcolor: 'grey.100',
              borderRadius: 2,
              p: 2,
              overflow: 'auto',
              fontSize: '0.8125rem',
              fontFamily: 'monospace',
            }}
          >
            {JSON.stringify(decoded, null, 2)}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
