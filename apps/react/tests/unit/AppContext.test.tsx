import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AppProvider, useAppContext } from '../../src/app/context/AppContext';
import type { SettingsData } from '../../src/app/context/AppContext';
import React from 'react';

describe('AppContext', () => {
  // Mock localStorage
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  );

  it('initializes with default values', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.state.isLoggedIn).toBe(false);
    expect(result.current.state.sidebarPosition).toBe('left');
    expect(result.current.state.settings.userName).toBe('Sarah Johnson, RN');
  });

  it('updates login state and persists to localStorage', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.login();
    });

    expect(result.current.state.isLoggedIn).toBe(true);
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
  });

  it('updates all settings and persists them', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    
    const newSettings: SettingsData = {
      ...result.current.state.settings,
      theme: 'dark',
      leftHandedMode: true,
    };

    act(() => {
      result.current.updateAllSettings(newSettings);
    });

    expect(result.current.state.settings.theme).toBe('dark');
    expect(result.current.state.sidebarPosition).toBe('right'); // Logic check: leftHandedMode = right sidebar
    expect(localStorage.getItem('userSettings')).toContain('"theme":"dark"');
  });

  it('allows manual sidebar override regardless of settings', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.setSidebarPosition('right');
    });

    expect(result.current.state.sidebarPosition).toBe('right');
  });

  it('throws error when used outside of Provider', () => {
    // Suppress console.error for this test to keep the output clean
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useAppContext())).toThrow('useAppContext must be used within AppProvider');
    
    consoleSpy.mockRestore();
  });
});