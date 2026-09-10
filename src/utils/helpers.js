// src/utils/helpers.js

export const ROUNDS = ['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'];
export const STALE_ROUNDS = ['Applied', 'Screen'];
export const STALE_THRESHOLD_DAYS = 14;

/**
 * Strict calendar validation:
 * Verifies format, component matches (no silent rollover), and <= today.
 */
export function validateCalendarDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return { valid: false, message: 'Applied date is required.' };
  }

  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return { valid: false, message: 'Please enter a valid date in YYYY-MM-DD format.' };
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  if (year < 1990 || year > 2099) {
    return { valid: false, message: 'Year is out of supported range.' };
  }

  const dateObj = new Date(year, month, day);

  // Checks for impossible dates (e.g. Feb 30 or rolling April 31)
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month ||
    dateObj.getDate() !== day
  ) {
    return { valid: false, message: 'This calendar date does not exist.' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj.getTime() > today.getTime()) {
    return { valid: false, message: 'Applied date cannot be in the future.' };
  }

  return { valid: true };
}

export function validateApplication(data) {
  const errors = {};

  if (!data.company || !data.company.trim()) {
    errors.company = 'Company name is required.';
  }

  if (!data.role || !data.role.trim()) {
    errors.role = 'Role is required.';
  }

  const dateValidation = validateCalendarDate(data.appliedDate);
  if (!dateValidation.valid) {
    errors.appliedDate = dateValidation.message;
  }

  if (!data.jobLink || !data.jobLink.trim()) {
    errors.jobLink = 'Job link is required.';
  } else {
    try {
      const parsedUrl = new URL(data.jobLink.trim());
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        errors.jobLink = 'Link must start with http:// or https://';
      }
    } catch {
      errors.jobLink = 'Please enter a valid URL (e.g., https://example.com).';
    }
  }

  return errors;
}

export function getDaysSinceApplied(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString + 'T00:00:00');
  if (isNaN(target.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function isApplicationStale(round, appliedDate) {
  if (!STALE_ROUNDS.includes(round)) return false;
  const days = getDaysSinceApplied(appliedDate);
  return days !== null && days > STALE_THRESHOLD_DAYS;
}

export function getRelativeTime(dateString) {
  const days = getDaysSinceApplied(dateString);
  if (days === null) return 'Unknown date';
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

export function formatExactDate(dateString) {
  if (!dateString) return 'No date provided';
  const target = new Date(dateString + 'T00:00:00');
  if (isNaN(target.getTime())) return 'Invalid date';

  return target.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}