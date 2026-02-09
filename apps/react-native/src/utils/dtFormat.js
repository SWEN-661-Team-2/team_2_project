/**
 * Date Formatting Utilities
 * Equivalent to Flutter's dt_format utility
 */

/**
 * Format date as YYYY-MM-DD HH:MM
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export function formatDtYmdHmm(date) {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Format date as MMM DD, YYYY HH:MM
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export function formatDtMmmDdYyyyHmm(date) {
  if (!date) return '';

  const options = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return date.toLocaleString('en-US', options);
}
