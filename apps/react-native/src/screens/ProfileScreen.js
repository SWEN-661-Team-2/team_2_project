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
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Returns to the previous screen"
          >
            <Text style={styles.backIcon} aria-hidden="true">←</Text>
          </TouchableOpacity>

          <Text style={styles.title} accessibilityRole="header">
            Profile information
          </Text>

          <View style={{ width: 44 }} aria-hidden="true" />
        </View>

        {editing ? (
          <View style={styles.form}>
            <TouchableOpacity 
              onPress={pickPhoto} 
              style={styles.photoWrap} 
              testID="profile_pick_photo"
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.photo} accessibilityLabel="Current profile photo" />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholder="Name" 
              accessibilityLabel="Full Name"
            />
            <TextInput 
              style={styles.input} 
              value={titleRole} 
              onChangeText={setTitleRole} 
              placeholder="Title / Role" 
              accessibilityLabel="Job Title or Role"
            />
            <TextInput 
              style={styles.input} 
              value={position} 
              onChangeText={setPosition} 
              placeholder="Position" 
              accessibilityLabel="Work Position"
            />
            <TextInput 
              style={styles.input} 
              value={organization} 
              onChangeText={setOrganization} 
              placeholder="Organization" 
              accessibilityLabel="Organization Name"
            />
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              placeholder="Email" 
              keyboardType="email-address" 
              accessibilityLabel="Email Address"
              autoCapitalize="none"
            />
            <TextInput 
              style={styles.input} 
              value={phone} 
              onChangeText={setPhone} 
              placeholder="Phone" 
              keyboardType="phone-pad" 
              accessibilityLabel="Phone Number"
            />

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={save} 
              testID="profile_save"
              accessibilityRole="button"
              accessibilityLabel="Save profile changes"
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={cancelEdit} 
              testID="profile_cancel"
              accessibilityRole="button"
              accessibilityLabel="Cancel editing"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.readOnly} testID="profile_readonly">
            <View style={styles.photoWrap} accessibilityRole="image" accessibilityLabel="Profile photo">
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}><Text>No Photo</Text></View>
              )}
            </View>

            {[
              { label: 'Name', value: profile.name },
              { label: 'Title / Role', value: profile.titleRole },
              { label: 'Position', value: profile.position },
              { label: 'Organization', value: profile.organization },
              { label: 'Email', value: profile.email },
              { label: 'Phone', value: profile.phone },
            ].map((item, idx) => (
              <View 
                key={idx} 
                style={styles.infoRow} 
                accessibilityLabel={`${item.label}: ${item.value || 'Not provided'}`}
              >
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || '—'}</Text>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.editButton} 
              onPress={startEdit} 
              testID="profile_edit"
              accessibilityRole="button"
              accessibilityLabel="Edit Profile"
              accessibilityHint="Enables form fields to update your information"
            >
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