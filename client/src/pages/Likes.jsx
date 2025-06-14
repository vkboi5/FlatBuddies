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
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      onClick={() => onViewProfile(profile)}
    >
      <CardMedia
        component="img"
        height="200"
        image={profile.photos?.length > 0 ? profile.photos[0] : '/assets/default-profile.jpg'}
        alt={profile.name || 'User profile'}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={profile.photos?.length > 0 ? profile.photos[0] : '/assets/default-profile.jpg'}
            alt={profile.name || 'User'}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" component="h2">
              {profile.name || 'Unknown User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.age ? `${profile.age} years old` : 'Age not specified'}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1} sx={{ mb: 2 }}>
          {profile.location?.city && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2">
                {profile.location.city}
                {profile.location.area ? `, ${profile.location.area}` : ''}
              </Typography>
            </Box>
          )}
          {profile.occupation && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2">{profile.occupation}</Typography>
            </Box>
          )}
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {profile.userType === 'room_provider' ? (
            <Chip
              icon={<HomeIcon />}
              label="Has a Room"
              color="primary"
              variant="outlined"
              size="small"
            />
          ) : (
            <Chip
              icon={<PersonIcon />}
              label="Looking for Room"
              color="secondary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
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
    navigate(`/chat/${profileId}`);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.default' }}>
        <Typography variant="h4" component="h1" gutterBottom>
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
      )}

      <Dialog
        open={showProfileDialog && !!selectedProfile}
        onClose={() => setShowProfileDialog(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="profile-dialog-title"
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
    </Container>
  );
}