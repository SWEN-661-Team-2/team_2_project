import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File } from 'expo-file-system/next';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

  const savePhoto = async (localUri) => {
    try {
      if (!localUri) return null;
      const destDir = new Directory('profile_photos/');
      if (!destDir.exists) destDir.create();
      const ext = localUri.split('.').pop().split('?')[0];
      const dest = new File(destDir, `caregiver_${Date.now()}.${ext}`);
      const src = new File(localUri);
      src.copy(dest);
      return dest.uri;
    } catch (e) {
      console.warn('Failed to save photo', e);
      return localUri;
    }
  };

  const updateField = async (fields) => {
    const updated = { ...profile, ...fields };
    await save(new CaregiverProfile(updated));
  };

  const contextValue = useMemo(
    () => ({ profile, loaded, load, save, updateField, savePhoto }),
    [profile, loaded]
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};
