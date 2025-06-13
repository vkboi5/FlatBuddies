import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Matches() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (!currentUser) return;

        const token = await currentUser.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          'http://localhost:5000/api/profiles/matches',
          config
        );
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast.error('Failed to load matches.');
      }
    };

    fetchMatches();
  }, [currentUser]);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Your Matches
        </Typography>
        <List>
          {matches.length > 0 ? (
            matches.map((match) => (
              <ListItem key={match._id} sx={{ mb: 2 }}>
                <ListItemAvatar>
                  <Avatar src={match.profile?.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={match.profile?.name || match.roomDetails?.name}
                  secondary={match.profile?.location?.address || match.roomDetails?.location?.address}
                />
              </ListItem>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="text.secondary">No matches yet. Start swiping!</Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Container>
  );
} 