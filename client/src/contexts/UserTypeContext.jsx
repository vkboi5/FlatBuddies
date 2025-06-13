import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserTypeContext = createContext();

export const useUserType = () => {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
};

export const UserTypeProvider = ({ children }) => {
  const { userProfile } = useAuth();
  const [userType, setUserType] = useState(null);

  // Update userType when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setUserType(userProfile.userType || null);
    } else {
      setUserType(null);
    }
  }, [userProfile]);

  const updateUserType = (newType) => {
    setUserType(newType);
  };

  const value = {
    userType,
    setUserType: updateUserType,
  };

  return (
    <UserTypeContext.Provider value={value}>
      {children}
    </UserTypeContext.Provider>
  );
}; 