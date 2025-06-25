import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, loginWithGoogle, userProfile } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
        if (userProfile && userProfile.onboarded) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding/profile');
        }
      } else {
        await signup(email, password);
        navigate('/onboarding/profile');
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      if (userProfile && userProfile.onboarded) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding/profile');
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e3f2fd 0%, #e8eaf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
    }}>
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 4 },
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            borderRadius: 5,
            boxShadow: '0 8px 32px 0 rgba(60,72,100,0.10)',
            background: 'rgba(255,255,255,0.97)',
          }}
        >
          {/* Brand/Logo */}
          <Typography variant="h5" align="center" sx={{ fontWeight: 900, color: '#2451a6', letterSpacing: 1, mb: 1 }}>
            FlatBuddies
          </Typography>
          <Divider sx={{ width: 60, mx: 'auto', mb: 2, borderBottomWidth: 3, borderColor: '#2451a6' }} />
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800, mb: 2, color: '#222' }}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box sx={{ width: '100%', bgcolor: '#f7fafd', borderRadius: 3, p: { xs: 2, sm: 3 }, mb: 2, boxShadow: '0 2px 8px 0 rgba(60,72,100,0.04)' }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                InputProps={{ sx: { borderRadius: 3, bgcolor: '#fff' } }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                InputProps={{ sx: { borderRadius: 3, bgcolor: '#fff' } }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 2,
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  py: 1.5,
                  background: '#2451a6',
                  boxShadow: '0 2px 8px 0 rgba(36,81,166,0.10)',
                  '&:hover': { background: '#1d3e7a' },
                  transition: 'all 0.18s',
                }}
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </form>
          </Box>

          <Divider sx={{ my: 2, width: '100%' }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '1.1rem',
              py: 1.3,
              color: '#2451a6',
              borderColor: '#b3c7f7',
              background: '#fff',
              '&:hover': { background: '#f7fafd', borderColor: '#2451a6' },
              transition: 'all 0.18s',
              mb: 1,
            }}
          >
            Continue with Google
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => setIsLogin(!isLogin)}
            sx={{
              mt: 1,
              color: '#2451a6',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: '999px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#e3f2fd' },
              transition: 'all 0.18s',
            }}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
} 