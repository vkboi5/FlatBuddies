import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile, loading } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) {
      if (!userProfile || !userProfile.onboarded) {
        // Profile not created or not onboarded yet, redirect to profile onboarding
        setIsProfileComplete(false);
        return;
      }
      // All good, profile is complete and onboarded
      setIsProfileComplete(true);
    } else if (!loading && !currentUser) {
      // Not logged in, not complete
      setIsProfileComplete(false);
    }
  }, [loading, currentUser, userProfile]);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  if (!isProfileComplete) {
    return <Navigate to="/onboarding/profile" />;
  }

  return children;
} 