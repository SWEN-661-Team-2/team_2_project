import { Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

// Tab identifiers for the three settings sections
type TabType = 'general' | 'accessibility' | 'notifications';

// All persisted settings fields — mirrors the shape in AppContext
interface SettingsData {
  readonly theme: 'light' | 'dark';
  readonly leftHandedMode: boolean;
  readonly defaultZoom: string;
  readonly userName: string;
  readonly userRole: string;
  readonly enhancedKeyboardNav: boolean;
  readonly alwaysFocusIndicators: boolean;
  readonly highContrastMode: boolean;
  readonly reduceMotion: boolean;
  readonly taskReminders: boolean;
  readonly urgentTaskAlerts: boolean;
  readonly reminderLeadTime: string;
}

// Props for the reusable accessible toggle switch component
interface ToggleSwitchProps {
  readonly enabled: boolean;
  readonly onChange: (enabled: boolean) => void;
  readonly label: string;
  readonly description?: string;
}

// Reusable accessible toggle switch — uses role="switch" and aria-checked
function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex-1 text-left">
        <p className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">{label}</p>
        {description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        {/* Sliding knob */}
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

// Shared section heading with a left accent bar
const sectionHeader = (title: string) => (
  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
    {title}
  </h3>
);

export function SettingsPage() {
  // Pull global settings and the updater from context
  const { state, updateAllSettings } = useAppContext();

  // Active tab controls which settings panel is visible
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // Toast visibility and unsaved-changes tracking
  const [showToast, setShowToast] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Local form state — decoupled from context so changes aren't applied until Save
  const [settings, setSettings] = useState<SettingsData>(state.settings);

  // Keep local form in sync if context is updated externally
  useEffect(() => {
    setSettings(state.settings);
  }, [state.settings]);

  // Generic updater for any single setting field
  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // Commit local settings to context and show the success toast
  const handleSave = () => {
    updateAllSettings(settings);
    setHasUnsavedChanges(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Discard local changes and revert to the last saved context state
  const handleCancel = () => {
    setSettings(state.settings);
    setHasUnsavedChanges(false);
  };

  // Tab definitions — label shown in the tab bar, id used for active state
  const tabs: { readonly id: TabType; readonly label: string }[] = [
    { id: 'general',       label: 'General'       },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-20 lg:pb-0">
      <div className="p-4 md:p-6 lg:p-8">

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Settings & Preferences</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Customize your CareConnect experience</p>
        </div>

        <div className="max-w-[680px] mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

            {/* Tab Navigation — horizontally scrollable on small screens */}
            <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto">
              <div className="flex min-w-max md:min-w-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm md:text-base font-semibold transition-all focus:outline-none ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                        : 'text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content Panel */}
            <div className="p-6 md:p-8 min-h-[400px]">

              {/* General Tab — theme, zoom, layout, user info */}
              {activeTab === 'general' && (
                <div className="space-y-8">

                  <section>
                    {sectionHeader('Appearance')}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-6">

                      {/* Light / Dark theme toggle buttons */}
                      <div>
                        <span className="text-sm md:text-base font-semibold text-slate-900 dark:text-white mb-3 block">Application Theme</span>
                        <div className="grid grid-cols-2 gap-3">
                          {['light', 'dark'].map((t) => (
                            <button
                              key={t}
                              onClick={() => updateSetting('theme', t as 'light' | 'dark')}
                              className={`h-12 rounded-lg border-2 font-bold capitalize transition-all ${
                                settings.theme === t
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-500'
                              }`}
                            >
                              {t} Mode
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Zoom level dropdown */}
                      <label className="block">
                        <span className="text-sm md:text-base font-semibold text-slate-900 dark:text-white mb-2 block">Default Zoom Level</span>
                        <select
                          value={settings.defaultZoom}
                          onChange={(e) => updateSetting('defaultZoom', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none transition-all text-slate-900 dark:text-white font-medium"
                        >
                          {['75%', '90%', '100%', '110%', '125%', '150%'].map((z) => (
                            <option key={z} value={z}>{z}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </section>

                  {/* Left-handed mode — moves sidebar to the right */}
                  <section>
                    {sectionHeader('Layout Preferences')}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl px-4 border border-slate-200 dark:border-slate-700">
                      <ToggleSwitch
                        enabled={settings.leftHandedMode}
                        onChange={(val) => updateSetting('leftHandedMode', val)}
                        label="Left-Handed Mode"
                        description="Moves the navigation sidebar to the right side of the screen"
                      />
                    </div>
                  </section>

                  {/* Display name — shown in the nav header */}
                  <section>
                    {sectionHeader('User Information')}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 space-y-4 border border-slate-200 dark:border-slate-700">
                      <label className="block">
                        <span className="text-sm md:text-base font-semibold text-slate-900 dark:text-white mb-2 block">Display Name</span>
                        <input
                          type="text"
                          value={settings.userName}
                          onChange={(e) => updateSetting('userName', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none transition-all text-slate-900 dark:text-white"
                        />
                      </label>
                    </div>
                  </section>
                </div>
              )}

              {/* Accessibility Tab — visual, motion, and keyboard settings */}
              {activeTab === 'accessibility' && (
                <div className="space-y-6">

                  <section>
                    {sectionHeader('Visual & Motion')}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl px-4 divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700">
                      <ToggleSwitch
                        enabled={settings.highContrastMode}
                        onChange={(val) => updateSetting('highContrastMode', val)}
                        label="High Contrast Mode"
                        description="Optimizes colors for maximum readability"
                      />
                      <ToggleSwitch
                        enabled={settings.reduceMotion}
                        onChange={(val) => updateSetting('reduceMotion', val)}
                        label="Reduce Motion"
                        description="Disables non-essential animations"
                      />
                    </div>
                  </section>

                  <section>
                    {sectionHeader('Navigation')}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl px-4 divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700">
                      <ToggleSwitch
                        enabled={settings.enhancedKeyboardNav}
                        onChange={(val) => updateSetting('enhancedKeyboardNav', val)}
                        label="Enhanced Keyboard Navigation"
                        description="Adds advanced shortcuts for hands-free operation"
                      />
                      <ToggleSwitch
                        enabled={settings.alwaysFocusIndicators}
                        onChange={(val) => updateSetting('alwaysFocusIndicators', val)}
                        label="Persistent Focus Indicators"
                        description="Keep keyboard focus rings visible at all times"
                      />
                    </div>
                  </section>
                </div>
              )}

              {/* Notifications Tab — task alerts and lead time */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">

                  <section>
                    {sectionHeader('Task Alerts')}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl px-4 divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700">
                      <ToggleSwitch
                        enabled={settings.taskReminders}
                        onChange={(val) => updateSetting('taskReminders', val)}
                        label="General Task Reminders"
                      />
                      <ToggleSwitch
                        enabled={settings.urgentTaskAlerts}
                        onChange={(val) => updateSetting('urgentTaskAlerts', val)}
                        label="Priority Alerts"
                        description="Distinct sounds and visuals for critical updates"
                      />
                    </div>
                  </section>

                  {/* How far in advance notifications are sent */}
                  <section>
                    {sectionHeader('Timing')}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <label className="block">
                        <span className="text-sm md:text-base font-semibold text-slate-900 dark:text-white mb-2 block">Notification Lead Time</span>
                        <select
                          value={settings.reminderLeadTime}
                          onChange={(e) => updateSetting('reminderLeadTime', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none transition-all text-slate-900 dark:text-white font-medium"
                        >
                          {['5 minutes', '10 minutes', '15 minutes', '30 minutes', '1 hour'].map((t) => (
                            <option key={t} value={t}>{t} before</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Footer — unsaved changes indicator + Cancel / Save buttons */}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 px-6 py-4 md:px-8">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between items-center">

                {/* Unsaved changes warning */}
                <div className="flex items-center gap-2">
                  {hasUnsavedChanges && (
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-sm font-bold">
                      <AlertCircle className="w-4 h-4" />
                      Unsaved Changes
                    </span>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  {/* Cancel — reverts local state to last saved context values */}
                  <button
                    onClick={handleCancel}
                    disabled={!hasUnsavedChanges}
                    className="flex-1 sm:flex-none h-12 px-6 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl border-2 border-slate-300 dark:border-slate-600 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  {/* Save — commits local state to context */}
                  <button
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges}
                    className={`flex-1 sm:flex-none h-12 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all ${hasUnsavedChanges ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast — shown for 3 seconds after saving */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] border border-slate-700 dark:border-blue-400">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-bold text-lg">Preferences Updated</p>
              <p className="text-sm text-slate-300 dark:text-blue-100">Your settings have been applied successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
