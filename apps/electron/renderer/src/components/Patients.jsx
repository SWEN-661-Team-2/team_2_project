import React, { useState } from 'react';

const PATIENTS = [
  { id: 1, name: 'John Davis', initials: 'JD', room: '301A', age: 58, status: 'stable', lastVisit: '2 hours ago' },
  { id: 2, name: 'Mary Wilson', initials: 'MW', room: '305B', age: 54, status: 'improving', lastVisit: '1 hour ago' },
  { id: 3, name: 'Robert Brown', initials: 'RB', room: '310A', age: 72, status: 'critical', lastVisit: '30 min ago' },
  { id: 4, name: 'Lisa Anderson', initials: 'LA', room: '308C', age: 45, status: 'stable', lastVisit: '3 hours ago' },
  { id: 5, name: 'James Miller', initials: 'JM', room: '312B', age: 63, status: 'improving', lastVisit: '13 hours ago' },
];

const PATIENT_DETAILS = {
  1: { diagnosis: 'Hypertension, Type 2 Diabetes', medications: ['Metformin 500mg', 'Lisinopril 10mg'], allergies: ['Penicillin'], nextAppt: 'Feb 26, 2026 2:00 PM' },
  2: { diagnosis: 'Post-op Hip Replacement', medications: ['Oxycodone 5mg PRN', 'Aspirin 81mg'], allergies: ['Sulfa'], nextAppt: 'Feb 26, 2026 2:30 PM' },
  3: { diagnosis: 'COPD, Heart Failure', medications: ['Furosemide 40mg', 'Metoprolol 25mg', 'Albuterol PRN'], allergies: ['NSAIDs'], nextAppt: 'Feb 26, 2026 3:00 PM' },
  4: { diagnosis: 'Appendectomy recovery', medications: ['Amoxicillin 500mg', 'Ibuprofen 400mg'], allergies: [], nextAppt: 'Mar 2, 2026 10:00 AM' },
  5: { diagnosis: 'Pneumonia', medications: ['Azithromycin 250mg', 'Albuterol nebulizer'], allergies: ['Latex'], nextAppt: 'Feb 27, 2026 9:00 AM' },
};

function Patients() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500); }

  const filtered = PATIENTS.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.room.toLowerCase().includes(search.toLowerCase())
  );

  const details = selected ? PATIENT_DETAILS[selected.id] : null;

  return (
    <div className="page-content">
      <div className="toolbar" role="toolbar" aria-label="Patient actions">
        <h1 className="page-title" style={{ margin: 0 }}>Patient Care</h1>
        <span className="toolbar-spacer"></span>
        <button className="btn primary" onClick={() => setShowModal(true)}>+ Add Patient</button>
      </div>
      <p className="page-subtitle">Manage patient information and care plans</p>

      <div className="patients-layout">
        <div className="card patients-list-panel">
          <input
            className="input"
            type="search"
            placeholder="Search patients by name or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search patients"
            data-search
          />
          <h3 className="panel-section-title">Patients ({filtered.length})</h3>
          <ul className="patient-list" role="list">
            {filtered.map(p => (
              <li key={p.id}>
                <button
                  className={`patient-item ${selected?.id === p.id ? 'active' : ''}`}
                  onClick={() => setSelected(p)}
                >
                  <div className="patient-avatar" aria-hidden="true">{p.initials}</div>
                  <div className="patient-info">
                    <div className="patient-name">
                      {p.name}
                      <span className={`status-dot status-dot--${p.status}`} title={p.status}></span>
                    </div>
                    <div className="patient-meta">Room {p.room} · Age {p.age}</div>
                    <div className="patient-meta">Last visit: {p.lastVisit}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card patients-detail-panel">
          {!selected ? (
            <div className="empty-state-center">
              <span className="empty-icon" aria-hidden="true">👤</span>
              <p>Select a patient from the list to view details</p>
            </div>
          ) : (
            <div className="patient-detail">
              <div className="detail-header">
                <div className="patient-avatar patient-avatar--lg">{selected.initials}</div>
                <div>
                  <h2>{selected.name}</h2>
                  <p>
                    Room {selected.room} · Age {selected.age} ·{' '}
                    <span className={`status-badge status-badge--${selected.status}`}>{selected.status}</span>
                  </p>
                </div>
              </div>
              <div className="detail-section"><h3>Diagnosis</h3><p>{details.diagnosis}</p></div>
              <div className="detail-section">
                <h3>Medications</h3>
                <ul className="medication-list">
                  {details.medications.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
              <div className="detail-section">
                <h3>Allergies</h3>
                <p>{details.allergies.length ? details.allergies.join(', ') : 'None on record'}</p>
              </div>
              <div className="detail-section"><h3>Next Appointment</h3><p>{details.nextAppt}</p></div>
              <div className="btn-group">
                <button className="btn primary" onClick={() => showToast('Care plan updated.')}>Update Care Plan</button>
                <button className="btn" onClick={() => showToast('Note added.')}>Add Note</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="patient-modal-title">
          <div className="modal modal--wide">
            <div className="modal-header">
              <h2 id="patient-modal-title">Add New Patient</h2>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">✕</button>
            </div>
            <p className="modal-subtitle">Fields marked * are required.</p>
            <div className="field-row">
              <div className="field">
                <label className="label" htmlFor="first-name">First Name *</label>
                <input className="input" id="first-name" type="text" placeholder="John" />
              </div>
              <div className="field">
                <label className="label" htmlFor="last-name">Last Name *</label>
                <input className="input" id="last-name" type="text" placeholder="Smith" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="label" htmlFor="dob">Date of Birth *</label>
                <input className="input" id="dob" type="date" />
              </div>
              <div className="field">
                <label className="label" htmlFor="gender">Gender</label>
                <select className="input" id="gender">
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
              <input className="input" id="phone" type="tel" placeholder="(555) 123-4567" />
            </div>
            <div className="field">
              <label className="label" htmlFor="p-email">Email</label>
              <input className="input" id="p-email" type="email" placeholder="patient@example.com" />
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn primary" onClick={() => { setShowModal(false); showToast('Patient added (demo).'); }}>
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;
