import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import { motion } from 'framer-motion';

const UserTypeModal = ({ open, onSelect }) => {
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

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2
        }
      }}
    >
      <DialogTitle align="center" sx={{ pb: 2 }}>
        <Typography variant="h4" component="span" gutterBottom>
          What Are You Looking For?
        </Typography>
        <Typography variant="subtitle1" component="span" color="text.secondary">
          Choose whether you're looking for a flat or a roommate
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4} justifyContent="center">
          {choices.map((choice) => (
            <Grid item xs={12} sm={6} key={choice.value}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    border: 2,
                    borderColor: 'primary.main',
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardActionArea onClick={() => onSelect(choice.value)}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={{ mb: 2 }}>{choice.icon}</Box>
                      <Typography variant="h5" gutterBottom>
                        {choice.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {choice.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UserTypeModal; 