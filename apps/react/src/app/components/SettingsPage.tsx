import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

type TabType = 'general' | 'accessibility' | 'notifications';

interface SettingsData {
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

interface ToggleSwitchProps {
  readonly enabled: boolean;
  readonly onChange: (enabled: boolean) => void;
  readonly label: string;
  readonly description?: string;
}

function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex-1">
        <p className="text-sm md:text-base font-semibold text-slate-900">{label}</p>
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        onKeyDown={(e) => e.key === 'Enter' && onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-slate-300'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

const sectionHeader = (title: string) => (
  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
    {title}
  </h3>
);

interface SettingsPageProps {
  readonly leftHandedMode?: boolean;
  readonly onLeftHandedChange?: (position: 'left' | 'right') => void;
}

export function SettingsPage({ leftHandedMode = false, onLeftHandedChange }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [showToast, setShowToast] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<SettingsData>({
    leftHandedMode: false,
    defaultZoom: '100%',
    userName: 'Sarah Johnson, RN',
    userRole: 'Registered Nurse',
    enhancedKeyboardNav: false,
    alwaysFocusIndicators: false,
    highContrastMode: false,
    reduceMotion: false,
    taskReminders: true,
    urgentTaskAlerts: true,
    reminderLeadTime: '15 minutes',
  });

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    document.body.style.zoom = settings.defaultZoom;
  }, [settings.defaultZoom]);


  const handleSave = () => {
    console.log('Saving settings:', settings);
    setHasUnsavedChanges(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const tabs: { readonly id: TabType; readonly label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20 lg:pb-0">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Settings & Preferences</h1>
          <p className="text-sm text-slate-600 mt-1">Customize your CareConnect experience</p>
        </div>

        <div className="max-w-[680px] mx-auto">
          <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 bg-slate-50 overflow-x-auto">
              <div className="flex min-w-max md:min-w-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm md:text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8 min-h-[400px]">

              {activeTab === 'general' && (
                <div className="space-y-6">
                  <section>
                    {sectionHeader('Layout Preferences')}
                    <div className="bg-slate-50 rounded-lg px-4 divide-y divide-slate-200">
                      <ToggleSwitch
                        enabled={leftHandedMode}
                        onChange={(val) => {
                          updateSetting('leftHandedMode', val);
                          onLeftHandedChange?.(val ? 'right' : 'left');
                        }}
                        label="Left-Handed Mode"
                        description="Optimize layout for left-handed users"
                      />

                    </div>
                  </section>

                  <section>
                    {sectionHeader('Appearance')}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <label className="block">
                        <span className="text-sm md:text-base font-semibold text-slate-900 mb-2 block">Default Zoom Level</span>
                        <select value={settings.defaultZoom} onChange={(e) => updateSetting('defaultZoom', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium">
                          {['75%','90%','100%','110%','125%','150%'].map((z) => <option key={z} value={z}>{z}</option>)}
                        </select>
                      </label>
                    </div>
                  </section>

                  <section>
                    {sectionHeader('User Information')}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                      <label className="block">
                        <span className="text-sm md:text-base font-semibold text-slate-900 mb-2 block">Name</span>
                        <input type="text" value={settings.userName} onChange={(e) => updateSetting('userName', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none transition-all text-slate-900" />
                      </label>
                      <label className="block">
                        <span className="text-sm md:text-base font-semibold text-slate-900 mb-2 block">Role</span>
                        <input type="text" value={settings.userRole} onChange={(e) => updateSetting('userRole', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none transition-all text-slate-900" />
                      </label>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div className="space-y-6">
                  <section>
                    {sectionHeader('Keyboard & Navigation')}
                    <div className="bg-slate-50 rounded-lg px-4 divide-y divide-slate-200">
                      <ToggleSwitch enabled={settings.enhancedKeyboardNav} onChange={(val) => updateSetting('enhancedKeyboardNav', val)} label="Enhanced Keyboard Navigation" description="Enable advanced keyboard shortcuts and navigation controls" />
                      <ToggleSwitch enabled={settings.alwaysFocusIndicators} onChange={(val) => updateSetting('alwaysFocusIndicators', val)} label="Always Show Focus Indicators" description="Display focus rings at all times for better visibility" />
                    </div>
                  </section>
                  <section>
                    {sectionHeader('Visual Accessibility')}
                    <div className="bg-slate-50 rounded-lg px-4 divide-y divide-slate-200">
                      <ToggleSwitch enabled={settings.highContrastMode} onChange={(val) => updateSetting('highContrastMode', val)} label="High Contrast Mode" description="Increase color contrast for improved readability" />
                      <ToggleSwitch enabled={settings.reduceMotion} onChange={(val) => updateSetting('reduceMotion', val)} label="Reduce Motion" description="Minimize animations and transitions for reduced motion sensitivity" />
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <section>
                    {sectionHeader('Task Notifications')}
                    <div className="bg-slate-50 rounded-lg px-4 divide-y divide-slate-200">
                      <ToggleSwitch enabled={settings.taskReminders} onChange={(val) => updateSetting('taskReminders', val)} label="Task Reminders" description="Receive notifications for upcoming tasks" />
                      <ToggleSwitch enabled={settings.urgentTaskAlerts} onChange={(val) => updateSetting('urgentTaskAlerts', val)} label="Urgent Task Alerts" description="Get priority notifications for high-priority tasks" />
                    </div>
                  </section>
                  <section>
                    {sectionHeader('Reminder Settings')}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <label className="block">
                        <span className="text-sm md:text-base font-semibold text-slate-900 mb-2 block">Reminder Lead Time</span>
                        <select value={settings.reminderLeadTime} onChange={(e) => updateSetting('reminderLeadTime', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium">
                          {['5 minutes','10 minutes','15 minutes','30 minutes','1 hour'].map((t) => (
                            <option key={t} value={t}>{t} before</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 md:px-8">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button onClick={() => setHasUnsavedChanges(false)}
                  className="h-12 px-6 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border-2 border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!hasUnsavedChanges}
                  className={`h-12 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasUnsavedChanges ? '' : 'opacity-50 cursor-not-allowed'}`}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[280px] border border-slate-700">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-base">Settings saved</p>
              <p className="text-sm text-slate-300">Your preferences have been updated</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
