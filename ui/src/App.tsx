import { Typography, Box } from '@mui/material';

function App() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Authenticated area. Build your dashboard here.
      </Typography>
    </Box>
  );
}

export default App;
