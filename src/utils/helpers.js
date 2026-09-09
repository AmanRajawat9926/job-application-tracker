export const ROUNDS = ['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'];
export const STALE_ROUNDS = ['Applied', 'Screen'];
export const STALE_THRESHOLD_DAYS = 14;


export function isValidAppliedDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  const date = new Date(year, month, day);
  // Ensure JavaScript date constructor did not roll over invalid days (e.g., Feb 31)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return false;
  }

  // Ensure it is not in the future relative to local midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
}

/**
 * Calculates raw calendar days elapsed since application date.
 * Returns null if the date is invalid.
 */
export function getDaysSinceApplied(dateString) {
  if (!dateString) return null;
  const targetDate = new Date(dateString + 'T00:00:00');
  if (isNaN(targetDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Stale logic: true ONLY when round is 'Applied' or 'Screen' AND days > 14
 */
export function isApplicationStale(round, appliedDate) {
  if (!STALE_ROUNDS.includes(round)) return false;
  const days = getDaysSinceApplied(appliedDate);
  return days !== null && days > STALE_THRESHOLD_DAYS;
}

export function validateApplication(data) {
  const errors = {};

  if (!data.company || !data.company.trim()) {
    errors.company = 'Company name is required.';
  }

  if (!data.role || !data.role.trim()) {
    errors.role = 'Role is required.';
  }

  if (!data.appliedDate || !data.appliedDate.trim()) {
    errors.appliedDate = 'Applied date is required.';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parsed = new Date(data.appliedDate + 'T00:00:00');

    if (isNaN(parsed.getTime())) {
      errors.appliedDate = 'Please select a valid calendar date.';
    } else if (parsed > today) {
      errors.appliedDate = 'Applied date cannot be in the future.';
    }
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

export function getRelativeTime(dateString) {
  const days = getDaysSinceApplied(dateString);
  if (days === null) return 'Date unknown';
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
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}