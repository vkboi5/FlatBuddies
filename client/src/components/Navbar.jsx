import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, userProfile, setUserProfile, fetchUserProfile } = useAuth();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfileClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleCloseUserMenu();

    // If we're already on the profile page, don't navigate
    if (location.pathname === '/profile') {
      return;
    }

    try {
      // Ensure we have the latest profile data
      if (currentUser) {
        await fetchUserProfile(currentUser);
        // Only navigate after we have the profile data
        navigate('/profile', { replace: true });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleCloseUserMenu();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Search', icon: <SearchIcon />, path: '/explore' },
    { text: 'Post Listing', icon: <AddIcon />, path: '/post-listing', requiresProvider: userProfile?.userType === 'room_provider' },
    { text: 'Matches', icon: <PersonIcon />, path: '/matches' },
    { text: 'Likes', icon: <FavoriteIcon />, path: '/likes' },
    { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
  ];

  const userMenuItems = [
    { text: 'Profile', icon: <PersonIcon />, action: handleProfileClick },
    { text: 'Logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

      return (
      <AppBar position="sticky" elevation={0} sx={{
        background: '#fff',
        borderRadius: '2.5rem',
        top: { xs: 16, md: 24 },
        mt: { xs: 2, md: 3 },
        mx: { xs: 1, md: 'auto' },
        width: { xs: '98%', md: '92%' },
        border: '2.5px solid #2451a6',
        boxShadow: '0 8px 32px 0 rgba(36,81,166,0.10)',
        minHeight: 76,
        zIndex: 1201,
        transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
      }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 900,
              fontSize: '2.1rem',
              letterSpacing: 1,
              color: '#2451a6',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.18s',
              '&:hover': {
                color: '#1d3e7a',
              },
            }}
          >
            <span style={{fontWeight: 900, letterSpacing: 2}}>Flat</span>
            <span style={{fontWeight: 900, letterSpacing: 1}}>Buddies</span>
          </Typography>

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              sx={{ color: '#2451a6', mr: 2, bgcolor: 'rgba(36,81,166,0.08)', borderRadius: 2, '&:hover': { bgcolor: 'rgba(36,81,166,0.15)' } }}
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Mobile logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 900,
              fontSize: '1.5rem',
              color: '#2451a6',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                color: '#1d3e7a',
              },
              textShadow: '0 2px 8px rgba(36,81,166,0.08)'
            }}
          >
            <span style={{fontWeight: 900, color: '#2451a6'}}>Flat</span><span style={{fontWeight: 400, color: '#4a5fa7'}}>Buddies</span>
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {navItems.map((item) => {
              if (item.requiresProvider && userProfile?.userType !== 'room_provider') return null;
              return (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    my: 2,
                    color: location.pathname === item.path ? '#fff' : '#2451a6',
                    background: location.pathname === item.path ? 'linear-gradient(90deg, #2451a6 0%, #4a5fa7 100%)' : 'transparent',
                    fontWeight: 700,
                    borderRadius: '999px',
                    px: 2.5,
                    py: 1.2,
                    mx: 1.2,
                    fontSize: '1rem',
                    boxShadow: location.pathname === item.path ? '0 2px 12px 0 rgba(36,81,166,0.10)' : 'none',
                    position: 'relative',
                    transition: 'all 0.18s',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #4a5fa7 0%, #2451a6 100%)',
                      color: '#fff',
                      boxShadow: '0 2px 12px 0 rgba(36,81,166,0.13)'
                    },
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {currentUser ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                    <Avatar 
                      alt={userProfile?.profile?.name || currentUser.displayName || 'User'} 
                      src={userProfile?.profile?.photos?.[0] || currentUser.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.profile?.name || currentUser.displayName || 'User'}`}
                      sx={{
                        border: '3px solid #2451a6',
                        background: '#e3f2fd',
                        color: '#2451a6',
                        boxShadow: '0 4px 16px 0 rgba(36,81,166,0.10)',
                        width: 48,
                        height: 48,
                        transition: 'all 0.18s',
                        '&:hover': {
                          borderColor: '#4a5fa7',
                          boxShadow: '0 6px 24px 0 rgba(36,81,166,0.13)',
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px', '& .MuiPaper-root': { borderRadius: 3, boxShadow: '0 8px 32px 0 rgba(36,81,166,0.16)' } }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userMenuItems.map((item) => (
                    <MenuItem key={item.text} onClick={item.action} sx={{ borderRadius: 2, my: 0.5, px: 2 }}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <Typography textAlign="center">{item.text}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/auth"
                color="primary"
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: '999px',
                  fontWeight: 700,
                  px: 2.5,
                  py: 1.2,
                  fontSize: '1rem',
                  boxShadow: '0 2px 12px 0 rgba(36,81,166,0.10)',
                  background: 'linear-gradient(90deg, #2451a6 0%, #4a5fa7 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #4a5fa7 0%, #2451a6 100%)',
                    color: '#fff',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(120deg, #e3f2fd 0%, #b3c7f7 100%)',
            boxShadow: '0 8px 32px 0 rgba(36,81,166,0.16)',
            borderTopRightRadius: 32,
            borderBottomRightRadius: 32,
            borderTopLeftRadius: 32,
            borderBottomLeftRadius: 32,
            width: 270,
            py: 2,
            border: '2.5px solid #2451a6',
          }
        }}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  borderRadius: 2,
                  my: 1,
                  px: 2,
                  py: 1.5,
                  background: location.pathname === item.path ? 'linear-gradient(90deg, #2451a6 0%, #4a5fa7 100%)' : 'transparent',
                  color: location.pathname === item.path ? '#fff' : '#2451a6',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #4a5fa7 0%, #2451a6 100%)',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit', fontSize: 28 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
} 