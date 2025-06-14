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
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import { motion } from 'framer-motion';

const UserTypeModal = ({ open, onSelect }) => {
  const theme = useTheme();
  const choices = [
    {
      value: 'room_seeker',
      label: 'Flats',
      description: 'I need a place to stay',
      icon: <HomeIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
      hoverGradient: 'linear-gradient(135deg, #000DFF 0%, #6B73FF 100%)',
    },
    {
      value: 'room_provider',
      label: 'Flatmate',
      description: 'I have a flat, looking for a roommate',
      icon: <GroupIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF000D 100%)',
      hoverGradient: 'linear-gradient(135deg, #FF000D 0%, #FF6B6B 100%)',
    },
  ];

  return (
    <Dialog 
      open={open} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          overflow: 'hidden',
          maxWidth: 420,
          mx: 'auto',
        }
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(120deg, #f6f9fc 0%, #eef2f7 100%)',
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <DialogTitle 
          align="center" 
          sx={{ 
            pb: 1,
            '& .MuiTypography-root': {
              background: 'linear-gradient(90deg, #2B32B2 0%, #1488CC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: { xs: '1.3rem', sm: '1.6rem' },
            }
          }}
        >
          Welcome to FlatBuddies!
        </DialogTitle>
        <Typography 
          variant="subtitle2" 
          align="center" 
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            maxWidth: '90%',
            mx: 'auto',
            lineHeight: 1.4,
            fontSize: '0.98rem',
          }}
        >
          Choose whether you're looking for a flat or a roommate
        </Typography>
      </Box>

      <DialogContent sx={{ p: 2 }}>
        <Box display="flex" flexDirection="row" gap={2} justifyContent="center" alignItems="stretch">
          {choices.map((choice) => (
            <motion.div
              key={choice.value}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              style={{ flex: 1, minWidth: 0 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  minWidth: 140,
                  maxWidth: 170,
                  mx: 'auto',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: choice.gradient,
                    opacity: 0.08,
                    transition: 'opacity 0.3s ease-in-out',
                  },
                  '&:hover::before': {
                    opacity: 0.13,
                    background: choice.hoverGradient,
                  },
                  '&:hover': {
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.10)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardActionArea 
                  onClick={() => onSelect(choice.value)}
                  sx={{ 
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 170,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                      background: choice.gradient,
                      color: 'white',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: choice.hoverGradient,
                        transform: 'scale(1.08) rotate(4deg)',
                      },
                    }}
                  >
                    {React.cloneElement(choice.icon, { sx: { fontSize: 28 } })}
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      background: choice.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.1rem',
                    }}
                  >
                    {choice.label}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    align="center"
                    sx={{ 
                      fontWeight: 500,
                      maxWidth: '90%',
                      mx: 'auto',
                      lineHeight: 1.4,
                      fontSize: '0.95rem',
                    }}
                  >
                    {choice.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </motion.div>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserTypeModal; 