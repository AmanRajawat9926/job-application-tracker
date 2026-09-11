
export const ROUNDS = ['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'];
export const STALE_ROUNDS = ['Applied', 'Screen'];
export const STALE_THRESHOLD_DAYS = 14;

export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export function isValidCalendarDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  const parsed = new Date(year, month, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed <= today;
}

/**
 * Calculates calendar days elapsed between appliedDate and current local midnight.
 */
export function getDaysSinceApplied(dateString) {
  if (!isValidCalendarDate(dateString)) return null;

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
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

/**
 * Relative time formatter for your personal constraint
 */
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

/**
 * Exact date formatter for title hover
 */
export function formatExactDate(dateString) {
  if (!isValidCalendarDate(dateString)) return 'Invalid date';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Shared validation rules for Add and Edit flows
 */
export function validateApplication(data) {
  const errors = {};

  if (!data.company || !data.company.trim()) {
    errors.company = 'Company name is required.';
  }

  if (!data.role || !data.role.trim()) {
    errors.role = 'Role is required.';
  }

  if (!ROUNDS.includes(data.round)) {
    errors.round = 'Please choose a valid application round.';
  }

  if (!data.appliedDate || !data.appliedDate.trim()) {
    errors.appliedDate = 'Applied date is required.';
  } else if (!isValidCalendarDate(data.appliedDate)) {
    const [year, month, day] = (data.appliedDate || '').split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsed > today) {
      errors.appliedDate = 'Applied date cannot be in the future.';
    } else {
      errors.appliedDate = 'Enter a valid calendar date (YYYY-MM-DD).';
    }
  }

  if (!data.jobLink || !data.jobLink.trim()) {
    errors.jobLink = 'Job link is required.';
  } else {
    try {
      const parsedUrl = new URL(data.jobLink.trim());
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        errors.jobLink = 'URL protocol must be http:// or https://';
      }
    } catch {
      errors.jobLink = 'Please provide a valid URL (e.g., https://example.com/job).';
    }
  }

  return errors;
}