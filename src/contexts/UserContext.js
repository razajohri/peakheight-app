import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { AuthService } from '../services/auth';
import { DailyPlanService } from '../services/dailyPlanService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  // Fetch user progress from daily plan
  const fetchUserProgress = async (userId) => {
    try {
      const progress = await DailyPlanService.getUserProgress(userId);
      setUserProgress(progress);
      return progress;
    } catch (err) {
      console.error('Error fetching user progress:', err);
      return null;
    }
  };

  // Fetch user profile from database
  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const { profile, error } = await AuthService.getUserProfile(userId);

      if (error) {
        throw new Error(error);
      }

      setUserProfile(profile);

      // Also fetch user progress for streak data
      await fetchUserProgress(userId);

      return profile;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!user) return null;

      const { profile, error } = await AuthService.updateUserProfile(user.id, updates);

      if (error) {
        throw new Error(error);
      }

      setUserProfile(profile);
      return profile;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message);
      return null;
    }
  };

  // Get current user from Supabase Auth
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        // Don't treat "no session" as an error - it's normal on app startup
        if (error.message.includes('session') || error.message.includes('Auth')) {
          console.log('No active session found - user needs to sign in');
          setUser(null);
          setLoading(false);
          return null;
        }
        throw new Error(error.message);
      }

      setUser(user);

      if (user) {
        await fetchUserProfile(user.id);
      } else {
        setLoading(false);
      }

      return user;
    } catch (err) {
      console.error('Error getting current user:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await AuthService.signOut();

      if (error) {
        throw new Error(error);
      }

      setUser(null);
      setUserProfile(null);
      setError(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
    }
  };

  // Get initial user (auth state changes are handled in App.js)
  useEffect(() => {
    getCurrentUser();
  }, []);

  // Helper functions for user data
  const getUserDisplayName = () => {
    // Use first name if available, otherwise fall back to display_name or email prefix
    if (userProfile?.first_name) {
      return userProfile.first_name;
    }
    return userProfile?.display_name || user?.email?.split('@')[0] || 'User';
  };

  const getCurrentHeight = () => {
    const raw = userProfile?.current_height;
    if (raw === null || raw === undefined) return null;

    const cm = Number(raw);
    if (!Number.isFinite(cm) || cm <= 0) return null;

    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);

    return {
      cm: Math.round(cm),
      feet,
      inches,
      display: `${feet}'${inches}"`
    };
  };

  const getTargetHeight = () => {
    const raw = userProfile?.target_height;
    if (raw === null || raw === undefined) return null;

    const cm = Number(raw);
    if (!Number.isFinite(cm) || cm <= 0) return null;

    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);

    return {
      cm: Math.round(cm),
      feet,
      inches,
      display: `${feet}'${inches}"`
    };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';

    if (hour >= 12 && hour < 17) {
      greeting = 'Good afternoon';
    } else if (hour >= 17) {
      greeting = 'Good evening';
    }

    return `${greeting}, ${getUserDisplayName()}`;
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    userProgress,
    fetchUserProfile,
    updateUserProfile,
    getCurrentUser,
    signOut,
    getUserDisplayName,
    getCurrentHeight,
    getTargetHeight,
    getGreeting,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
