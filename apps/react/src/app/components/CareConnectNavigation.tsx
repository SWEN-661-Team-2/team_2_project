import { useState } from 'react';
import {
  LayoutDashboard, CheckSquare, Users, Calendar,
  Settings, Menu, X, LogOut, MoveHorizontal,
} from 'lucide-react';

interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface CareConnectNavigationProps {
  readonly activeItem: string;
  readonly onNavigate: (id: string) => void;
  readonly onLogout?: () => void;
  readonly sidebarPosition: 'left' | 'right';
  readonly onSidebarPositionChange: (position: 'left' | 'right') => void;
}

export function CareConnectNavigation({
  activeItem,
  onNavigate,
  onLogout,
  sidebarPosition,
  onSidebarPositionChange
}: CareConnectNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logic to switch the sidebar position and notify the parent App component
  const handleTogglePosition = () => {
    const nextPosition = sidebarPosition === 'left' ? 'right' : 'left';
    onSidebarPositionChange(nextPosition);
  };

  const handleNavigation = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar (lg) */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl z-40 transition-all duration-300 ${sidebarPosition === 'left' ? 'left-0 border-r' : 'right-0 border-l'
          }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/careconnect_logo.png" alt="CareConnect" className="w-8 h-8 rounded-xl" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">CareConnect</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium text-left">Supporting Care</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <MoveHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Layout</span>
            </div>
            <button
              onClick={handleTogglePosition}

              // Added aria-label for identification
              aria-label={`Switch sidebar to ${sidebarPosition === 'left' ? 'right' : 'left'} side`}
              // Added aria-pressed to communicate the "on/off" state
              aria-pressed={sidebarPosition === 'right'}

              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sidebarPosition === 'right' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sidebarPosition === 'right' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" strokeWidth={2.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Tablet Sidebar (md to lg) */}
      <aside
        className={`hidden md:flex lg:hidden flex-col fixed top-0 bottom-0 w-20 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl z-40 ${sidebarPosition === 'left' ? 'left-0 border-r' : 'right-0 border-l'
          }`}
      >
        <div className="flex items-center justify-center py-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/careconnect_logo.png" alt="CareConnect" className="w-8 h-8 rounded-xl" />
          </div>
        </div>
        <nav className="flex-1 px-2 py-6 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center justify-center p-3 rounded-xl transition-all ${isActive ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                title={item.label}
              >
                <Icon className="w-6 h-6" strokeWidth={2} />
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={onLogout} className="w-full flex justify-center text-red-500" aria-label="Logout">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-500"
          >
            <Menu className="w-5 h-5 stroke-2" />
            <span className="text-[10px] font-bold uppercase tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Slide-over */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <button
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm w-full cursor-default"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => handleNavigation('settings')}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold ${activeItem === 'settings' ? 'bg-blue-500 text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-500 font-bold"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}