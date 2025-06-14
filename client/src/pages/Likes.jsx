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
        cursor: 'pointer',
        borderRadius: 4,
        boxShadow: '0 4px 24px 0 rgba(60,72,100,0.08)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6f3 100%)',
        border: profile.userType === 'room_provider' ? '2px solid #6c63ff' : '2px solid #48c6ef',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: '0 8px 32px 0 rgba(60,72,100,0.16)',
        },
        p: 1.5,
      }}
      onClick={() => onViewProfile(profile)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        <Avatar
          src={profile.photos?.length > 0 ? profile.photos[0] : '/assets/default-profile.jpg'}
          alt={profile.name || 'User'}
          sx={{ width: 84, height: 84, mb: 1, boxShadow: 2, border: '3px solid #fff' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 1 }}>
          <Chip
            label={profile.userType === 'room_provider' ? 'Room Provider' : 'Looking for Room'}
            color={profile.userType === 'room_provider' ? 'primary' : 'secondary'}
            size="small"
            sx={{ fontWeight: 600, borderRadius: 2, fontSize: '0.95rem', px: 2 }}
          />
        </Box>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mt: 1, color: '#3f51b5' }}>
          {profile.name || 'Unknown User'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {profile.age ? `${profile.age} years old` : 'Age not specified'}
        </Typography>
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Stack spacing={1} sx={{ mb: 2 }}>
          {profile.location?.city && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2">
                {profile.location.city}
                {profile.location.area ? `, ${profile.location.area}` : ''}
              </Typography>
            </Box>
          )}
          {profile.occupation && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="body2">{profile.occupation}</Typography>
            </Box>
          )}
        </Stack>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<FavoriteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onLike(profile._id);
            }}
            disabled={actionLoading[profile._id]}
            aria-label={`Like ${profile.name || 'user'}'s profile`}
            sx={{
              borderRadius: '999px',
              fontWeight: 600,
              boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)',
              px: 2,
              py: 1,
              fontSize: '1rem',
              transition: 'background 0.2s',
            }}
          >
            {actionLoading[profile._id] ? <CircularProgress size={24} /> : 'Like Back'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<MessageIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onStartChat(profile._id);
            }}
            aria-label={`Message ${profile.name || 'user'}`}
            sx={{
              borderRadius: '999px',
              fontWeight: 600,
              px: 2,
              py: 1,
              fontSize: '1rem',
              borderWidth: 2,
              transition: 'border-color 0.2s',
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
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3e6f3 100%)',
      px: 0,
      py: 4,
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.default', maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#3f51b5' }}>
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
          <Grid container spacing={3}>
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
            borderRadius: 4,
            background: 'linear-gradient(120deg, #f8fafc 0%, #e3e6f3 100%)',
            boxShadow: '0 8px 32px 0 rgba(60,72,100,0.16)'
          }
        }}
      >
        {selectedProfile ? (
          <>
            <DialogTitle id="profile-dialog-title">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Profile Details</Typography>
                <IconButton onClick={() => setShowProfileDialog(false)} aria-label="Close profile dialog">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CardMedia
                    component="img"
                    image={selectedProfile.photos?.length > 0 ? selectedProfile.photos[0] : '/assets/default-profile.jpg'}
                    alt={selectedProfile.name || 'User profile'}
                    sx={{ width: '100%', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" gutterBottom>
                    {selectedProfile.name || 'Unknown User'}
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        About
                      </Typography>
                      <Typography variant="body1">
                        {selectedProfile.profile?.bio || 'No bio provided'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Occupation
                      </Typography>
                      <Typography variant="body1">
                        {selectedProfile.profile?.occupation || 'Not specified'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {selectedProfile.profile?.location?.city || 'Not specified'}
                        {selectedProfile.profile?.location?.area ? `, ${selectedProfile.profile.location.area}` : ''}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <CakeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Age
                      </Typography>
                      <Typography variant="body1">
                        {selectedProfile.profile?.age ? `${selectedProfile.profile.age} years old` : 'Not specified'}
                      </Typography>
                    </Box>

                    {selectedProfile.userType === 'room_provider' && selectedProfile.roomDetails && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Room Details
                        </Typography>
                        <Typography variant="body1">
                          {selectedProfile.roomDetails.roomType || 'Not specified'} •{' '}
                          {selectedProfile.roomDetails.roomSize || 'N/A'} sq ft
                        </Typography>
                        <Typography variant="body1">
                          Rent: ₹{selectedProfile.roomDetails.rent || 'N/A'}/month
                        </Typography>
                      </Box>
                    )}

                    {selectedProfile.profile?.interests && selectedProfile.profile.interests.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Interests
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedProfile.profile.interests.map((interest, index) => (
                            <Chip key={index} label={interest} size="small" />
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
              >
                Remove
              </Button>
              <Button
                onClick={() => handleLike(selectedProfile._id)}
                color="primary"
                variant="contained"
                disabled={actionLoading[selectedProfile._id]}
                aria-label={`Like ${selectedProfile.name || 'user'}'s profile`}
              >
                Like Back
              </Button>
              <Button
                onClick={() => handleStartChat(selectedProfile._id)}
                color="primary"
                aria-label={`Message ${selectedProfile.name || 'user'}`}
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