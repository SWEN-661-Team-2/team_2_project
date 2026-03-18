import { useState } from 'react';
import {
  Plus, Calendar, UserPlus, Search, CheckSquare,
  AlertCircle, Clock, FileText, Activity,
  Users, CalendarDays,
} from 'lucide-react';
import { NewAppointmentModal } from './NewAppointmentModal';
import { AddPatientModal } from './AddPatientModal';
import { CreateTaskModal } from './CreateTaskModal';

export function CareConnectDashboard() {

  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const summaryCards = [
    { title: 'Active Tasks', value: '12', change: '+3 today', icon: CheckSquare, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { title: 'Urgent Tasks', value: '3', change: 'Needs attention', icon: AlertCircle, color: 'from-red-500 to-orange-500', bgColor: 'bg-red-50', textColor: 'text-red-600' },
    { title: 'Appointments', value: '8', change: '4 today', icon: CalendarDays, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { title: 'Patients', value: '156', change: '+2 this week', icon: Users, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
  ];

  const urgentTasks = [
    { id: 1, title: 'Medication Round - Room 204', patient: 'Sarah Johnson', time: '10:30 AM', priority: 'high' },
    { id: 2, title: 'Blood Pressure Check', patient: 'Michael Chen', time: '11:00 AM', priority: 'high' },
    { id: 3, title: 'Post-Surgery Assessment', patient: 'Emma Davis', time: '11:30 AM', priority: 'urgent' },
  ];

  const todaysSchedule = [
    { id: 1, time: '09:00 AM', title: 'Morning Rounds', type: 'Assessment', patient: 'All Patients', duration: '60 min' },
    { id: 2, time: '10:30 AM', title: 'Consultation', type: 'Consultation', patient: 'John Smith', duration: '30 min' },
    { id: 3, time: '02:00 PM', title: 'Therapy Session', type: 'Therapy', patient: 'Lisa Anderson', duration: '45 min' },
    { id: 4, time: '03:30 PM', title: 'Check-up', type: 'Check-up', patient: 'David Wilson', duration: '15 min' },
  ];

  const careLog = [
    { id: 1, time: '08:45 AM', note: 'Patient vitals recorded and stable', patient: 'Sarah Johnson' },
    { id: 2, time: '09:15 AM', note: 'Medication administered as prescribed', patient: 'Michael Chen' },
    { id: 3, time: '09:45 AM', note: 'Patient showing improvement, continue monitoring', patient: 'Emma Davis' },
  ];

  const recentActivity = [
    { id: 1, action: 'New patient registered', user: 'Dr. Sarah Williams', time: '5 min ago', icon: UserPlus },
    { id: 2, action: 'Task completed', user: 'Nurse Mike Johnson', time: '12 min ago', icon: CheckSquare },
    { id: 3, action: 'Appointment scheduled', user: 'Dr. Emily Brown', time: '23 min ago', icon: Calendar },
    { id: 4, action: 'Care note updated', user: 'Nurse Lisa Chen', time: '45 min ago', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20 lg:pb-0">
      <div className="p-4 md:p-6 lg:p-8">

        {/* Toolbar */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Welcome back! Here's your overview for today.</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button onClick={() => setTaskModalOpen(true)} className="flex items-center gap-2 px-4 h-10 md:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all">
                <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                <span className="hidden sm:inline">New Task</span>
                <span className="sm:hidden">Task</span>
              </button>
              <button onClick={() => setAppointmentModalOpen(true)} className="flex items-center gap-2 px-4 h-10 md:h-12 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm transition-all">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                <span className="hidden sm:inline">New Appointment</span>
                <span className="sm:hidden">Appt</span>
              </button>
              <button onClick={() => setPatientModalOpen(true)} className="flex items-center gap-2 px-4 h-10 md:h-12 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm transition-all">
                <UserPlus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                <span className="hidden sm:inline">New Patient</span>
                <span className="sm:hidden">Patient</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search patients, tasks, appointments... (⌘K)"
              className="w-full h-12 md:h-14 pl-12 pr-24 rounded-lg border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-mono rounded border border-slate-300">⌘K</kbd>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
                <div key={card.title} className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${card.textColor}`} strokeWidth={2} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-slate-600 font-medium">{card.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900">{card.value}</p>
                  <p className="text-xs text-slate-500">{card.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Urgent Tasks */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2} />
                <h2 className="font-bold text-lg text-slate-900">Urgent Tasks</h2>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {urgentTasks.map((task) => (
                <div key={task.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 text-sm">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full flex-shrink-0 ${task.priority === 'urgent' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{task.patient}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{task.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
              <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">View All Tasks →</button>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-green-600" strokeWidth={2} />
                <h2 className="font-bold text-lg text-slate-900">Today's Schedule</h2>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-200">
              {todaysSchedule.map((appointment) => (
                <div key={appointment.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-center">
                      <p className="text-sm font-bold text-blue-600">{appointment.time.split(' ')[0]}</p>
                      <p className="text-xs text-slate-500">{appointment.time.split(' ')[1]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{appointment.title}</h3>
                      <p className="text-xs text-slate-600 mb-1">{appointment.patient}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{appointment.type}</span>
                        <span className="text-slate-500">{appointment.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
              <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">View Full Calendar →</button>
            </div>
          </div>

          {/* Care Log & Recent Activity */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" strokeWidth={2} />
                  <h2 className="font-bold text-lg text-slate-900">Care Log</h2>
                </div>
              </div>
              <div className="divide-y divide-slate-200">
                {careLog.map((log) => (
                  <div key={log.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 mb-1">{log.note}</p>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span>{log.patient}</span>
                          <span>{log.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
                <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">View All Notes →</button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-600" strokeWidth={2} />
                  <h2 className="font-bold text-lg text-slate-900">Recent Activity</h2>
                </div>
              </div>
              <div className="divide-y divide-slate-200">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-slate-600" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 font-medium mb-0.5">{activity.action}</p>
                          <p className="text-xs text-slate-600">{activity.user} · {activity.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewAppointmentModal isOpen={appointmentModalOpen} onClose={() => setAppointmentModalOpen(false)} onSubmit={(data) => console.log('Appointment:', data)} />
      <AddPatientModal isOpen={patientModalOpen} onClose={() => setPatientModalOpen(false)} onSubmit={(data) => console.log('Patient:', data)} />
      <CreateTaskModal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} onSubmit={(data) => console.log('Task:', data)} />
    </div>
  );
}
