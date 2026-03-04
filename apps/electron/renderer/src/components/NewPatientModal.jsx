import React, { useState } from 'react';

function NewPatientModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    email: ''
  });

  const handleSubmit = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert("Please fill in required fields (*)");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="patient-modal-title">
      <div className="modal modal--wide">
        <div className="modal-header">
          <h2 id="patient-modal-title">Add New Patient</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="modal-subtitle">Fields marked * are required.</p>
        
        <div className="field-row">
          <div className="field">
            <label className="label" htmlFor="first-name">First Name *</label>
            <input 
              className="input" 
              id="first-name" 
              type="text" 
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="last-name">Last Name *</label>
            <input 
              className="input" 
              id="last-name" 
              type="text" 
              placeholder="Smith" 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="label" htmlFor="dob">Date of Birth *</label>
            <input 
              className="input" 
              id="dob" 
              type="date" 
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="gender">Gender</label>
            <select 
              className="input" 
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="phone">Phone *</label>
          <input 
            className="input" 
            id="phone" 
            type="tel" 
            placeholder="(555) 123-4567" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="p-email">Email</label>
          <input 
            className="input" 
            id="p-email" 
            type="email" 
            placeholder="patient@example.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSubmit}>
            Add Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPatientModal;