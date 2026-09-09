import { Box, Paper, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { LocalMall } from '@mui/icons-material';

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: 'primary.main',
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <LocalMall sx={{ fontSize: 28, color: 'primary.contrastText' }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: 'primary.contrastText',
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '-0.02em',
          }}
        >
          Material
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 480,
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
}
