export default class CaregiverProfile {
  constructor({ photoUri = null, name = '', titleRole = '', position = '', organization = '', email = '', phone = '' } = {}) {
    this.photoUri = photoUri;
    this.name = name;
    this.titleRole = titleRole;
    this.position = position;
    this.organization = organization;
    this.email = email;
    this.phone = phone;
  }

  static fromJson(json) {
    if (!json) return new CaregiverProfile();
    return new CaregiverProfile({
      photoUri: json.photoUri || null,
      name: json.name || '',
      titleRole: json.titleRole || '',
      position: json.position || '',
      organization: json.organization || '',
      email: json.email || '',
      phone: json.phone || '',
    });
  }

  toJson() {
    return {
      photoUri: this.photoUri,
      name: this.name,
      titleRole: this.titleRole,
      position: this.position,
      organization: this.organization,
      email: this.email,
      phone: this.phone,
    };
  }
}

