import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Slider,
  Switch,
  FormControlLabel,
  Button,
} from '@mui/material';

export default function Settings() {
  const [radius, setRadius] = useState(10);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleSave = () => {
    // TODO: Save settings to context/backend
    alert('Settings saved!');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>App Settings</Typography>
        <Box sx={{ my: 4 }}>
          <Typography gutterBottom>Search Radius (km)</Typography>
          <Slider
            value={radius}
            onChange={(_, value) => setRadius(value)}
            min={1}
            max={50}
            valueLabelDisplay="auto"
          />
          <Typography align="center" sx={{ mt: 1 }}>{radius} km</Typography>
        </Box>
        <FormControlLabel
          control={<Switch checked={notifications} onChange={() => setNotifications((n) => !n)} />}
          label="Enable Notifications"
        />
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="contained" onClick={handleSave}>Save Settings</Button>
        </Box>
      </Paper>
    </Container>
  );
} 