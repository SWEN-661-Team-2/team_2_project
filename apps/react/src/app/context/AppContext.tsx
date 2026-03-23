import { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface Task {
  readonly id: number;
  readonly title: string;
  readonly priority: 'high' | 'medium' | 'low';
  readonly patient: string;
  readonly time: string;
  readonly status: 'pending' | 'in-progress' | 'completed';
  readonly category?: string;
}

interface Patient {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly initials: string;
  readonly room: string;
  readonly age: number;
  readonly gender: string;
  readonly status: 'stable' | 'improving' | 'critical';
  readonly phone: string;
  readonly email: string;
  readonly diagnosis: string[];
  readonly medications: string[];
  readonly admissionDate: string;
}

interface AppState {
  readonly isLoggedIn: boolean;
  readonly sidebarPosition: 'left' | 'right';
  readonly tasks: Task[];
  readonly patients: Patient[];
}

interface AppContextType {
  readonly state: AppState;
  readonly login: () => void;
  readonly logout: () => void;
  readonly setSidebarPosition: (position: 'left' | 'right') => void;
  readonly addTask: (task: Omit<Task, 'id'>) => void;
  readonly addPatient: (patient: Omit<Patient, 'id'>) => void;
}

const defaultTasks: Task[] = [
  { id: 1, title: 'Medication Administration', priority: 'high', patient: 'John Davis', time: '2:00 PM', status: 'pending', category: 'Medication' },
  { id: 2, title: 'Vital Signs Check', priority: 'medium', patient: 'Mary Wilson', time: '2:30 PM', status: 'in-progress', category: 'Assessment' },
  { id: 3, title: 'Wound Care', priority: 'high', patient: 'Robert Brown', time: '3:00 PM', status: 'pending', category: 'Treatment' },
  { id: 4, title: 'Patient Education', priority: 'low', patient: 'Lisa Anderson', time: '4:30 PM', status: 'pending', category: 'Assessment' },
];

const defaultPatients: Patient[] = [
  { id: 1, firstName: 'John', lastName: 'Davis', initials: 'JD', room: '204A', age: 68, gender: 'Male', status: 'stable', phone: '(555) 123-4567', email: 'john.davis@email.com', diagnosis: ['Hypertension', 'Type 2 Diabetes'], medications: ['Metformin 500mg - Twice daily', 'Lisinopril 10mg - Once daily', 'Aspirin 81mg - Once daily'], admissionDate: '2026-02-20' },
  { id: 2, firstName: 'Mary', lastName: 'Wilson', initials: 'MW', room: '301B', age: 54, gender: 'Female', status: 'improving', phone: '(555) 234-5678', email: 'mary.wilson@email.com', diagnosis: ['Post-operative recovery', 'Mild anemia'], medications: ['Iron supplement 325mg - Once daily', 'Acetaminophen 500mg - As needed for pain'], admissionDate: '2026-02-22' },
  { id: 3, firstName: 'Robert', lastName: 'Brown', initials: 'RB', room: '156C', age: 72, gender: 'Male', status: 'critical', phone: '(555) 345-6789', email: 'robert.brown@email.com', diagnosis: ['Acute respiratory distress', 'Pneumonia'], medications: ['Amoxicillin 500mg - Three times daily', 'Albuterol inhaler - Every 4 hours', 'Prednisone 20mg - Twice daily'], admissionDate: '2026-02-24' },
  { id: 4, firstName: 'Lisa', lastName: 'Anderson', initials: 'LA', room: '412A', age: 45, gender: 'Female', status: 'stable', phone: '(555) 456-7890', email: 'lisa.anderson@email.com', diagnosis: ['Migraine management', 'Anxiety disorder'], medications: ['Sumatriptan 50mg - As needed', 'Sertraline 50mg - Once daily'], admissionDate: '2026-02-21' },
  { id: 5, firstName: 'James', lastName: 'Miller', initials: 'JM', room: '218B', age: 61, gender: 'Male', status: 'improving', phone: '(555) 567-8901', email: 'james.miller@email.com', diagnosis: ['Coronary artery disease', 'Hyperlipidemia'], medications: ['Atorvastatin 40mg - Once daily at bedtime', 'Clopidogrel 75mg - Once daily', 'Metoprolol 50mg - Twice daily'], admissionDate: '2026-02-19' },
];

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  readonly children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    sidebarPosition: 'left',
    tasks: defaultTasks,
    patients: defaultPatients,
  });

  const login = useCallback(() => {
    setState(prev => ({ ...prev, isLoggedIn: true }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isLoggedIn: false }));
  }, []);

  const setSidebarPosition = useCallback((position: 'left' | 'right') => {
    setState(prev => ({ ...prev, sidebarPosition: position }));
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: prev.tasks.length + 1 }]
    }));
  }, []);

  const addPatient = useCallback((patient: Omit<Patient, 'id'>) => {
    setState(prev => ({
      ...prev,
      patients: [...prev.patients, { ...patient, id: prev.patients.length + 1 }]
    }));
  }, []);

  const contextValue = useMemo(
    () => ({ state, login, logout, setSidebarPosition, addTask, addPatient }),
    [state, login, logout, setSidebarPosition, addTask, addPatient]
    );

    return (
    <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>
    );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
