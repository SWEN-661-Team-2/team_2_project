import { useState } from 'react';
import {
  Plus, Search, User, Phone, Mail, Calendar,
  MapPin, Activity, Pill, FileText, ChevronLeft,
} from 'lucide-react';
import { AddPatientModal } from './AddPatientModal';

type PatientStatus = 'stable' | 'improving' | 'critical';

interface Patient {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly initials: string;
  readonly room: string;
  readonly age: number;
  readonly gender: string;
  readonly status: PatientStatus;
  readonly phone: string;
  readonly email: string;
  readonly diagnosis: string[];
  readonly medications: string[];
  readonly admissionDate: string;
}

const patientsData: Patient[] = [
  { id: 1, firstName: 'John', lastName: 'Davis', initials: 'JD', room: '204A', age: 68, gender: 'Male', status: 'stable', phone: '(555) 123-4567', email: 'john.davis@email.com', diagnosis: ['Hypertension', 'Type 2 Diabetes'], medications: ['Metformin 500mg - Twice daily', 'Lisinopril 10mg - Once daily', 'Aspirin 81mg - Once daily'], admissionDate: '2026-02-20' },
  { id: 2, firstName: 'Mary', lastName: 'Wilson', initials: 'MW', room: '301B', age: 54, gender: 'Female', status: 'improving', phone: '(555) 234-5678', email: 'mary.wilson@email.com', diagnosis: ['Post-operative recovery', 'Mild anemia'], medications: ['Iron supplement 325mg - Once daily', 'Acetaminophen 500mg - As needed for pain'], admissionDate: '2026-02-22' },
  { id: 3, firstName: 'Robert', lastName: 'Brown', initials: 'RB', room: '156C', age: 72, gender: 'Male', status: 'critical', phone: '(555) 345-6789', email: 'robert.brown@email.com', diagnosis: ['Acute respiratory distress', 'Pneumonia'], medications: ['Amoxicillin 500mg - Three times daily', 'Albuterol inhaler - Every 4 hours', 'Prednisone 20mg - Twice daily'], admissionDate: '2026-02-24' },
  { id: 4, firstName: 'Lisa', lastName: 'Anderson', initials: 'LA', room: '412A', age: 45, gender: 'Female', status: 'stable', phone: '(555) 456-7890', email: 'lisa.anderson@email.com', diagnosis: ['Migraine management', 'Anxiety disorder'], medications: ['Sumatriptan 50mg - As needed', 'Sertraline 50mg - Once daily'], admissionDate: '2026-02-21' },
  { id: 5, firstName: 'James', lastName: 'Miller', initials: 'JM', room: '218B', age: 61, gender: 'Male', status: 'improving', phone: '(555) 567-8901', email: 'james.miller@email.com', diagnosis: ['Coronary artery disease', 'Hyperlipidemia'], medications: ['Atorvastatin 40mg - Once daily at bedtime', 'Clopidogrel 75mg - Once daily', 'Metoprolol 50mg - Twice daily'], admissionDate: '2026-02-19' },
];

export function PatientCare() {
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const filteredPatients = patientsData.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || patient.room.toLowerCase().includes(query) || patient.initials.toLowerCase().includes(query);
  });

  const selectedPatient = selectedPatientId ? patientsData.find((p) => p.id === selectedPatientId) : null;

  const getStatusStyles = (status: PatientStatus) => {
    switch (status) {
      case 'stable': return { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
      case 'improving': return { dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      case 'critical': return { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
    }
  };

  const getStatusLabel = (status: PatientStatus) => status.charAt(0).toUpperCase() + status.slice(1);

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
    setShowMobileDetail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20 lg:pb-0">
      <div className="p-4 md:p-6 lg:p-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Patient Care</h1>
            <p className="text-sm text-slate-600 mt-1">Manage patient information and care plans</p>
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
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search patients by name or room..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                {filteredPatients.length > 0 ? filteredPatients.map((patient) => {
                  const isSelected = selectedPatientId === patient.id;
                  const statusStyles = getStatusStyles(patient.status);
                  return (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient.id)}
                      className={`w-full p-5 text-left transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md ${isSelected ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}>
                          {patient.initials}
                          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusStyles.dot}`} title={getStatusLabel(patient.status)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 mb-0.5 truncate">{patient.firstName} {patient.lastName}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                            <span className="font-medium">Room {patient.room}</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full" />
                            <span className={`font-semibold ${statusStyles.text}`}>{getStatusLabel(patient.status)}</span>
                          </div>
                        </div>
                        {isSelected && <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                    </button>
                  );
                }) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600">No patients found</p>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>

              {filteredPatients.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <p className="text-sm text-slate-600 text-center">
                    Showing <span className="font-semibold">{filteredPatients.length}</span> patient{filteredPatients.length === 1 ? '' : 's'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Patient Detail */}
          <div className={`lg:col-span-7 ${showMobileDetail ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm min-h-[600px]">
              {selectedPatient ? (
                <div>
                  <div className="lg:hidden p-4 border-b border-slate-200 bg-slate-50">
                    <button onClick={() => setShowMobileDetail(false)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back to list</span>
                    </button>
                  </div>

                  <div className="p-6 md:p-8 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-start gap-6">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg">
                          {selectedPatient.initials}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white ${getStatusStyles(selectedPatient.status).dot} shadow-md`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-slate-600 mb-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" strokeWidth={2} />
                            <span className="font-medium">Room {selectedPatient.room}</span>
                          </div>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          <span>{selectedPatient.age} years old</span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          <span>{selectedPatient.gender}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 bg-white">
                          <div className={`w-2.5 h-2.5 rounded-full ${getStatusStyles(selectedPatient.status).dot}`} />
                          <span className={`text-sm font-bold ${getStatusStyles(selectedPatient.status).text}`}>{getStatusLabel(selectedPatient.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-slate-500" strokeWidth={2} />
                          <span className="text-slate-900 font-medium">{selectedPatient.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-slate-500" strokeWidth={2} />
                          <span className="text-slate-900 font-medium">{selectedPatient.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-slate-500" strokeWidth={2} />
                          <span className="text-slate-600">
                            Admitted: <span className="font-medium text-slate-900">
                              {new Date(selectedPatient.admissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </span>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                          <Activity className="w-4 h-4 text-red-600" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Diagnosis</h3>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <ul className="space-y-2">
                          {selectedPatient.diagnosis.map((d) => (
                            <li key={d} className="flex items-start gap-2 text-sm text-slate-900">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                              <span className="font-medium">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Pill className="w-4 h-4 text-blue-600" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Current Medications</h3>
                      </div>
                      <div className="space-y-3">
                        {selectedPatient.medications.map((med, i) => (
                            <div key={med} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                              <p className="text-sm text-slate-900 font-medium flex-1">{med}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="pt-4 border-t border-slate-200">
                      <button className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5" strokeWidth={2} />
                        <span>Update Care Plan</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[600px] p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User className="w-10 h-10 text-slate-400" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Patient Selected</h3>
                    <p className="text-slate-600 mb-6 max-w-xs mx-auto">Select a patient from the list to view their details and care information</p>
                    <button onClick={() => setPatientModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                      <Plus className="w-5 h-5" />
                      <span>Add New Patient</span>
                    </button>
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
        onSubmit={(data) => { console.log('New Patient:', data); setPatientModalOpen(false); }}
      />
    </div>
  );
}
