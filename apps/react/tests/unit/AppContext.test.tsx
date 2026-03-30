/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppProvider, useAppContext } from '../../src/app/context/AppContext';
import type { SettingsData } from '../../src/app/context/AppContext';
import React from 'react';

// Unit tests for the AppContext provider.
// Covers: default state, login/logout persistence, settings updates,
// sidebar position logic, and the out-of-provider error guard.
describe('AppContext', () => {

  beforeEach(() => {
  // Manually stub localStorage because jsdom's implementation is not correctly
  // initialized in this Vitest environment (--localstorage-file warning).
  // This gives AppContext a fully functional storage API to read and write against.
  // A fresh store object per test prevents bleed-through between test cases.
  const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem:    (key: string) => store[key] ?? null,
      setItem:    (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear:      () => { Object.keys(store).forEach(key => delete store[key]); },
    });
    vi.clearAllMocks();
  });

  // Wrapper supplies the AppProvider so renderHook has context access
  const wrapper = ({ children }: { readonly children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  );

  // Fresh provider with no localStorage data should use DEFAULT_SETTINGS values
  it('initializes with default values', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.state.isLoggedIn).toBe(false);
    expect(result.current.state.sidebarPosition).toBe('left');
    expect(result.current.state.settings.userName).toBe('Sarah Johnson, RN');
  });

  // login() should set isLoggedIn to true and write 'true' to localStorage
  it('updates login state and persists to localStorage', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.login();
    });

    expect(result.current.state.isLoggedIn).toBe(true);
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
  });

  // updateAllSettings() should apply new values, persist them to localStorage,
  // and derive sidebarPosition from leftHandedMode (true → 'right')
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
    // leftHandedMode: true → sidebar moves to right
    expect(result.current.state.sidebarPosition).toBe('right');
    expect(localStorage.getItem('userSettings')).toContain('"theme":"dark"');
  });

  // setSidebarPosition() should override the derived position regardless of settings
  it('allows manual sidebar override regardless of settings', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.setSidebarPosition('right');
    });

    expect(result.current.state.sidebarPosition).toBe('right');
  });

  // useAppContext called outside AppProvider should throw a descriptive error.
  // console.error is suppressed to keep the test output clean.
  it('throws error when used outside of Provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAppContext())).toThrow(
      'useAppContext must be used within AppProvider'
    );

    consoleSpy.mockRestore();
  });
});
