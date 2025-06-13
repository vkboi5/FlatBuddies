import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useState } from 'react';

const steps = ['Basic Info', 'Preferences', 'Lifestyle'];

export default function OnboardingQuestions({ userType, onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    age: '',
    occupation: '',
    gender: '',
    phone: '',
    
    // Preferences
    budget: [5000, 50000],
    location: '',
    roomType: '',
    moveInDate: '',
    
    // Lifestyle
    smoking: 'no',
    drinking: 'no',
    pets: 'no',
    cooking: 'no',
    workFromHome: 'no',
    nightLife: 'no',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete(formData);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderBasicInfo = () => (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            required
          />
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Occupation"
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            required
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderPreferences = () => (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography gutterBottom>Budget Range (₹)</Typography>
          <Slider
            value={formData.budget}
            onChange={(e, newValue) => handleChange('budget', newValue)}
            valueLabelDisplay="auto"
            min={5000}
            max={50000}
            step={1000}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Preferred Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
          />
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Room Type</InputLabel>
            <Select
              value={formData.roomType}
              onChange={(e) => handleChange('roomType', e.target.value)}
              required
            >
              <MenuItem value="single">Single Room</MenuItem>
              <MenuItem value="double">Double Sharing</MenuItem>
              <MenuItem value="triple">Triple Sharing</MenuItem>
              <MenuItem value="entire">Entire Flat</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <TextField
            fullWidth
            label="Expected Move-in Date"
            type="date"
            value={formData.moveInDate}
            onChange={(e) => handleChange('moveInDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderLifestyle = () => (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {[
          { label: 'Smoking', field: 'smoking' },
          { label: 'Drinking', field: 'drinking' },
          { label: 'Pets', field: 'pets' },
          { label: 'Cooking', field: 'cooking' },
          { label: 'Work from Home', field: 'workFromHome' },
          { label: 'Night Life', field: 'nightLife' },
        ].map(({ label, field }) => (
          <Grid xs={12} sm={6} md={4} key={field}>
            <FormControl fullWidth>
              <InputLabel>{label}</InputLabel>
              <Select
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                required
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
                <MenuItem value="sometimes">Sometimes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {userType === 'flatmate' ? 'Tell us about your property' : 'Tell us about yourself'}
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && renderBasicInfo()}
        {activeStep === 1 && renderPreferences()}
        {activeStep === 2 && renderLifestyle()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 