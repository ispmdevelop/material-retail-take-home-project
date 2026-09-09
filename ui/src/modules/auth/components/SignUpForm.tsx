import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useSignUp } from '../hooks/useSignUp';
import { useAuthStore } from '../store/authStore';

export function SignUpForm({ onToggle }: { onToggle: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const setUser = useAuthStore((state) => state.setUser);
  const signUp = useSignUp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp.mutate(
      { name, email, password },
      {
        onSuccess: (data) => {
          setUser(data.user, data.accessToken);
          enqueueSnackbar('Account created successfully!', { variant: 'success' });
          navigate('/app');
        },
        onError: () => {
          enqueueSnackbar('Signup failed', { variant: 'error' });
        },
      },
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
        Create account
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Get started with Material Retail
      </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={signUp.isPending}
        fullWidth
      >
        {signUp.isPending ? 'Creating account...' : 'Sign up'}
      </Button>

      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Already have an account?{' '}
        <Link component="button" onClick={onToggle} sx={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
