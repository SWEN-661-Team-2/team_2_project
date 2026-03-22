import { cn } from '../../src/app/components/utils';

describe('cn utility function', () => {
  it('returns a single class name unchanged', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('merges multiple class names', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional classes - false', () => {
    expect(cn('base-class', false && 'hidden-class')).toBe('base-class');
  });

  it('handles conditional classes - true', () => {
    expect(cn('base-class', true && 'visible-class')).toBe('base-class visible-class');
  });

  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles undefined values', () => {
    expect(cn('base', undefined)).toBe('base');
  });

  it('handles empty string input', () => {
    expect(cn('')).toBe('');
  });

  it('merges padding classes correctly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('handles multiple classes', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });
});
