import React, { useEffect, useState } from 'react';
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
import bgImg from '../assets/landingPagePic1.png';
import beautifulRoomImg from '../assets/BeautifulRoom.png';
import friendlyRoommateImg from '../assets/friendly-roommate.jpg';


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

// TypewriterWords component for typewriting animation
const words = ['Roommate', 'Flat'];
function TypewriterWords() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    let timeout;
    let word = words[index];
    if (displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else {
      timeout = setTimeout(() => {
        setShowCursor(false);
        setTimeout(() => {
          setShowCursor(true);
          setDisplayed('');
          setIndex((prev) => (prev + 1) % words.length);
        }, 900);
      }, 1200);
    }
    return () => clearTimeout(timeout);
  }, [displayed, index]);
  return (
    <Typography
      variant="h2"
      component="span"
      sx={{
        fontWeight: 900,
        fontSize: { xs: '2.2rem', md: '3.5rem' },
        color: '#2451a6',
        letterSpacing: 1,
        lineHeight: 1.1,
        display: 'inline-block',
        minWidth: 210,
      }}
    >
      {displayed}
      <span className="typewriter-cursor">|</span>
    </Typography>
  );
}

// Add global style for blinking cursor
const style = document.createElement('style');
style.innerHTML = `.typewriter-cursor { animation: blink 1s steps(1) infinite; }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`;
document.head.appendChild(style);

const Landing = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f5f8fd',
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
        background: 'radial-gradient(circle at 60% 40%, #2451a622 0%, #f5f8fd00 80%)',
        zIndex: 0,
        filter: 'blur(8px)'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 260,
        height: 260,
        background: 'radial-gradient(circle at 40% 60%, #b3c7f722 0%, #f5f8fd00 80%)',
        zIndex: 0,
        filter: 'blur(8px)'
      }} />
      {/* Hero Section */}
      <Box sx={{ width: '100%', maxWidth: 'lg', mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 6, md: 8 },
        }}>
          {/* Left: Content */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, fontSize: { xs: '2.2rem', md: '3.5rem' }, mb: 0.5, letterSpacing: 1, lineHeight: 1.1, color: '#2451a6', textAlign: { xs: 'center', md: 'left' } }}>
              Find Your Perfect
          </Typography>
            <Box sx={{ minHeight: { xs: 48, md: 60 }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
              <TypewriterWords />
            </Box>
            <Typography variant="h5" sx={{ color: '#2451a6', mb: 4, maxWidth: 600, fontWeight: 400, fontSize: { xs: '1.1rem', md: '1.5rem' }, mx: { xs: 'auto', md: 0 }, textAlign: { xs: 'center', md: 'left' }, lineHeight: 1.6 }}>
              RoomEase makes it easy to find compatible roommates and ideal living spaces.<br />
              <span style={{ color: '#2451a6', fontWeight: 600 }}>Join our community and start your journey to better living.</span>
          </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'center', gap: 2, mt: 3 }}>
            <Button
              component={Link}
                to="/auth"
              variant="contained"
              size="large"
                endIcon={<ArrowForward />}
              sx={{
                  px: 5,
                  py: 1.7,
                borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  background: '#2451a6',
                  boxShadow: '0 4px 24px 0 rgba(60,72,100,0.10)',
                  color: 'white',
                  '&:hover': { background: '#1d3e7a' },
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
                  backgroundColor: '#fff',
                  color: '#2451a6',
                  border: '2px solid #2451a6',
                  boxShadow: '0 2px 8px 0 rgba(60,72,100,0.08)',
                  '&:hover': { backgroundColor: '#e3eafc', borderColor: '#2451a6', color: '#1d3e7a' },
                  transition: 'all 0.18s',
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
          {/* Right: Hero Image */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, alignItems: 'center', mt: { xs: 5, md: 0 } }}>
            <Box
              component="img"
              src={bgImg}
              alt="Roommates moving in illustration"
              sx={{
                width: { xs: 320, sm: 420, md: 600 },
                maxWidth: '100%',
                borderRadius: 6,
                objectFit: 'contain',
                background: 'none',
                p: 0,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* One-liner Message Bridge (revamped) */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 3,
        background: 'transparent',
        position: 'relative',
        zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Box sx={{
            px: 4,
            py: 2.2,
            bgcolor: '#e3eafc',
            borderRadius: '999px',
            boxShadow: '0 2px 16px 0 rgba(60,72,100,0.08)',
            display: 'inline-block',
            minWidth: { xs: 260, md: 420 },
            textAlign: 'center',
          }}>
            <Typography variant="h5" sx={{
              fontWeight: 800,
              color: '#2451a6',
              fontSize: { xs: '1.25rem', md: '1.7rem' },
              letterSpacing: 0.5,
            }}>
              Your next home is just a match away!
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {/* Match Visual Section */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 8, md: 10 },
        px: { xs: 2, md: 6 },
        background: 'linear-gradient(120deg, #e3f2fd 0%, #b3c7f7 100%)',
        borderRadius: { xs: '32px', md: '48px' },
        boxShadow: '0 8px 32px 0 rgba(60,72,100,0.10)',
        my: { xs: 6, md: 8 },
        position: 'relative',
        zIndex: 3,
        maxWidth: 1300,
        mx: 'auto',
        minHeight: { xs: 480, md: 420 },
      }}>
        {/* Left: Text */}
        <Box sx={{ flex: 1, minWidth: 280, pr: { md: 6 }, mb: { xs: 5, md: 0 } }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography variant="h3" sx={{
              fontWeight: 900,
              color: '#2451a6',
              mb: 2,
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '2rem', md: '2.7rem' },
              letterSpacing: 1,
              lineHeight: 1.15,
            }}>
              Discover beautiful spaces and amazing people
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
              <Box sx={{ width: 64, height: 5, borderRadius: 3, bgcolor: '#b3c7f7' }} />
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#4a5fa7', textAlign: { xs: 'center', md: 'left' }, fontWeight: 500, fontSize: { xs: '1.05rem', md: '1.18rem' }, mb: 2 }}>
              Explore curated rooms and connect with like-minded roommates in a community built for you.
            </Typography>
          </motion.div>
        </Box>
        {/* Right: Visual Card Stack */}
        <Box sx={{
          flex: 1.2,
          minWidth: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: { xs: 320, sm: 380, md: 420 },
        }}>
          {/* Floating Card Stack */}
          <Box sx={{
            position: 'absolute',
            left: { xs: 0, md: 40 },
            top: { xs: 40, md: 60 },
            zIndex: 1,
            width: { xs: 180, sm: 220, md: 260 },
            height: { xs: 220, sm: 260, md: 300 },
            borderRadius: 7,
            boxShadow: '0 12px 48px 0 rgba(36,81,166,0.18)',
            overflow: 'hidden',
            background: 'linear-gradient(120deg, #2451a6 0%, #b3c7f7 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3.5px solid #fff',
            transform: 'rotate(-8deg)',
          }}>
            <img
              src={friendlyRoommateImg}
              alt="Friendly Roommate"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.93 }}
            />
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(36,81,166,0.92)',
              color: 'white',
              py: 1.2,
              px: 2,
              fontWeight: 700,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              textAlign: 'center',
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              letterSpacing: 0.5,
              boxShadow: '0 2px 12px 0 rgba(36,81,166,0.10)',
            }}>
              Friendly Roommate
            </Box>
          </Box>
          <Box sx={{
            position: 'absolute',
            right: { xs: 0, md: 40 },
            bottom: { xs: 0, md: 30 },
            zIndex: 2,
            width: { xs: 210, sm: 260, md: 320 },
            height: { xs: 150, sm: 200, md: 240 },
            borderRadius: 7,
            boxShadow: '0 16px 56px 0 rgba(36,81,166,0.22)',
            overflow: 'hidden',
            background: 'linear-gradient(120deg, #b3c7f7 0%, #e3f2fd 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3.5px solid #fff',
            transform: 'rotate(7deg)',
          }}>
            <img
              src={beautifulRoomImg}
              alt="Beautiful Room"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.97 }}
            />
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: '#e3f2fd',
              color: '#2451a6',
              py: 1.2,
              px: 2,
              fontWeight: 800,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              textAlign: 'center',
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              letterSpacing: 0.5,
              boxShadow: '0 2px 12px 0 rgba(36,81,166,0.10)',
            }}>
              Beautiful Room
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: 'white', py: 10, position: 'relative', zIndex: 2 }}>
        <Container maxWidth="lg" sx={{ px: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, textAlign: 'center', mb: 7, color: 'primary.main', letterSpacing: 1 }}>
            <span style={{ color: '#2451a6' }}>How It Works</span>
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
                      background: '#2451a6',
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
                    <span style={{ color: '#2451a6' }}>Create a Profile</span>
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
                      background: '#b3c7f7',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2451a6',
                      fontSize: 36,
                      boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)'
                    }}>
                  <FaSearch />
                    </Box>
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    <span style={{ color: '#2451a6' }}>Set Preferences</span>
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
                      background: '#2451a6',
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
                    <span style={{ color: '#2451a6' }}>Find Flats</span>
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
                      background: '#b3c7f7',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2451a6',
                      fontSize: 36,
                      boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)'
                    }}>
                  <FaArrowsAltH />
                    </Box>
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    <span style={{ color: '#2451a6' }}>Swipe and Match</span>
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
        background: '#2451a6',
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
            to="/auth"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              background: '#fff',
              color: '#2451a6',
              px: 5,
              py: 1.7,
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '1.2rem',
              boxShadow: '0 4px 24px 0 rgba(60,72,100,0.10)',
              '&:hover': { background: '#b3c7f7', color: '#2451a6' },
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
        background: '#232946',
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