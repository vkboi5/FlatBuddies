import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Container, Paper, CircularProgress, Typography } from '@mui/material';

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile, loading, profileLoading } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!loading && currentUser) {
        if (!userProfile) {
          setIsProfileComplete(false);
          setIsChecking(false);
          return;
        }
        
        // Check if profile is onboarded
        if (!userProfile.onboarded) {
          setIsProfileComplete(false);
          setIsChecking(false);
          return;
        }
        
        // All good, profile is complete and onboarded
        setIsProfileComplete(true);
        setIsChecking(false);
      } else if (!loading && !currentUser) {
        // Not logged in
        setIsProfileComplete(false);
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [loading, currentUser, userProfile]);

  // Show loading state while checking authentication and profile
  if (loading || profileLoading || isChecking) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Not logged in, redirect to auth
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // Profile not complete, redirect to onboarding
  if (!isProfileComplete) {
    return <Navigate to="/onboarding/profile" replace />;
  }

  // All checks passed, render the protected content
  return children;
} 