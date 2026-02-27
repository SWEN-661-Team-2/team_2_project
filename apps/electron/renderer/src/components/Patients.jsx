import React, { useState } from 'react';
import NewPatientModal from './NewPatientModal'; // Import the new component

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

  // Logic to handle saving a patient from the new component
  const handleSavePatient = (data) => {
    console.log('Patient Data Received:', data);
    setShowModal(false);
    showToast(`Patient ${data.lastName} added successfully!`);
    // Note: In a real app, you'd add 'data' to your PATIENTS state here
  };

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
        {/* Left Panel: List */}
        <div className="card patients-list-panel">
          <input
            className="input"
            type="search"
            placeholder="Search patients by name or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <h3 className="panel-section-title">Patients ({filtered.length})</h3>
          <ul className="patient-list" role="list">
            {filtered.map(p => (
              <li key={p.id}>
                <button
                  className={`patient-item ${selected?.id === p.id ? 'active' : ''}`}
                  onClick={() => setSelected(p)}
                >
                  <div className="patient-avatar">{p.initials}</div>
                  <div className="patient-info">
                    <div className="patient-name">
                      {p.name}
                      <span className={`status-dot status-dot--${p.status}`}></span>
                    </div>
                    <div className="patient-meta">Room {p.room} · Age {p.age}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: Details */}
        <div className="card patients-detail-panel">
          {!selected ? (
            <div className="empty-state-center">
              <span className="empty-icon">👤</span>
              <p>Select a patient from the list to view details</p>
            </div>
          ) : (
            <div className="patient-detail">
              <div className="detail-header">
                <div className="patient-avatar patient-avatar--lg">{selected.initials}</div>
                <div>
                  <h2>{selected.name}</h2>
                  <p>Room {selected.room} · Age {selected.age}</p>
                </div>
              </div>
              <div className="detail-section"><h3>Diagnosis</h3><p>{details.diagnosis}</p></div>
              <div className="detail-section">
                <h3>Medications</h3>
                <ul>{details.medications.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </div>
              <div className="btn-group">
                <button className="btn primary" onClick={() => showToast('Care plan updated.')}>Update Care Plan</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW MODAL PATTERN */}
      {showModal && (
        <NewPatientModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSavePatient} 
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default Patients;