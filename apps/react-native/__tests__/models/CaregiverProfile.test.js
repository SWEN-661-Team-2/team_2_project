/**
 * Business Logic Tests - CaregiverProfile Model
 * Tests the CaregiverProfile class and its JSON serialization
 */
import CaregiverProfile from '../../src/models/CaregiverProfile';

describe('CaregiverProfile Model', () => {
  describe('constructor', () => {
    test('creates empty profile with default values', () => {
      const profile = new CaregiverProfile();

      expect(profile.photoUri).toBeNull();
      expect(profile.name).toBe('');
      expect(profile.titleRole).toBe('');
      expect(profile.position).toBe('');
      expect(profile.organization).toBe('');
      expect(profile.email).toBe('');
      expect(profile.phone).toBe('');
    });

    test('creates profile with provided values', () => {
      const profile = new CaregiverProfile({
        photoUri: '/path/to/photo.jpg',
        name: 'Jane Doe',
        titleRole: 'RN',
        position: 'Senior Nurse',
        organization: 'City Hospital',
        email: 'jane.doe@hospital.com',
        phone: '555-1234',
      });

      expect(profile.photoUri).toBe('/path/to/photo.jpg');
      expect(profile.name).toBe('Jane Doe');
      expect(profile.titleRole).toBe('RN');
      expect(profile.position).toBe('Senior Nurse');
      expect(profile.organization).toBe('City Hospital');
      expect(profile.email).toBe('jane.doe@hospital.com');
      expect(profile.phone).toBe('555-1234');
    });
  });

  describe('fromJson', () => {
    test('creates profile from JSON object', () => {
      const json = {
        photoUri: '/photo.jpg',
        name: 'Alice Smith',
        titleRole: 'MD',
        position: 'Doctor',
        organization: 'Clinic',
        email: 'alice@clinic.com',
        phone: '555-5678',
      };

      const profile = CaregiverProfile.fromJson(json);

      expect(profile.photoUri).toBe('/photo.jpg');
      expect(profile.name).toBe('Alice Smith');
      expect(profile.titleRole).toBe('MD');
      expect(profile.position).toBe('Doctor');
      expect(profile.organization).toBe('Clinic');
      expect(profile.email).toBe('alice@clinic.com');
      expect(profile.phone).toBe('555-5678');
    });

    test('handles null or undefined JSON', () => {
      const profile1 = CaregiverProfile.fromJson(null);
      const profile2 = CaregiverProfile.fromJson(undefined);

      expect(profile1.name).toBe('');
      expect(profile2.name).toBe('');
    });

    test('handles partial JSON data', () => {
      const json = {
        name: 'Bob',
        email: 'bob@test.com',
      };

      const profile = CaregiverProfile.fromJson(json);

      expect(profile.name).toBe('Bob');
      expect(profile.email).toBe('bob@test.com');
      expect(profile.position).toBe('');
      expect(profile.phone).toBe('');
    });
  });

  describe('toJson', () => {
    test('serializes profile to JSON', () => {
      const profile = new CaregiverProfile({
        photoUri: '/photo.jpg',
        name: 'Test User',
        titleRole: 'RN',
        position: 'Nurse',
        organization: 'Hospital',
        email: 'test@test.com',
        phone: '123-456',
      });

      const json = profile.toJson();

      expect(json).toEqual({
        photoUri: '/photo.jpg',
        name: 'Test User',
        titleRole: 'RN',
        position: 'Nurse',
        organization: 'Hospital',
        email: 'test@test.com',
        phone: '123-456',
      });
    });

    test('round-trip serialization preserves data', () => {
      const original = new CaregiverProfile({
        photoUri: '/test.jpg',
        name: 'Original User',
        titleRole: 'MD',
        position: 'Physician',
        organization: 'Medical Center',
        email: 'original@test.com',
        phone: '999-8888',
      });

      const json = original.toJson();
      const restored = CaregiverProfile.fromJson(json);

      expect(restored.photoUri).toBe(original.photoUri);
      expect(restored.name).toBe(original.name);
      expect(restored.titleRole).toBe(original.titleRole);
      expect(restored.position).toBe(original.position);
      expect(restored.organization).toBe(original.organization);
      expect(restored.email).toBe(original.email);
      expect(restored.phone).toBe(original.phone);
    });
  });
});
