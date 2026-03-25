import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Plus, Search, User, Phone, Mail, 
  MapPin, Activity, Pill, ChevronLeft 
} from 'lucide-react';

// Import your database instance and the Patient type we defined in db.ts
import { db, type Patient } from '../../db'; 
import { AddPatientModal } from './AddPatientModal';

export function PatientCare() {
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // 1. Pull real data from IndexedDB. 
  // useLiveQuery automatically re-renders when the database changes.
  const patientsFromDb = useLiveQuery(() => db.patients.toArray()) || [];

  // 2. Filter logic using the DB data
  const filteredPatients = patientsFromDb.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) || 
      patient.room.toLowerCase().includes(query) || 
      patient.initials.toLowerCase().includes(query)
    );
  });

  // 3. Find selected patient from the DB results
  const selectedPatient = selectedPatientId 
    ? patientsFromDb.find((p) => p.id === selectedPatientId) 
    : null;

  // 4. Handle adding a new patient to Dexie
  const handleAddPatient = async (data: any) => {
    try {
      // Create initials if the form doesn't provide them
      const initials = `${data.firstName[0]}${data.lastName[0]}`.toUpperCase();
      
      await db.patients.add({
        ...data,
        initials,
        // Ensure arrays exist so the UI doesn't crash
        diagnosis: data.diagnosis || [],
        medications: data.medications || [],
        admissionDate: data.admissionDate || new Date().toISOString().split('T')[0],
      });
      
      setPatientModalOpen(false);
    } catch (error) {
      console.error("Failed to save patient to Dexie:", error);
    }
  };

  const getStatusStyles = (status: Patient['status']) => {
    switch (status) {
      case 'stable': return { dot: 'bg-green-500', text: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' };
      case 'improving': return { dot: 'bg-yellow-500', text: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' };
      case 'critical': return { dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' };
      default: return { dot: 'bg-slate-500', text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const getStatusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
    setShowMobileDetail(true);
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 lg:pb-0">
      <div className="p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Patient Care</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage patient information and care plans</p>
          </div>
          <button
            onClick={() => setPatientModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 h-12 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>Add Patient</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient List */}
          <div className={`lg:col-span-5 ${showMobileDetail ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
                {filteredPatients.length > 0 ? filteredPatients.map((patient) => {
                  const isSelected = selectedPatientId === patient.id;
                  const statusStyles = getStatusStyles(patient.status);
                  return (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient.id!)}
                      className={`w-full p-5 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:outline-none ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md ${isSelected ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}>
                          {patient.initials}
                          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${statusStyles.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-0.5 truncate">{patient.firstName} {patient.lastName}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="font-medium">Room {patient.room}</span>
                            <span className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
                            <span className={`font-semibold ${statusStyles.text}`}>{getStatusLabel(patient.status)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                }) : (
                  <div className="p-12 text-center bg-white dark:bg-slate-800">
                    <Search className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">No patients found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patient Detail Panel */}
          <div className={`lg:col-span-7 ${showMobileDetail ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm min-h-[600px]">
              {selectedPatient ? (
                <div>
                  <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <button onClick={() => setShowMobileDetail(false)} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back to list</span>
                    </button>
                  </div>

                  <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg">
                          {selectedPatient.initials}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 ${getStatusStyles(selectedPatient.status).dot}`} />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4">
                          <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-200">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            Room {selectedPatient.room}
                          </div>
                          <span className="hidden md:block w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
                          <span>{selectedPatient.age} yrs</span>
                          <span className="hidden md:block w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
                          <span>{selectedPatient.gender}</span>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border-2 ${getStatusStyles(selectedPatient.status).bg} ${getStatusStyles(selectedPatient.status).border} ${getStatusStyles(selectedPatient.status).text}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${getStatusStyles(selectedPatient.status).dot}`} />
                          {getStatusLabel(selectedPatient.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                         <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 mb-2">
                           <Phone className="w-4 h-4" />
                           <span className="text-xs font-bold uppercase tracking-wider">Phone</span>
                         </div>
                         <p className="text-slate-900 dark:text-white font-semibold">{selectedPatient.phone}</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                         <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 mb-2">
                           <Mail className="w-4 h-4" />
                           <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                         </div>
                         <p className="text-slate-900 dark:text-white font-semibold truncate">{selectedPatient.email}</p>
                      </div>
                    </div>

                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Diagnosis</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.diagnosis.map((d) => (
                          <span key={d} className="px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-lg text-sm font-semibold">
                            {d}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Pill className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Current Medications</h3>
                      </div>
                      <div className="space-y-3">
                        {selectedPatient.medications.map((med) => (
                          <div key={med} className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl">
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{med}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[600px] p-8 text-center">
                  <div>
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Patient Selected</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xs mx-auto">Select a patient to view their full records.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddPatientModal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        onSubmit={handleAddPatient}
      />
    </div>
  );
}