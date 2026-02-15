import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HandednessToggleOverlay from '../components/HandednessToggleOverlay';
import { ProfileProvider, useProfile } from '../contexts/ProfileContext';

function ProfileInner({ navigation }) {
  const { profile, loaded, updateField, savePhoto } = useProfile();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [titleRole, setTitleRole] = useState('');
  const [position, setPosition] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!loaded) return;
    setName(profile.name || '');
    setTitleRole(profile.titleRole || '');
    setPosition(profile.position || '');
    setOrganization(profile.organization || '');
    setEmail(profile.email || '');
    setPhone(profile.phone || '');
  }, [loaded, profile]);

  const startEdit = () => setEditing(true);

  const cancelEdit = () => {
    setName(profile.name || '');
    setTitleRole(profile.titleRole || '');
    setPosition(profile.position || '');
    setOrganization(profile.organization || '');
    setEmail(profile.email || '');
    setPhone(profile.phone || '');
    setEditing(false);
  };

  const save = async () => {
    await updateField({
      name: name.trim(),
      titleRole: titleRole.trim(),
      position: position.trim(),
      organization: organization.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setEditing(false);
    Alert.alert('Profile saved');
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission required', 'Need permission to pick images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images 
    });
    if (result.canceled) return; // Note: SDK 50+ uses 'canceled' (one L)

    const saved = await savePhoto(result.assets[0].uri);
    if (saved) {
      await updateField({ photoUri: saved });
      Alert.alert('Photo updated');
    }
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            testID="profile_back"
            onPress={() => {
              if (navigation?.canGoBack?.()) navigation.goBack();
              else navigation.navigate('Settings');
            }}
            style={styles.backTouch}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Profile information</Text>

          {/* Spacer to balance the back button width */}
          <View style={{ width: 44 }} />
        </View>

        {editing ? (
          <View style={styles.form}>
            <TouchableOpacity onPress={pickPhoto} style={styles.photoWrap} testID="profile_pick_photo">
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text>Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <TextInput style={styles.input} value={titleRole} onChangeText={setTitleRole} placeholder="Title / Role" />
            <TextInput style={styles.input} value={position} onChangeText={setPosition} placeholder="Position" />
            <TextInput style={styles.input} value={organization} onChangeText={setOrganization} placeholder="Organization" />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />

            <TouchableOpacity style={styles.saveButton} onPress={save} testID="profile_save">
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit} testID="profile_cancel">
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.readOnly} testID="profile_readonly">
            <View style={styles.photoWrap}>
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text>Photo</Text>
                </View>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{profile.name || '—'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Title / Role</Text>
              <Text style={styles.value}>{profile.titleRole || '—'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Position</Text>
              <Text style={styles.value}>{profile.position || '—'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Organization</Text>
              <Text style={styles.value}>{profile.organization || '—'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{profile.email || '—'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{profile.phone || '—'}</Text>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={startEdit} testID="profile_edit">
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <HandednessToggleOverlay />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ProfileScreenWrapper(props) {
  return (
    <ProfileProvider>
      <ProfileInner {...props} />
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  backTouch: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#0A7A8A',
    fontWeight: '600',
  },
  form: {},
  readOnly: {},
  photoWrap: { 
    alignSelf: 'center', 
    marginVertical: 12 
  },
  photo: { 
    width: 96, 
    height: 96, 
    borderRadius: 48 
  },
  photoPlaceholder: { 
    width: 96, 
    height: 96, 
    borderRadius: 48, 
    backgroundColor: '#0A8F84', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E8E8E8', 
    borderRadius: 8, 
    padding: 10, 
    marginVertical: 6 
  },
  saveButton: { 
    backgroundColor: '#0A7A8A', 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 12, 
    alignItems: 'center' 
  },
  saveButtonText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  cancelButton: { 
    borderWidth: 1, 
    borderColor: '#E8E8E8', 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 8, 
    alignItems: 'center' 
  },
  cancelButtonText: { 
    color: '#333' 
  },
  infoRow: { 
    paddingVertical: 8 
  },
  label: { 
    fontWeight: '700' 
  },
  value: { 
    color: '#333', 
    marginTop: 4 
  },
  editButton: { 
    backgroundColor: '#E3F2FD', 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 16, 
    alignItems: 'center' 
  },
  editButtonText: { 
    color: '#0A7A8A', 
    fontWeight: '700' 
  },
});