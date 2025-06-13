import React, { createContext, useContext, useState } from 'react';

const UserTypeContext = createContext();

export const useUserType = () => {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
};

export const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);

  const value = {
    userType,
    setUserType,
  };

  return (
    <UserTypeContext.Provider value={value}>
      {children}
    </UserTypeContext.Provider>
  );
}; 