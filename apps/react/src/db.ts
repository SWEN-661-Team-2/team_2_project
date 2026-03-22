import Dexie, { type Table } from 'dexie';

export interface User {
  id?: number;
  username: string;
  password: string;
}

// 1. Define the Patient interface here so the Class can see it
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
  admissionDate: string;
}
export interface Task {
  id?: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  patient: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed';
  category?: string;
}
export class MyDatabase extends Dexie {
  users!: Table<User>;
  patients!: Table<Patient>;
  tasks!: Table<Task>;

  constructor() {
    super('CareConnectDB');
    this.version(1).stores({
      users: '++id, &username',
      patients: '++id, firstName, lastName, room',
      tasks: '++id, title, patient, status, priority' 
    });
  }
}

export const db = new MyDatabase();

db.on('populate', () => {
  // Initial Admin User
  db.users.add({
    username: 'admin@careconnect.com',
    password: 'password123'
  });

  // 2. Seed the initial dummy patients into IndexedDB
  db.patients.bulkAdd([
    { firstName: 'John', lastName: 'Davis', initials: 'JD', room: '204A', age: 68, gender: 'Male', status: 'stable', phone: '(555) 123-4567', email: 'john.davis@email.com', diagnosis: ['Hypertension', 'Type 2 Diabetes'], medications: ['Metformin 500mg'], admissionDate: '2026-02-20' },
    { firstName: 'Mary', lastName: 'Wilson', initials: 'MW', room: '301B', age: 54, gender: 'Female', status: 'improving', phone: '(555) 234-5678', email: 'mary.wilson@email.com', diagnosis: ['Post-operative recovery'], medications: ['Iron supplement'], admissionDate: '2026-02-22' },
    { firstName: 'Robert', lastName: 'Brown', initials: 'RB', room: '156C', age: 72, gender: 'Male', status: 'critical', phone: '(555) 345-6789', email: 'robert.brown@email.com', diagnosis: ['Pneumonia'], medications: ['Amoxicillin'], admissionDate: '2026-02-24' },
    { firstName: 'Lisa', lastName: 'Anderson', initials: 'LA', room: '412A', age: 45, gender: 'Female', status: 'stable', phone: '(555) 456-7890', email: 'lisa.anderson@email.com', diagnosis: ['Migraines'], medications: ['Sertraline'], admissionDate: '2026-02-21' },
    { firstName: 'James', lastName: 'Miller', initials: 'JM', room: '218B', age: 61, gender: 'Male', status: 'improving', phone: '(555) 567-8901', email: 'james.miller@email.com', diagnosis: ['CAD'], medications: ['Atorvastatin'], admissionDate: '2026-01-19' }
  ]);

  db.tasks.bulkAdd([
    { title: 'Medication Administration', priority: 'high', patient: 'John Davis', time: '2:00 PM', status: 'pending', category: 'Medication' },
    { title: 'Vital Signs Check', priority: 'medium', patient: 'Mary Wilson', time: '2:30 PM', status: 'in-progress', category: 'Assessment' },
    { title: 'Wound Care', priority: 'high', patient: 'Robert Brown', time: '3:00 PM', status: 'pending', category: 'Treatment' },
    { title: 'Patient Education', priority: 'low', patient: 'Lisa Anderson', time: '4:30 PM', status: 'pending', category: 'Assessment' },
  ]);
});