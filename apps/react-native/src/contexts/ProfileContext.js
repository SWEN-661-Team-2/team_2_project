import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import CaregiverProfile from '../models/CaregiverProfile';

const PROFILE_KEY = 'careconnect:caregiver_profile_v1';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(new CaregiverProfile());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile(CaregiverProfile.fromJson(parsed));
      }
    } catch (e) {
      console.warn('Failed to load profile', e);
    } finally {
      setLoaded(true);
    }
  };

  const save = async (newProfile) => {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile.toJson()));
      setProfile(CaregiverProfile.fromJson(newProfile.toJson()));
    } catch (e) {
      console.warn('Failed to save profile', e);
    }
  };

  // Save a photo URI by copying the picked file into app's document directory
  const savePhoto = async (localUri) => {
    try {
      if (!localUri) return null;
      const destDir = FileSystem.documentDirectory + 'profile_photos/';
      await FileSystem.makeDirectoryAsync(destDir, { intermediates: true }).catch(() => {});
      const ext = localUri.split('.').pop().split('?')[0];
      const dest = destDir + `caregiver_${Date.now()}.${ext}`;
      await FileSystem.copyAsync({ from: localUri, to: dest });
      return dest;
    } catch (e) {
      console.warn('Failed to save photo', e);
      return localUri;
    }
  };

  const updateField = async (fields) => {
    const updated = { ...profile, ...fields };
    await save(new CaregiverProfile(updated));
  };

  return (
    <ProfileContext.Provider value={{ profile, loaded, load, save, updateField, savePhoto }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};
