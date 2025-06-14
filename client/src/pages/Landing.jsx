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

      {/* Match Visual Section */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 8, md: 10 },
        px: 2,
        background: 'linear-gradient(120deg, #f8fafc 0%, #e3e6f3 100%)',
        borderRadius: { xs: '32px', md: '48px' },
        boxShadow: '0 8px 32px 0 rgba(60,72,100,0.10)',
        my: { xs: 6, md: 8 },
        position: 'relative',
        zIndex: 3,
        maxWidth: 1200,
        mx: 'auto',
      }}>
        {/* Optional: Top Wave Divider */}
        <Box sx={{ width: '100%', lineHeight: 0, position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          <svg viewBox="0 0 1200 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 40, display: 'block' }}>
            <path d="M0 0h1200v20c-100 15-200 20-300 20s-200-5-300-20C500 10 400 5 300 5S100 10 0 20V0z" fill="#e3e6f3"/>
          </svg>
        </Box>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          color: 'primary.main',
          mb: 4,
          textAlign: 'center',
          fontSize: { xs: '1.5rem', md: '2.2rem' },
          letterSpacing: 1,
        }}>
          Discover beautiful spaces and amazing people
        </Typography>
        <Box sx={{
          position: 'relative',
          width: { xs: 320, sm: 420, md: 520 },
          height: { xs: 220, sm: 260, md: 300 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Roommate Card */}
          <Box sx={{
            position: 'absolute',
            left: { xs: 24, sm: 40, md: 60 },
            top: { xs: 40, sm: 50, md: 60 },
            zIndex: 1,
            width: { xs: 140, sm: 170, md: 200 },
            height: { xs: 170, sm: 200, md: 230 },
            borderRadius: 5,
            boxShadow: '0 8px 32px 0 rgba(60,72,100,0.18)',
            overflow: 'hidden',
            background: 'linear-gradient(120deg, #e3f2fd 0%, #e8eaf6 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2.5px solid #fff',
          }}>
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
              alt="Roommate"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(76, 110, 245, 0.85)',
              color: 'white',
              py: 1,
              px: 2,
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.1rem' },
              textAlign: 'center',
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
            }}>
              Friendly Roommate
            </Box>
          </Box>
          {/* Room Card */}
          <Box sx={{
            position: 'absolute',
            right: { xs: 24, sm: 40, md: 60 },
            bottom: { xs: 20, sm: 30, md: 40 },
            zIndex: 2,
            width: { xs: 170, sm: 210, md: 250 },
            height: { xs: 120, sm: 150, md: 180 },
            borderRadius: 5,
            boxShadow: '0 12px 36px 0 rgba(60,72,100,0.22)',
            overflow: 'hidden',
            background: 'linear-gradient(120deg, #fffbe6 0%, #ffe0b2 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2.5px solid #fff',
            transform: 'rotate(6deg)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
              alt="Room"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(255, 193, 7, 0.92)',
              color: '#232946',
              py: 1,
              px: 2,
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.1rem' },
              textAlign: 'center',
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
            }}>
              Beautiful Room
            </Box>
          </Box>
        </Box>
        {/* Optional: Bottom Wave Divider */}
        <Box sx={{ width: '100%', lineHeight: 0, position: 'absolute', bottom: 0, left: 0, zIndex: 1 }}>
          <svg viewBox="0 0 1200 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 40, display: 'block' }}>
            <path d="M0 20h1200V0c-100 15-200 20-300 20s-200-5-300-20C500 10 400 15 300 15S100 10 0 0v20z" fill="#e3e6f3"/>
          </svg>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: 'white', py: 10, position: 'relative', zIndex: 2 }}>
        <Container maxWidth="lg" sx={{ px: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, textAlign: 'center', mb: 7, color: 'primary.main', letterSpacing: 1 }}>
            How It Works
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            overflowX: { xs: 'auto', md: 'visible' },
            justifyContent: { xs: 'flex-start', md: 'center' },
            alignItems: 'stretch',
            pb: 2,
            mx: { xs: -2, md: 0 },
          }}>
            {/* Create Profile */}
            <Box sx={{ minWidth: { xs: 270, sm: 250, md: 0 }, flex: '1 1 0', maxWidth: 320 }}>
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
            </Box>
            {/* Set Preferences */}
            <Box sx={{ minWidth: { xs: 270, sm: 250, md: 0 }, flex: '1 1 0', maxWidth: 320 }}>
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
            </Box>
            {/* Find Flats */}
            <Box sx={{ minWidth: { xs: 270, sm: 250, md: 0 }, flex: '1 1 0', maxWidth: 320 }}>
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
            </Box>
            {/* Swipe and Match */}
            <Box sx={{ minWidth: { xs: 270, sm: 250, md: 0 }, flex: '1 1 0', maxWidth: 320 }}>
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
            </Box>
          </Box>
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
        background: 'linear-gradient(90deg, #232946 0%, #181c2f 100%)',
        borderTop: 'none',
        py: 7,
        mt: 0,
        textAlign: 'center',
        color: '#f8fafd',
        fontSize: { xs: '1.08rem', md: '1.18rem' },
        zIndex: 11,
        boxShadow: '0 -2px 24px 0 rgba(35,41,70,0.18)',
        position: 'relative',
      }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ fontWeight: 900, color: '#a3bffa', fontSize: '1.3rem', mb: { xs: 2, md: 0 }, letterSpacing: 1 }}>
            FlatBuddies
          </Box>
          <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" style={{ color: '#f8fafd', textDecoration: 'none', fontWeight: 600, fontSize: '1.08rem' }}>Home</a>
            <a href="/explore" style={{ color: '#f8fafd', textDecoration: 'none', fontWeight: 600, fontSize: '1.08rem' }}>Explore</a>
            <a href="/auth" style={{ color: '#f8fafd', textDecoration: 'none', fontWeight: 600, fontSize: '1.08rem' }}>Sign In</a>
          </Box>
          <Box sx={{ color: '#b8c1ec', fontSize: '1.05rem', mt: { xs: 2, md: 0 } }}>
            © {new Date().getFullYear()} FlatBuddies. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 