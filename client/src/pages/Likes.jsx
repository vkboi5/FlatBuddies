import React, { useState, useEffect, memo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Paper,
  Skeleton,
  Badge,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  LocationOn,
  Work as WorkIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Cake as CakeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ProfileCard = memo(({ profile, onLike, onDislike, onViewProfile, onStartChat, actionLoading }) => (
  <Grid item xs={12} sm={6} md={4} key={profile._id}>
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: 6,
        boxShadow: '0 4px 24px 0 rgba(36,81,166,0.10)',
        background: '#fff',
        border: 'none',
        transition: 'transform 0.18s, box-shadow 0.18s',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.03)',
          boxShadow: '0 12px 40px 0 rgba(36,81,166,0.13)',
        },
        p: 3,
        m: 0,
      }}
      onClick={() => onViewProfile(profile)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        <Avatar
          src={profile.photos?.length > 0 ? profile.photos[0] : '/assets/default-profile.jpg'}
          alt={profile.name || 'User'}
          sx={{ width: 96, height: 96, mb: 2, boxShadow: '0 4px 16px 0 rgba(36,81,166,0.10)', border: '4px solid #fff', fontSize: 36 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 1 }}>
          <Chip
            label={profile.userType === 'room_provider' ? 'Room Provider' : 'Looking for Room'}
            color={profile.userType === 'room_provider' ? 'primary' : 'secondary'}
            size="small"
            sx={{
              fontWeight: 700,
              borderRadius: '999px',
              fontSize: '1rem',
              px: 2.5,
              py: 1,
              background: profile.userType === 'room_provider' ? '#e3eafc' : '#ffe0ef',
              color: profile.userType === 'room_provider' ? '#2451a6' : '#d81b60',
              mb: 1.5
            }}
          />
        </Box>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mt: 1, color: '#2451a6', fontSize: '1.25rem' }}>
          {profile.name || 'Unknown User'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '1rem' }}>
          {profile.age ? `${profile.age} years old` : 'Age not specified'}
        </Typography>
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 0, width: '100%', px: 0 }}>
        <Stack spacing={1} sx={{ mb: 2 }}>
          {profile.location?.city && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2">
                {profile.location.city}
                {profile.location.area ? `, ${profile.location.area}` : ''}
              </Typography>
            </Box>
          )}
          {profile.occupation && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WorkIcon sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="body2">{profile.occupation}</Typography>
            </Box>
          )}
        </Stack>
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center', width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FavoriteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onLike(profile._id);
            }}
            disabled={actionLoading[profile._id]}
            aria-label={`Like ${profile.name || 'user'}'s profile`}
            sx={{
              borderRadius: '999px',
              fontWeight: 700,
              boxShadow: '0 2px 8px 0 rgba(36,81,166,0.10)',
              px: 3,
              py: 1.2,
              fontSize: '1.05rem',
              minWidth: 120,
              transition: 'background 0.18s',
              background: '#2451a6',
              color: '#fff',
              '&:hover': { background: '#1d3e7a' },
            }}
          >
            {actionLoading[profile._id] ? <CircularProgress size={24} /> : 'Like Back'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<MessageIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onStartChat(profile._id);
            }}
            aria-label={`Message ${profile.name || 'user'}`}
            sx={{
              borderRadius: '999px',
              fontWeight: 700,
              px: 3,
              py: 1.2,
              fontSize: '1.05rem',
              minWidth: 120,
              borderWidth: 2,
              transition: 'border-color 0.18s',
              color: '#2451a6',
              borderColor: '#2451a6',
              background: '#fff',
              '&:hover': { background: '#e3eafc', borderColor: '#2451a6', color: '#2451a6' },
            }}
          >
            Message
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Grid>
));

export default function Likes() {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    fetchLikes(abortController.signal);
    return () => abortController.abort();
  }, [currentUser]);

  const fetchLikes = async (signal) => {
    if (!currentUser) {
      toast.error('Please log in to view likes');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      
      // Fetch users who liked the current user
      const response = await fetch(`${API_BASE_URL}/api/profiles/liked-by`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch likes');
      }

      const usersWhoLiked = await response.json();
      setLikes(usersWhoLiked);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching likes:', error);
      toast.error('Failed to load likes');
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  };

  const handleLike = debounce(async (profileId) => {
    if (!currentUser) {
      toast.error('Please log in to like profiles');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [profileId]: true }));
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/like/${profileId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like profile');
      }

      const data = await response.json();
      if (data.isMatch) {
        toast.success("It's a match! 🎉");
      } else {
        toast.success('Profile liked successfully!');
      }
      fetchLikes(new AbortController().signal);
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error('Failed to like profile');
    } finally {
      setActionLoading((prev) => ({ ...prev, [profileId]: false }));
    }
  }, 500);

  const handleDislike = debounce(async (profileId) => {
    if (!currentUser) {
      toast.error('Please log in to remove likes');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [profileId]: true }));
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/dislike/${profileId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to dislike profile');
      }

      toast.success('Profile removed from likes');
      fetchLikes(new AbortController().signal);
    } catch (error) {
      console.error('Error disliking profile:', error);
      toast.error('Failed to remove profile from likes');
    } finally {
      setActionLoading((prev) => ({ ...prev, [profileId]: false }));
    }
  }, 500);

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setShowProfileDialog(true);
  };

  const handleStartChat = (profileId) => {
    navigate(`/messages`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{
      width: '100vw',
      minHeight: '100vh',
      background: '#f5f8fd',
      px: 0,
      py: 4,
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <Paper elevation={2} sx={{ p: 4, mb: 4, bgcolor: '#fff', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(36,81,166,0.10)', maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 900, color: '#2451a6' }}>
          Your Likes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          People who liked your profile
        </Typography>
      </Paper>

      {likes.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No one has liked your profile yet. Keep swiping to find your perfect match!
        </Alert>
      ) : (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Grid container spacing={4}>
            {likes.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                onLike={handleLike}
                onDislike={handleDislike}
                onViewProfile={handleViewProfile}
                onStartChat={handleStartChat}
                actionLoading={actionLoading}
              />
            ))}
          </Grid>
        </Box>
      )}

      <Dialog
        open={showProfileDialog && !!selectedProfile}
        onClose={() => setShowProfileDialog(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="profile-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 6,
            background: '#fff',
            boxShadow: '0 12px 48px 0 rgba(36,81,166,0.13)',
            p: { xs: 1, sm: 2 },
            minHeight: { xs: 0, sm: 500 },
            maxWidth: { xs: '95vw', sm: 700 },
          }
        }}
      >
        {selectedProfile ? (
          <>
            <DialogTitle id="profile-dialog-title" sx={{ p: { xs: 2, sm: 3 }, pb: 1.5, borderBottom: '1px solid #f0f2f7', mb: 0 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#2451a6', letterSpacing: 0.5 }}>Profile Details</Typography>
                <IconButton onClick={() => setShowProfileDialog(false)} aria-label="Close profile dialog">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ background: '#f7faff', p: { xs: 2, sm: 4 } }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Avatar
                      src={selectedProfile.photos?.length > 0 ? selectedProfile.photos[0] : '/assets/default-profile.jpg'}
                      alt={selectedProfile.name || 'User profile'}
                      sx={{ width: 110, height: 110, border: '4px solid #2451a6', boxShadow: '0 4px 24px 0 rgba(36,81,166,0.13)', fontSize: 48, bgcolor: '#e3eafc' }}
                    >
                      {(!selectedProfile.photos || selectedProfile.photos.length === 0) && (selectedProfile.name ? selectedProfile.name[0] : '?')}
                    </Avatar>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2451a6', mb: 1, textAlign: 'center' }}>
                    {selectedProfile.name || 'Unknown User'}
                  </Typography>
                  <Chip
                    label={selectedProfile.userType === 'room_provider' ? 'Room Provider' : 'Looking for Room'}
                    sx={{
                      fontWeight: 700,
                      borderRadius: '999px',
                      fontSize: '1rem',
                      px: 2.5,
                      py: 1,
                      background: selectedProfile.userType === 'room_provider' ? '#e3eafc' : '#ffe0ef',
                      color: selectedProfile.userType === 'room_provider' ? '#2451a6' : '#d81b60',
                      mb: 1.5,
                      textAlign: 'center',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#2451a6' }} /> About
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#222', fontSize: '1.08rem' }}>
                        {selectedProfile.profile?.bio || 'No bio provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <WorkIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#2451a6' }} /> Occupation
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#222', fontSize: '1.08rem' }}>
                        {selectedProfile.profile?.occupation || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <LocationOn sx={{ mr: 1, verticalAlign: 'middle', color: '#2451a6' }} /> Location
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#222', fontSize: '1.08rem' }}>
                        {selectedProfile.profile?.location?.city || 'Not specified'}
                        {selectedProfile.profile?.location?.area ? `, ${selectedProfile.profile.location.area}` : ''}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <CakeIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#2451a6' }} /> Age
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#222', fontSize: '1.08rem' }}>
                        {selectedProfile.profile?.age ? `${selectedProfile.profile.age} years old` : 'Not specified'}
                      </Typography>
                    </Box>
                    {selectedProfile.userType === 'room_provider' && selectedProfile.roomDetails && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#2451a6' }} /> Room Details
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#222', fontSize: '1.08rem' }}>
                          {selectedProfile.roomDetails.roomType || 'Not specified'} •{' '}
                          {selectedProfile.roomDetails.roomSize || 'N/A'} sq ft
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#222', fontSize: '1.08rem' }}>
                          Rent: ₹{selectedProfile.roomDetails.rent || 'N/A'}/month
                        </Typography>
                      </Box>
                    )}
                    {selectedProfile.profile?.interests && selectedProfile.profile.interests.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#2451a6' }} /> Interests
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedProfile.profile.interests.map((interest, index) => (
                            <Chip key={index} label={interest} size="small" sx={{ borderRadius: '999px', px: 2, py: 0.5, fontWeight: 600, bgcolor: '#e3eafc', color: '#2451a6', fontSize: '0.98rem' }} />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleDislike(selectedProfile._id)}
                color="error"
                disabled={actionLoading[selectedProfile._id]}
                aria-label={`Remove ${selectedProfile.name || 'user'} from likes`}
                sx={{
                  borderRadius: '999px',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  fontSize: '1.05rem',
                  minWidth: 120,
                  background: '#fff',
                  border: '2px solid #e53935',
                  color: '#e53935',
                  boxShadow: 'none',
                  '&:hover': { background: '#ffeaea', borderColor: '#e53935' },
                }}
              >
                Remove
              </Button>
              <Button
                onClick={() => handleLike(selectedProfile._id)}
                color="primary"
                variant="contained"
                disabled={actionLoading[selectedProfile._id]}
                aria-label={`Like ${selectedProfile.name || 'user'}'s profile`}
                sx={{
                  borderRadius: '999px',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  fontSize: '1.05rem',
                  minWidth: 120,
                  background: '#2451a6',
                  color: '#fff',
                  boxShadow: '0 2px 8px 0 rgba(36,81,166,0.10)',
                  '&:hover': { background: '#1d3e7a' },
                }}
              >
                Like Back
              </Button>
              <Button
                onClick={() => handleStartChat(selectedProfile._id)}
                color="primary"
                aria-label={`Message ${selectedProfile.name || 'user'}`}
                sx={{
                  borderRadius: '999px',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  fontSize: '1.05rem',
                  minWidth: 120,
                  background: '#fff',
                  border: '2px solid #2451a6',
                  color: '#2451a6',
                  boxShadow: 'none',
                  '&:hover': { background: '#e3eafc', borderColor: '#2451a6', color: '#2451a6' },
                }}
              >
                Message
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
            <Typography>Error: Profile not found</Typography>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}