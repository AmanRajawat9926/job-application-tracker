// src/utils/helpers.js

export const ROUNDS = ['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'];

export function validateApplication(data) {
  const errors = {};
  const today = new Date().toISOString().split('T')[0];

  if (!data.company || !data.company.trim()) {
    errors.company = 'Company name is required.';
  }

  if (!data.role || !data.role.trim()) {
    errors.role = 'Role is required.';
  }

  if (!data.appliedDate) {
    errors.appliedDate = 'Applied date is required.';
  } else if (data.appliedDate > today) {
    errors.appliedDate = 'Applied date cannot be in the future.';
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
  const targetDate = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today - targetDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;

  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
}

export function formatExactDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}