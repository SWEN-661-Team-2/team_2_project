import React, { useState } from 'react';
import NewAppointmentModal from './NewAppointmentModal';

const INITIAL_APPOINTMENTS = [
  { id: 1, time: '08:00 AM', patient: 'John Davis', duration: '30 min', type: 'Medication Round', status: 'completed' },
  { id: 2, time: '09:00 AM', patient: null, duration: null, type: null, status: 'available' },
  { id: 3, time: '10:00 AM', patient: null, duration: null, type: null, status: 'available' },
  { id: 4, time: '11:00 AM', patient: 'Robert Brown', duration: '30 min', type: 'Round Care', status: 'completed' },
  { id: 5, time: '12:00 PM', patient: null, duration: null, type: null, status: 'available' },
  { id: 6, time: '02:00 PM', patient: 'John Davis', duration: '15 min', type: 'Medication Administration', status: 'scheduled' },
  { id: 7, time: '03:00 PM', patient: 'Robert Brown', duration: '60 min', type: 'Physical Therapy', status: 'scheduled' },
];

const CAL_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function Schedule() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [toast, setToast] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function addAppointment(newAppt) {
    const updated = appointments.map(a => {
      if (a.time === newAppt.time && a.status === 'available') {
        return {
          ...a,
          patient: newAppt.patient,
          duration: newAppt.duration,
          type: newAppt.type,
          status: 'scheduled',
        };
      }
      return a;
    });

    setAppointments(updated);
    showToast('Appointment scheduled.');
  }

  const first = new Date(2026, 1, 1).getDay();
  const totalDays = new Date(2026, 2, 0).getDate();
  const blanks = Array(first).fill(null);
  const dayNums = Array.from({ length: totalDays }, (_, i) => i + 1);

  const totalAppts = appointments.filter(a => a.status !== 'available').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const upcoming = appointments.filter(a => a.status === 'scheduled').length;

  const availableSlots = appointments.filter(a => a.status === 'available');

  return (
    <div className="page-content">
      <div className="toolbar" role="toolbar" aria-label="Schedule actions">
        <h1 className="page-title" style={{ margin: 0 }}>Calendar</h1>
        <span className="toolbar-spacer"></span>
        <button
          className="btn primary"
          onClick={() => setShowNewForm(true)}
        >
          + New Appointment
        </button>
      </div>

      <div className="schedule-layout">
        <div className="card schedule-calendar">
          <div className="cal-header">
            <button className="btn btn-sm" aria-label="Previous month">&#8249;</button>
            <strong>February 2026</strong>
            <button className="btn btn-sm" aria-label="Next month">&#8250;</button>
          </div>
          <div className="cal-grid" role="grid">
            {CAL_DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
            {blanks.map((_, i) => <div key={'b' + i} className="cal-cell"></div>)}
            {dayNums.map(d => (
              <button
                key={d}
                className={`cal-cell cal-day ${d === 25 ? 'cal-today' : ''}`}
                aria-label={`February ${d}, 2026`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="cal-selected">
            <strong>Selected Date</strong>
            <p>Thursday, February 26, 2026</p>
            <p className="muted">{totalAppts} appointments</p>
          </div>
        </div>

        <div className="card schedule-daily">
          <div className="daily-header">
            <h2>Daily Schedule</h2>
            <div className="daily-nav">
              <button className="btn btn-sm" aria-label="Previous day">&#8249;</button>
              <span>Feb 26, 2026</span>
              <button className="btn btn-sm" aria-label="Next day">&#8249;</button>
            </div>
          </div>
          <ul className="appt-list" role="list">
            {appointments.map(a => (
              <li key={a.id} className={`appt-item appt-item--${a.status}`}>
                <span className="appt-time">{a.time}</span>
                {a.status === 'available' ? (
                  <span className="appt-available">
                    Available
                  </span>
                ) : (
                  <>
                    <div className="appt-info">
                      <strong>{a.patient}</strong>
                      <span className="appt-meta">{a.duration} · {a.type}</span>
                    </div>
                    <span className={`appt-badge appt-badge--${a.status}`}>
                      {a.status}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="summary-grid" style={{ marginTop: '16px' }}>
        <div className="summary-card">
          <div className="summary-label">Total Appointments</div>
          <div className="summary-number">{totalAppts}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Completed</div>
          <div className="summary-number">{completed}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Upcoming</div>
          <div className="summary-number">{upcoming}</div>
        </div>
      </div>

      {showNewForm && (
        <NewAppointmentModal
          availableSlots={availableSlots}
          onClose={() => setShowNewForm(false)}
          onSave={addAppointment}
        />
      )}

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}

export default Schedule;