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
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle, userProfile } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

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
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      await loginWithGoogle();
      if (userProfile && userProfile.onboarded) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding/profile');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </Typography>

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
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Continue with Google
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => setIsLogin(!isLogin)}
            sx={{ mt: 1 }}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
} 