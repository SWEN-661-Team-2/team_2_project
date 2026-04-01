import { useState } from 'react';
import {
  LayoutDashboard, CheckSquare, Users, Calendar,
  Settings, Menu, X, LogOut, MoveHorizontal,
} from 'lucide-react';

// Shape of a single navigation item
interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: React.ElementType;
}

// Navigation items — order determines render order in all three nav surfaces
const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks',     label: 'Tasks',     icon: CheckSquare      },
  { id: 'schedule',  label: 'Schedule',  icon: Calendar         },
  { id: 'patients',  label: 'Patients',  icon: Users            },
  { id: 'settings',  label: 'Settings',  icon: Settings         },
];

// Props passed in from App.tsx
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
  onSidebarPositionChange,
}: CareConnectNavigationProps) {
  // Controls the mobile slide-over menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggles sidebar between left and right and notifies the parent App component
  const handleTogglePosition = () => {
    const nextPosition = sidebarPosition === 'left' ? 'right' : 'left';
    onSidebarPositionChange(nextPosition);
  };

  // Navigates to the selected page and closes the mobile menu if open
  const handleNavigation = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ── Skip to Main Content ───────────────────────────────────────── */}
      {/* Visually hidden until focused — allows keyboard users to bypass navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-lg"
      >
        Skip to Main Content
      </a>

      {/* ── Desktop Sidebar (lg and above) ─────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl z-40 transition-all duration-300 ${
          sidebarPosition === 'left' ? 'left-0 border-r' : 'right-0 border-l'
        }`}
      >
        {/* Branding header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/careconnect_logo.png" alt="CareConnect logo" className="w-8 h-8 rounded-xl" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">CareConnect</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium text-left">Supporting Care</p>
          </div>
        </div>

        {/* Primary navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer controls — layout toggle and logout */}
        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-900/50">

          {/* Sidebar position toggle */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <MoveHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Layout</span>
            </div>
            {/* Native button toggle — aria-pressed communicates on/off state */}
            <button
              type="button"
              onClick={handleTogglePosition}
              aria-label={`Switch sidebar to ${sidebarPosition === 'left' ? 'right' : 'left'} side`}
              aria-pressed={sidebarPosition === 'right'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                sidebarPosition === 'right' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              {/* Sliding knob */}
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                sidebarPosition === 'right' ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Tablet Sidebar (md to lg) ───────────────────────────────────── */}
      {/* Icon-only sidebar — labels are provided via title and aria-label */}
      <aside
        className={`hidden md:flex lg:hidden flex-col fixed top-0 bottom-0 w-20 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl z-40 ${
          sidebarPosition === 'left' ? 'left-0 border-r' : 'right-0 border-l'
        }`}
      >
        {/* Logo only — no text at this breakpoint */}
        <div className="flex items-center justify-center py-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/careconnect_logo.png" alt="CareConnect logo" className="w-8 h-8 rounded-xl" />
          </div>
        </div>

        <nav className="flex-1 px-2 py-6 space-y-4" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                title={item.label}
                className={`w-full flex items-center justify-center p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
              </button>
            );
          })}
        </nav>

        {/* Logout — icon only at tablet size */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onLogout}
            aria-label="Logout"
            className="w-full flex justify-center text-red-500"
          >
            <LogOut className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation (below md) ────────────────────────── */}
      {/* Shows first 4 nav items as icon+label tabs, plus a More button */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
              </button>
            );
          })}

          {/* More button — opens the mobile slide-over menu */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open more options"
            aria-expanded={isMobileMenuOpen}
            className="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-500"
          >
            <Menu className="w-5 h-5 stroke-2" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile Slide-over Menu ──────────────────────────────────────── */}
      {/* Contains Settings and Logout — items that don't fit the bottom bar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">

          {/* Backdrop — native button for full keyboard and assistive tech support */}
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm w-full cursor-default"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />

          {/* Slide-over panel — native <dialog> for full accessibility support */}
          <dialog
            open
            aria-label="More options menu"
            className="absolute right-0 top-0 bottom-0 m-0 w-72 h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300"
          >
            {/* Panel header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">Menu</h2>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 text-slate-500"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Panel links */}
            <div className="p-4 space-y-2">
              <button
                type="button"
                onClick={() => handleNavigation('settings')}
                aria-current={activeItem === 'settings' ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold ${
                  activeItem === 'settings'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
                Settings
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-500 font-bold"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
                Logout
              </button>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}
