import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../../src/app/context/AppContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppContext', () => {
  it('provides initial state', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    expect(result.current.state.isLoggedIn).toBe(false);
    expect(result.current.state.sidebarPosition).toBe('left');
    expect(result.current.state.tasks).toHaveLength(4);
    expect(result.current.state.patients).toHaveLength(5);
  });

  it('login sets isLoggedIn to true', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    act(() => { result.current.login(); });
    expect(result.current.state.isLoggedIn).toBe(true);
  });

  it('logout sets isLoggedIn to false', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    act(() => { result.current.login(); });
    act(() => { result.current.logout(); });
    expect(result.current.state.isLoggedIn).toBe(false);
  });

  it('setSidebarPosition updates to right', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    act(() => { result.current.setSidebarPosition('right'); });
    expect(result.current.state.sidebarPosition).toBe('right');
  });

  it('setSidebarPosition updates back to left', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    act(() => { result.current.setSidebarPosition('right'); });
    act(() => { result.current.setSidebarPosition('left'); });
    expect(result.current.state.sidebarPosition).toBe('left');
  });

  it('addTask adds a new task', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    act(() => {
      result.current.addTask({
        title: 'Test Task',
        priority: 'high',
        patient: 'Test Patient',
        time: '3:00 PM',
        status: 'pending',
        category: 'Medication',
      });
    });
    expect(result.current.state.tasks).toHaveLength(5);
    expect(result.current.state.tasks[4].title).toBe('Test Task');
  });

  it('addTask sets correct priority', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    act(() => {
      result.current.addTask({
        title: 'Low Priority Task',
        priority: 'low',
        patient: 'Test Patient',
        time: '4:00 PM',
        status: 'pending',
        category: 'Assessment',
      });
    });
    expect(result.current.state.tasks[4].priority).toBe('low');
  });

  it('addPatient adds a new patient', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    act(() => {
      result.current.addPatient({
        firstName: 'Jane',
        lastName: 'Doe',
        initials: 'JD',
        room: '101A',
        age: 35,
        gender: 'Female',
        status: 'stable',
        phone: '(555) 000-1111',
        email: 'jane.doe@email.com',
        diagnosis: ['Hypertension'],
        medications: ['Lisinopril 10mg'],
        admissionDate: '2026-03-01',
      });
    });
    expect(result.current.state.patients).toHaveLength(6);
    expect(result.current.state.patients[5].firstName).toBe('Jane');
  });

  it('addPatient sets correct status', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    act(() => {
      result.current.addPatient({
        firstName: 'Bob',
        lastName: 'Smith',
        initials: 'BS',
        room: '202B',
        age: 50,
        gender: 'Male',
        status: 'critical',
        phone: '(555) 999-8888',
        email: 'bob@email.com',
        diagnosis: ['Pneumonia'],
        medications: ['Amoxicillin'],
        admissionDate: '2026-03-15',
      });
    });
    expect(result.current.state.patients[5].status).toBe('critical');
  });

  it('throws error when used outside AppProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useAppContext());
    }).toThrow('useAppContext must be used within an AppProvider');
    consoleError.mockRestore();
  });
});
