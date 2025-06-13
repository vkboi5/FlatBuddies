import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from './AuthContext';

const MatchContext = createContext();

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};

export const MatchProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPotentialMatches = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/potential`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch potential matches');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching potential matches:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMatches = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/matches`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      setMatches(data);
      return data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const likeUser = async (userId) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/like/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like user');
      }

      const data = await response.json();
      if (data.isMatch) {
        setMatches(prev => [...prev, data.match]);
      }
      return data;
    } catch (error) {
      console.error('Error liking user:', error);
      throw error;
    }
  };

  const rejectUser = async (userId) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/dislike/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  };

  const unmatch = async (matchId) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/unmatch/${matchId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to unmatch');
      }

      setMatches(prev => prev.filter(match => match._id !== matchId));
      return await response.json();
    } catch (error) {
      console.error('Error unmatching:', error);
      throw error;
    }
  };

  const value = {
    matches,
    loading,
    getPotentialMatches,
    getMatches,
    likeUser,
    rejectUser,
    unmatch
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};

export default MatchContext; 