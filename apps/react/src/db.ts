// db.ts — CareConnect IndexedDB layer powered by Dexie.js
// Defines the database schema, TypeScript interfaces, and seed data.
// The database is named 'CareConnectDB' and currently runs at version 1.
//
// NOTE: Passwords are stored in plain text for demo purposes only.
// A production system must hash passwords server-side before storage.
import Dexie, { type Table } from 'dexie';

// --- Interfaces ---

export interface User {
  id?: number;
  username: string;
  password: string;
}

// Patient record stored in IndexedDB
export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  initials: string;
  room: string;
  age: number;
  gender: string;
  status: 'stable' | 'improving' | 'critical';
  phone: string;
  email: string;
  diagnosis: string[];
  medications: string[];
  allergies: string[];
  bloodType: string;
  admissionDate: string;
}

// Appointment record — keyed by year, month (0-indexed), and day
export interface Appointment {
  id?: number;
  time: string;
  patient: string | null;
  duration: number | null;
  type: string | null;
  status: 'completed' | 'scheduled' | 'available';
  year: number;
  month: number; // 0-indexed to match JavaScript Date API
  day: number;
}

// Task record stored in IndexedDB
export interface Task {
  id?: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  patient: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed';
  category?: string;
}

// --- Database Class ---

export class MyDatabase extends Dexie {
  users!: Table<User>;
  patients!: Table<Patient>;
  tasks!: Table<Task>;
  appointments!: Table<Appointment>;

  constructor() {
    super('CareConnectDB');
    this.version(1).stores({
      users: '++id, &username',
      patients: '++id, firstName, lastName, room',
      tasks: '++id, title, patient, status, priority',
      // Compound index on year+month+day enables efficient date-based queries
      appointments: '++id, year, month, day, status',
    });
  }
}

export const db = new MyDatabase();

// --- Seed Helpers ---

// Returns true if the given date falls on a weekday (Mon–Fri)
const isWeekday = (year: number, month: number, day: number): boolean => {
  const dow = new Date(year, month, day).getDay();
  return dow !== 0 && dow !== 6;
};

// Appointment templates rotated across weekdays to vary the daily schedule
const templates = [
  { time: '08:00 AM', patient: 'John Davis',    duration: 30,   type: 'Medication Round',         status: 'completed' as const },
  { time: '09:00 AM', patient: null,             duration: null, type: null,                       status: 'available' as const },
  { time: '10:30 AM', patient: 'Mary Wilson',    duration: 20,   type: 'Vital Signs Check',        status: 'scheduled' as const },
  { time: '11:00 AM', patient: 'Robert Brown',   duration: 15,   type: 'Wound Care',               status: 'scheduled' as const },
  { time: '02:00 PM', patient: 'John Davis',     duration: 15,   type: 'Medication Administration',status: 'scheduled' as const },
  { time: '03:30 PM', patient: 'Lisa Anderson',  duration: 25,   type: 'Patient Education',        status: 'scheduled' as const },
  { time: '04:00 PM', patient: null,             duration: null, type: null,                       status: 'available' as const },
];

// --- Database Population ---

// populate fires once when the database is first created in the browser.
// Clearing IndexedDB (DevTools → Application → IndexedDB → Delete database)
// will trigger this again on next page load.
db.on('populate', () => {

  // Seed the initial admin user
  db.users.add({ username: 'admin@careconnect.com', password: 'password123' });

  // Seed initial patient records
  db.patients.bulkAdd([
    { firstName: 'John',   lastName: 'Davis',    initials: 'JD', room: '204A', age: 68, gender: 'Male',   status: 'stable',    phone: '(555) 123-4567', email: 'john.davis@email.com',    diagnosis: ['Hypertension', 'Type 2 Diabetes'], medications: ['Metformin 500mg'], admissionDate: '2026-02-20', allergies: ['Penicillin', 'Sulfa'], bloodType: 'A+'  },
    { firstName: 'Mary',   lastName: 'Wilson',   initials: 'MW', room: '301B', age: 54, gender: 'Female', status: 'improving', phone: '(555) 234-5678', email: 'mary.wilson@email.com',   diagnosis: ['Post-operative recovery'],          medications: ['Iron supplement'], admissionDate: '2026-02-22', allergies: ['Latex'],              bloodType: 'O-'  },
    { firstName: 'Robert', lastName: 'Brown',    initials: 'RB', room: '156C', age: 72, gender: 'Male',   status: 'critical',  phone: '(555) 345-6789', email: 'robert.brown@email.com',  diagnosis: ['Pneumonia'],                        medications: ['Amoxicillin'],     admissionDate: '2026-02-24', allergies: ['Aspirin', 'Codeine'], bloodType: 'B+'  },
    { firstName: 'Lisa',   lastName: 'Anderson', initials: 'LA', room: '412A', age: 45, gender: 'Female', status: 'stable',    phone: '(555) 456-7890', email: 'lisa.anderson@email.com', diagnosis: ['Migraines'],                        medications: ['Sertraline'],      admissionDate: '2026-02-21', allergies: ['None known'],         bloodType: 'AB+' },
    { firstName: 'James',  lastName: 'Miller',   initials: 'JM', room: '218B', age: 61, gender: 'Male',   status: 'improving', phone: '(555) 567-8901', email: 'james.miller@email.com',  diagnosis: ['CAD'],                              medications: ['Atorvastatin'],    admissionDate: '2026-01-19', allergies: ['Ibuprofen'],          bloodType: 'O+'  },
  ]);

  // Seed initial task records
  db.tasks.bulkAdd([
    { title: 'Medication Administration', priority: 'high',   patient: 'John Davis',    time: '2:00 PM', status: 'pending',     category: 'Medication' },
    { title: 'Vital Signs Check',         priority: 'medium', patient: 'Mary Wilson',   time: '2:30 PM', status: 'in-progress', category: 'Assessment' },
    { title: 'Wound Care',                priority: 'high',   patient: 'Robert Brown',  time: '3:00 PM', status: 'pending',     category: 'Treatment'  },
    { title: 'Patient Education',         priority: 'low',    patient: 'Lisa Anderson', time: '4:30 PM', status: 'pending',     category: 'Assessment' },
  ]);

  // Seed appointments for every weekday in March (month=2) and April (month=3) 2026.
  // Templates are rotated by day index so each weekday has a varied schedule.
  const appointmentSeed: Omit<Appointment, 'id'>[] = [];

  [[2, 31], [3, 30]].forEach(([month, days]) => {
    for (let day = 1; day <= days; day++) {
      // Skip Saturday and Sunday
      if (!isWeekday(2026, month, day)) continue;

      // Rotate through templates, picking 3 per day
      const offset = (day - 1) % templates.length;
      const picks = [
        templates[offset % templates.length],
        templates[(offset + 2) % templates.length],
        templates[(offset + 4) % templates.length],
      ];

      picks.forEach((t) => {
        appointmentSeed.push({ ...t, year: 2026, month, day });
      });
    }
  });

  db.appointments.bulkAdd(appointmentSeed);
});
