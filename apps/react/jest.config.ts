import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  silent: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/tests/unit/utils.test.ts',
    '<rootDir>/tests/unit/AppContext.test.tsx',
    '<rootDir>/tests/unit/App.test.tsx',
    '<rootDir>/tests/unit/CareConnectNavigation.test.tsx',
    '<rootDir>/tests/unit/SettingsPage.test.tsx',
    '<rootDir>/tests/unit/AddPatientModal.test.tsx',
    '<rootDir>/tests/unit/CareConnectDashboard.test.tsx',
    '<rootDir>/tests/unit/CreateTaskModal.test.tsx',
    '<rootDir>/tests/unit/NewAppointmentModal.test.tsx',
    '<rootDir>/tests/unit/PatientCare.test.tsx',
    '<rootDir>/tests/unit/SchedulePage.test.tsx',
    '<rootDir>/tests/integration/Login.test.tsx',
    '<rootDir>/tests/integration/TaskManagement.test.tsx',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|ico)$': '<rootDir>/__mocks__/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^../../src/db$': '<rootDir>/__mocks__/db.ts',
    '^../../../src/db$': '<rootDir>/__mocks__/db.ts',
    '^dexie$': '<rootDir>/__mocks__/dexie.ts',
    '^dexie-react-hooks$': '<rootDir>/__mocks__/dexie-react-hooks.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.jest.json',
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/App.css',
    '!src/db.ts',
    '!src/setupTests.ts',
  ],

  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageDirectory: 'coverage',
};

export default config;
