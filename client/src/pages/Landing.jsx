import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaUserFriends, FaSearch, FaArrowsAltH } from 'react-icons/fa';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/system';
import { ArrowForward } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(8px)',
  borderRadius: 24,
  boxShadow: '0 8px 32px 0 rgba(60,72,100,0.10)',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.03)',
    boxShadow: '0 16px 48px 0 rgba(60,72,100,0.16)',
    background: 'rgba(255,255,255,0.85)',
  },
}));

const GradientText = styled('span')({
  background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 900,
});

const Landing = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #e3f2fd 0%, #e8eaf6 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Gradient Circles */}
      <Box sx={{
        position: 'absolute',
        top: -120,
        left: -120,
        width: 320,
        height: 320,
        background: 'radial-gradient(circle at 60% 40%, #6c63ff33 0%, #e3f2fd00 80%)',
        zIndex: 0,
        filter: 'blur(8px)'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 260,
        height: 260,
        background: 'radial-gradient(circle at 40% 60%, #48c6ef33 0%, #e8eaf600 80%)',
        zIndex: 0,
        filter: 'blur(8px)'
      }} />
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ px: 4, py: 10, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 900, fontSize: { xs: '2.2rem', md: '3.5rem' }, mb: 3, letterSpacing: 1 }}>
            <GradientText>Find Your Perfect Roommate & Flat</GradientText>
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, maxWidth: 700, mx: 'auto', fontWeight: 400, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
            RoomEase makes it easy to find compatible roommates and ideal living spaces.<br />
            <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>Join our community and start your journey to better living.</span>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 5,
                py: 1.7,
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '1.2rem',
                background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
                boxShadow: '0 4px 24px 0 rgba(60,72,100,0.10)',
                color: 'white',
                '&:hover': { background: 'linear-gradient(90deg, #48c6ef 0%, #6c63ff 100%)' },
                transition: 'all 0.18s',
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/auth"
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.7,
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '1.2rem',
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                border: '2px solid',
                borderColor: 'primary.main',
                boxShadow: '0 2px 8px 0 rgba(60,72,100,0.08)',
                '&:hover': { backgroundColor: '#f5f7fa', borderColor: '#48c6ef' },
                transition: 'all 0.18s',
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>

      {/* One-liner Message Bridge */}
      <Box sx={{
        width: '100%',
        py: 4,
        background: 'transparent',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 700,
          color: 'primary.main',
          fontSize: { xs: '1.2rem', md: '1.7rem' },
          letterSpacing: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <span role="img" aria-label="spark">✨</span> Your next home is just a match away! <span role="img" aria-label="home">🏠</span>
        </Typography>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: 'white', py: 10, position: 'relative', zIndex: 2 }}>
        <Container maxWidth="lg" sx={{ px: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, textAlign: 'center', mb: 7, color: 'primary.main', letterSpacing: 1 }}>
            How It Works
          </Typography>
          <Grid container spacing={5}>
            {/* Create Profile */}
            <Grid item xs={12} md={6} lg={3}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
                <StyledPaper elevation={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 36,
                      boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)'
                    }}>
                      <FaUserFriends />
                    </Box>
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    Create a Profile
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Build your personalized profile sharing your lifestyle, interests, and living preferences.
                  </Typography>
                </StyledPaper>
              </motion.div>
            </Grid>

            {/* Set Preferences */}
            <Grid item xs={12} md={6} lg={3}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <StyledPaper elevation={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      background: 'linear-gradient(90deg, #48c6ef 0%, #6c63ff 100%)',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 36,
                      boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)'
                    }}>
                      <FaSearch />
                    </Box>
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    Set Preferences
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Customize your search with specific preferences like budget, location, and living habits.
                  </Typography>
                </StyledPaper>
              </motion.div>
            </Grid>

            {/* Find Flats */}
            <Grid item xs={12} md={6} lg={3}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
                <StyledPaper elevation={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 36,
                      boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)'
                    }}>
                      <FaHome />
                    </Box>
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    Find Flats
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Browse through available flats and find your perfect living space.
                  </Typography>
                </StyledPaper>
              </motion.div>
            </Grid>

            {/* Swipe and Match */}
            <Grid item xs={12} md={6} lg={3}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
                <StyledPaper elevation={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      background: 'linear-gradient(90deg, #48c6ef 0%, #6c63ff 100%)',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 36,
                      boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)'
                    }}>
                      <FaArrowsAltH />
                    </Box>
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    Swipe and Match
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Connect with potential roommates through our easy-to-use swipe interface.
                  </Typography>
                </StyledPaper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
        color: 'white',
        py: 10,
        position: 'relative',
        zIndex: 2,
      }}>
        <Container maxWidth="lg" sx={{ px: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2rem', md: '2.7rem' }, letterSpacing: 1 }}>
            Ready to Find Your Perfect Match?
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 400, color: 'rgba(255,255,255,0.92)' }}>
            Join thousands of users who found their ideal living situation with RoomEase.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              background: 'white',
              color: 'primary.main',
              px: 5,
              py: 1.7,
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '1.2rem',
              boxShadow: '0 4px 24px 0 rgba(60,72,100,0.10)',
              '&:hover': { background: '#f5f7fa', color: '#6c63ff' },
              transition: 'all 0.18s',
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{
        width: '100%',
        bgcolor: 'white',
        borderTop: '1px solid #e3e6f3',
        py: 4,
        mt: 0,
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: { xs: '0.95rem', md: '1.05rem' },
        zIndex: 10,
      }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem', mb: { xs: 1, md: 0 } }}>
            FlatBuddies
          </Box>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Home</a>
            <a href="/explore" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Explore</a>
            <a href="/auth" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Sign In</a>
          </Box>
          <Box sx={{ color: 'text.disabled', fontSize: '0.95rem', mt: { xs: 1, md: 0 } }}>
            © {new Date().getFullYear()} FlatBuddies. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 