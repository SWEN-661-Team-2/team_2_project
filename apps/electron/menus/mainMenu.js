// path: menus/mainMenu.js
const { Menu, app } = require('electron');

function accel(key) {
  return process.platform === 'darwin' ? `Command+${key}` : `Ctrl+${key}`;
}

function shiftAccel(key) {
  return process.platform === 'darwin' ? `Command+Shift+${key}` : `Ctrl+Shift+${key}`;
}

function buildMainMenu({ onNavigate, onLogout, onToggleLayout, onSetLayout }) {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Task',
          accelerator: accel('N'),
          click: () => onNavigate('tasks')
        },
        {
          label: 'New Appointment',
          accelerator: shiftAccel('N'),
          click: () => onNavigate('schedule')
        },
        {
          label: 'New Patient',
          accelerator: accel('P'),
          click: () => onNavigate('patients')
        },
        { type: 'separator' },
        {
          label: 'Export Data',
          accelerator: accel('E'),
          click: () => onNavigate('dashboard')
        },
        {
          label: 'Import Data',
          accelerator: accel('I'),
          click: () => onNavigate('dashboard')
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: process.platform === 'darwin' ? 'Command+,' : 'Ctrl+,',
          click: () => onNavigate('settings')
        },
        { type: 'separator' },
        { label: 'Logout', click: () => onLogout() },
        {
          label: process.platform === 'darwin' ? 'Quit' : 'Exit',
          accelerator: accel('Q'),
          click: () => app.quit()
        }
      ]
    },
    {
    label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: accel('1'),
          click: () => onNavigate('dashboard')
        },
        {
          label: 'Tasks',
          accelerator: accel('2'),
          click: () => onNavigate('tasks')
        },
        {
          label: 'Schedule',
          accelerator: accel('3'),
          click: () => onNavigate('schedule')
        },
        {
          label: 'Patients',
          accelerator: accel('4'),
          click: () => onNavigate('patients')
        },
        { type: 'separator' },
        {
          label: 'Toggle Sidebar',
          accelerator: accel('B'),
          click: () => onNavigate('toggleSidebar')
        },
        {
          label: 'Quick Search',
          accelerator: accel('K'),
          click: () => onNavigate('quickSearch')
        },
        { type: 'separator' },
        {
          label: 'Switch to Left-Handed Layout',
          accelerator: shiftAccel('L'),
          click: () => onSetLayout('left')
        },
        {
          label: 'Switch to Right-Handed Layout',
          accelerator: shiftAccel('R'),
          click: () => onSetLayout('right')
        },
        {
          label: 'Toggle Layout Mode',
          accelerator: process.platform === 'darwin' ? 'Command+Alt+L' : 'Ctrl+Alt+L',
          click: () => onToggleLayout()
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Keyboard Shortcuts',
          accelerator: process.platform === 'darwin' ? 'Command+/' : 'Ctrl+/',
          click: () => onNavigate('shortcuts')
        },
        { type: 'separator' },
        {
          label: 'About CareConnect',
          click: () => onNavigate('about')
        }
      ]
    }
  ];

  // On macOS, prepend the app menu
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Preferences',
          accelerator: 'Command+,',
          click: () => onNavigate('settings')
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  return Menu.buildFromTemplate(template);
}

module.exports = { buildMainMenu };