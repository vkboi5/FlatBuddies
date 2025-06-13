import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

export default function UserTypeSelection({ onSelect }) {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to FlatBuddies
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Let's get started! What brings you here?
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: (theme) => theme.shadows[8],
              },
            }}
            onClick={() => onSelect('flatmate')}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
              <HomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Looking for a Flatmate
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You have a property and want to find the perfect flatmate to share it with.
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                I'm Looking for a Flatmate
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: (theme) => theme.shadows[8],
              },
            }}
            onClick={() => onSelect('roommate')}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
              <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Looking for a Room
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You're searching for a place to stay and want to find the perfect room or flat.
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                I'm Looking for a Room
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 