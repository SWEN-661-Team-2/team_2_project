import { useState } from 'react';
import {
  Plus, ChevronLeft, ChevronRight,
  Calendar as CalendarIcon, Clock,
  CheckCircle, Circle, TrendingUp,
} from 'lucide-react';
import { NewAppointmentModal } from './NewAppointmentModal';

type AppointmentStatus = 'completed' | 'scheduled' | 'available';

interface Appointment {
  readonly id: number;
  readonly time: string;
  readonly patient: string | null;
  readonly duration: number | null;
  readonly type: string | null;
  readonly status: AppointmentStatus;
}

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const februaryDays = Array.from({ length: 28 }, (_, i) => i + 1);

const appointments: Appointment[] = [
  { id: 1, time: '08:00 AM', patient: 'John Davis', duration: 30, type: 'Medication Round', status: 'completed' },
  { id: 2, time: '09:00 AM', patient: null, duration: null, type: null, status: 'available' },
  { id: 3, time: '02:00 PM', patient: 'John Davis', duration: 15, type: 'Medication Administration', status: 'scheduled' },
];

export function SchedulePage() {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(26);
  const today = 25;

  const totalAppointments = appointments.filter((a) => a.status !== 'available').length;
  const completedAppointments = appointments.filter((a) => a.status === 'completed').length;
  const upcomingAppointments = appointments.filter((a) => a.status === 'scheduled').length;

  const getSelectedDateString = () =>
    new Date(2026, 1, selectedDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const getStatusStyles = (status: AppointmentStatus) => {
    switch (status) {
      case 'completed': return {
        bg: 'bg-green-50 dark:bg-green-900/10', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400',
        badge: 'bg-green-700', icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={2} />,
      };
      case 'scheduled': return {
        bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400',
        badge: 'bg-blue-700', icon: <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />,
      };
      case 'available': return {
        bg: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-300 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-400',
        badge: 'bg-slate-200 dark:bg-slate-700', badgeText: 'text-slate-700 dark:text-slate-100', icon: <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" strokeWidth={2} />,
      };
    }
  };

  const getDayStyles = (isToday: boolean, isSelected: boolean): string => {
    if (isToday && isSelected) return 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg';
    if (isToday) return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500';
    if (isSelected) return 'bg-slate-900 dark:bg-blue-600 text-white shadow-md';
    return 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700';
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 lg:pb-0">
      <div className="p-4 md:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Calendar</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage appointments and schedules</p>
          </div>
          <button
            onClick={() => setAppointmentModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 h-12 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>New Appointment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Calendar Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">February 2026</h2>
                  <div className="flex items-center gap-2">
                    <button aria-label="Previous month" className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button aria-label="Next month" className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-slate-600 dark:text-slate-500 py-2 uppercase tracking-wider">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {februaryDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}

                      // Provides context like "February 25, 2026"
                      aria-label={`February ${day}, 2026`}
                      // Tells the user which date is currently active
                      aria-pressed={day === selectedDate}


                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${getDayStyles(day === today, day === selectedDate)}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <CalendarIcon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Selected Date</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{getSelectedDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Timeline */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daily Schedule</h2>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Feb {selectedDate}, 2026</span>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {appointments.map((appointment) => {
                  const styles = getStatusStyles(appointment.status);
                  return (
                    <div key={appointment.id} className={`p-5 md:p-6 ${styles.bg} border-l-4 ${styles.border} transition-all hover:bg-slate-100/50 dark:hover:bg-slate-700/30`}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{styles.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg text-slate-900 dark:text-white">{appointment.time}</span>
                                <span className={`px-2 py-0.5 ${styles.badge} ${styles.badgeText || 'text-white'} text-[10px] font-black rounded-full uppercase`}>
                                  {appointment.status}
                                </span>
                              </div>
                              {appointment.status === 'available' ? (
                                <p className={`text-sm ${styles.text} italic`}>Available Time Slot</p>
                              ) : (
                                <>
                                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{appointment.patient}</p>
                                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />{appointment.duration} min
                                    </span>
                                    <span className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
                                    <span>{appointment.type}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            {appointment.status === 'available' ? (
                              <button onClick={() => setAppointmentModalOpen(true)} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-lg transition-colors shadow-md">
                                Book
                              </button>
                            ) : (
                              <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors shadow-sm">
                                Details
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
                <button onClick={() => setAppointmentModalOpen(true)} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold">
                  + Add appointment to this time slot
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { label: 'Total Appointments', value: totalAppointments, sub: 'Scheduled today', icon: CalendarIcon, bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Completed', value: completedAppointments, sub: 'Finished appointments', icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-600 dark:text-green-400' },
            { label: 'Upcoming', value: upcomingAppointments, sub: 'Scheduled ahead', icon: TrendingUp, bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-600 dark:text-purple-400' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-5 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${card.color}`} strokeWidth={2} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">{card.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{card.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewAppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        onSubmit={(data) => { console.log('New Appointment:', data); setAppointmentModalOpen(false); }}
      />
    </div>
  );
}