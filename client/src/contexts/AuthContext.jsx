import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const firebaseConfig = {
  apiKey: "AIzaSyAP3ruMIUK4A8AHo-I1AaRG6BFXv8gwXxQ",
  authDomain: "flatbuddies-e6e7b.firebaseapp.com",
  projectId: "flatbuddies-e6e7b",
  storageBucket: "flatbuddies-e6e7b.appspot.com",
  messagingSenderId: "643218990933",
  appId: "1:643218990933:web:5195d4928a69cd834231dc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  const fetchUserProfile = async (user) => {
    try {
      setProfileLoading(true);
      const token = await user.getIdToken();
      
      // First try to fetch existing profile
      const response = await fetch(`${API_BASE_URL}/api/profiles/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      } else {
        // If profile doesn't exist, create a basic one
        console.log('Profile not found, creating basic profile...');
        const basicProfile = {
          firebaseUid: user.uid,
          email: user.email,
          userType: 'room_seeker', // Default user type
          name: user.displayName || user.email?.split('@')[0] || 'New User',
          profile: {
            photos: [user.photoURL || ''],
            location: {
              type: 'Point',
              coordinates: [0, 0],
              city: '',
              area: ''
            },
            preferences: {
              budget: {
                min: 0,
                max: 0
              },
              roommates: {
                gender: 'any',
                ageRange: {
                  min: 18,
                  max: 99
                }
              },
              lifestyle: {
                cleanliness: 5,
                socialLevel: 5,
                workMode: 'office',
                smoking: 'no',
                pets: 'no',
                foodPreference: 'any'
              }
            }
          },
          onboarded: false
        };
        
        console.log('Creating profile with data:', basicProfile);
        const createResponse = await fetch(`${API_BASE_URL}/api/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(basicProfile)
        });

        if (createResponse.ok) {
          const createdProfile = await createResponse.json();
          console.log('Profile created successfully:', createdProfile);
          setUserProfile(createdProfile);
        } else {
          const errorText = await createResponse.text();
          console.error('Error creating basic profile:', errorText);
          throw new Error('Failed to create basic profile');
        }
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Immediately create a basic profile in MongoDB after Firebase registration
      const basicProfile = {
        firebaseUid: user.uid,
        email: user.email,
        userType: 'room_seeker', // Default user type
        name: user.displayName || user.email?.split('@')[0] || 'New User',
        profile: {
          photos: [user.photoURL || ''],
          location: {
            type: 'Point',
            coordinates: [0, 0],
            city: '',
            area: ''
          },
          preferences: {
            budget: {
              min: 0,
              max: 0
            },
            roommates: {
              gender: 'any',
              ageRange: {
                min: 18,
                max: 99
              }
            },
            lifestyle: {
              cleanliness: 5,
              socialLevel: 5,
              workMode: 'office',
              smoking: 'no',
              pets: 'no',
              foodPreference: 'any'
            }
          }
        },
        onboarded: false
      };

      const token = await user.getIdToken();
      const createResponse = await fetch(`${API_BASE_URL}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(basicProfile)
      });

      if (!createResponse.ok) {
        console.error('Error creating basic profile in MongoDB:', await createResponse.text());
        // Optionally, sign out the Firebase user if MongoDB profile creation fails
        await signOut(auth);
        throw new Error('Failed to create basic profile');
      }
      const createdProfile = await createResponse.json();
      setUserProfile(createdProfile);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Signup process error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user has a profile in MongoDB
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // If user doesn't have a profile, sign them out
        await signOut(auth);
        throw new Error('Please register first to create your profile');
      }
      
      return user;
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      } else if (error.message === 'Please register first to create your profile') {
        throw error;
      } else {
        throw new Error('Failed to log in. Please try again.');
      }
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateProfile = async (profileData) => {
    try {
      const token = await currentUser.getIdToken();
      // Ensure onboarded is set to true when updating profile
      const updatedProfileData = {
        ...profileData,
        onboarded: true
      };
      
      const response = await fetch(`${API_BASE_URL}/api/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const likeProfile = async (profileId) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/like/${profileId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like profile');
      }

      const data = await response.json();
      if (data.isMatch) {
        // Handle match notification
        console.log('It\'s a match!', data.message);
      }
      return data;
    } catch (error) {
      console.error('Error liking profile:', error);
      throw error;
    }
  };

  const dislikeProfile = async (profileId) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/dislike/${profileId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to dislike profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error disliking profile:', error);
      throw error;
    }
  };

  const postListing = async (listingData) => {
    try {
      const token = await currentUser.getIdToken();
      
      // Convert images to base64
      const imagePromises = listingData.images.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      // Update profile with listing data and base64 images
      const response = await fetch(`${API_BASE_URL}/api/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...userProfile,
          userType: 'room_provider',
          roomDetails: {
            ...listingData,
            images: base64Images
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post listing');
      }

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error posting listing:', error);
      throw error;
    }
  };

  const updateUserType = async (userType) => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userType }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user type');
      }

      const data = await res.json();
      setUserProfile(data);
      setUserChoice(userType);
      toast.success('User type updated successfully!');
    } catch (error) {
      console.error('Error updating user type:', error);
      toast.error('Failed to update user type.');
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    profileLoading,
    userChoice,
    setUserChoice,
    signup,
    login,
    logout,
    updateProfile,
    likeProfile,
    dislikeProfile,
    postListing,
    updateUserType,
    fetchUserProfile,
    setUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 