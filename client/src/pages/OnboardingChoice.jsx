import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const choices = [
  {
    value: 'room_provider',
    label: 'Flatmate',
    description: 'I have a flat, looking for a roommate',
    icon: <GroupIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
  },
  {
    value: 'room_seeker',
    label: 'Flats',
    description: 'I need a place to stay',
    icon: <HomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
  },
];

export default function OnboardingChoice() {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { setUserChoice, updateUserType } = useAuth();

  const handleSelect = (value) => {
    setSelected(value);
  };

  const handleContinue = async () => {
    if (!selected) return;
    
    try {
      setSaving(true);
      // Update user type in backend
      await updateUserType(selected);
      // Update local state
      setUserChoice(selected);
      toast.success('Profile updated successfully!');
      navigate('/explore');
    } catch (error) {
      console.error('Error updating user type:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          What Are You Looking For?
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Choose whether you're looking for a flat or a roommate
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {choices.map((choice) => (
            <Grid key={choice.value} sx={{ width: { xs: '100%', sm: '50%' } }}>
              <Card
                sx={{
                  border: selected === choice.value ? 2 : 1,
                  borderColor: selected === choice.value ? 'primary.main' : 'grey.300',
                  boxShadow: selected === choice.value ? 4 : 1,
                  transition: 'all 0.2s',
                  borderRadius: 3,
                  opacity: saving ? 0.7 : 1,
                  pointerEvents: saving ? 'none' : 'auto',
                }}
              >
                <CardActionArea onClick={() => handleSelect(choice.value)}>
                  <CardContent sx={{ textAlign: 'center', py: 5 }}>
                    <Box sx={{ mb: 2 }}>{choice.icon}</Box>
                    <Typography variant="h5" gutterBottom>{choice.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{choice.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            disabled={!selected || saving}
            onClick={handleContinue}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {saving ? 'Saving...' : 'Continue'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 