import { useState } from 'react';
import {
  LayoutDashboard, CheckSquare, Users, Calendar,
  Settings, Menu, X, LogOut, Heart, MoveHorizontal,
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
  readonly sidebarPosition?: 'left' | 'right';
  readonly onSidebarPositionChange?: (position: 'left' | 'right') => void;
}

export function CareConnectNavigation({ activeItem, onNavigate, onLogout, sidebarPosition: externalPosition, onSidebarPositionChange }: CareConnectNavigationProps) {
  const [internalPosition, setInternalPosition] = useState<'left' | 'right'>('left');
  const sidebarPosition = externalPosition ?? internalPosition;

  const toggleSidebarPosition = () => {
    const next = sidebarPosition === 'left' ? 'right' : 'left';
    setInternalPosition(next);
    onSidebarPositionChange?.(next);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 bottom-0 w-64 bg-white border-slate-200 shadow-xl z-40 ${sidebarPosition === 'left' ? 'left-0 border-r' : 'right-0 border-l'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" fill="white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900">CareConnect</h1>
            <p className="text-xs text-slate-600">Supporting Care</p>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600'}`} strokeWidth={2} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200 space-y-2 bg-slate-50">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-3">
              <MoveHorizontal className="w-5 h-5 text-slate-600" strokeWidth={2} />
              <span className="text-sm font-medium text-slate-700">Switch Layout</span>
            </div>
            <button
              onClick={toggleSidebarPosition}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sidebarPosition === 'right' ? 'bg-blue-500' : 'bg-slate-300'}`}
              aria-label="Toggle sidebar position"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${sidebarPosition === 'right' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Tablet Sidebar */}
      <aside className={`hidden md:flex lg:hidden flex-col fixed top-0 bottom-0 w-20 bg-white border-slate-200 shadow-xl z-40 ${sidebarPosition === 'left' ? 'left-0 border-r' : 'right-0 border-l'}`}>
        <div className="flex items-center justify-center px-4 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" fill="white" strokeWidth={1.5} />
          </div>
        </div>

        <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center justify-center p-3 rounded-xl transition-all group relative ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-slate-700 hover:bg-slate-100'}`}
                title={item.label}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600'}`} strokeWidth={2} />
                {!isActive && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-2 py-4 border-t border-slate-200 space-y-2 bg-slate-50">
          <button onClick={toggleSidebarPosition} className="w-full p-3 rounded-xl hover:bg-slate-200 transition-colors" title="Switch Layout">
            <MoveHorizontal className="w-6 h-6 text-slate-600 mx-auto" strokeWidth={2} />
          </button>
          <button onClick={onLogout} className="w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all" title="Logout">
            <LogOut className="w-6 h-6 mx-auto" strokeWidth={2} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors min-h-[48px] ${isActive ? 'text-blue-600' : 'text-slate-600 active:bg-slate-100'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-slate-600 active:bg-slate-100 transition-colors min-h-[48px]"
          >
            <Menu className="w-6 h-6 stroke-2" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile Slide-over Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full cursor-default"
            onClick={() => setIsMobileMenuOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" fill="white" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">CareConnect</h2>
                  <p className="text-xs text-slate-600">More Options</p>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              <button
                onClick={() => handleNavigation('settings')}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${activeItem === 'settings' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <Settings className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium">Settings</span>
              </button>

              <div className="px-4 py-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MoveHorizontal className="w-5 h-5 text-slate-600" strokeWidth={2} />
                    <span className="font-medium text-slate-700">Switch Layout</span>
                  </div>
                  <button
                    onClick={toggleSidebarPosition}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${sidebarPosition === 'right' ? 'bg-blue-500' : 'bg-slate-300'}`}
                    aria-label="Toggle sidebar position"
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${sidebarPosition === 'right' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-8">Sidebar: {sidebarPosition === 'left' ? 'Left' : 'Right'}</p>
              </div>

              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium">
                <LogOut className="w-5 h-5" strokeWidth={2} />
                <span>Logout</span>
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-slate-50">
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">CareConnect v2.0</p>
                <p className="text-xs text-slate-500 mt-1">Supporting Care, Connecting Hearts</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
