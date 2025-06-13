import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile, userChoice, loading } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) {
      if (!userProfile) {
        // Profile not created yet, redirect to profile onboarding
        setIsProfileComplete(false);
        return;
      }
      if (!userChoice) {
        // Profile exists, but choice not made, redirect to choice onboarding
        setIsProfileComplete(false);
        return;
      }
      // All good, profile is complete and choice is made
      setIsProfileComplete(true);
    } else if (!loading && !currentUser) {
      // Not logged in, not complete
      setIsProfileComplete(false);
    }
  }, [loading, currentUser, userProfile, userChoice]);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  if (!isProfileComplete) {
    // Determine which onboarding page to go to
    if (!userProfile) {
      return <Navigate to="/onboarding/profile" />;
    }
    if (!userChoice) {
      return <Navigate to="/onboarding/choice" />;
    }
  }

  return children;
} 