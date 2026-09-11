import { isValidCalendarDate, getTodayString } from './helpers';

export const PRIMARY_KEY = 'job_tracker_canonical_v3';
export const LEGACY_KEYS = [
  'job_tracker_applications_v1',
  'job_tracker_applications',
  'applications'
];


export function isStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}


function sanitizeRecord(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const company = typeof raw.company === 'string' ? raw.company.trim() : '';
  const role = typeof raw.role === 'string' ? raw.role.trim() : '';
  if (!company || !role) return null;

  const round = ['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'].includes(raw.round)
    ? raw.round
    : 'Applied';

  let appliedDate = raw.appliedDate;
  if (!isValidCalendarDate(appliedDate)) {
    appliedDate = getTodayString();
  }

  let jobLink = '';
  if (typeof raw.jobLink === 'string' && raw.jobLink.trim()) {
    try {
      const parsed = new URL(raw.jobLink.trim());
      if (['http:', 'https:'].includes(parsed.protocol)) {
        jobLink = raw.jobLink.trim();
      }
    } catch {
      jobLink = '';
    }
  }

  const id = raw.id && typeof raw.id === 'string' && raw.id.length >= 8
    ? raw.id
    : crypto.randomUUID();

  return { id, company, role, round, appliedDate, jobLink };
}


export function loadApplicationsSafely() {
  if (!isStorageAvailable()) {
    return { records: [], status: 'storage-unavailable' };
  }

  const pool = [];
  const seenIds = new Set();
  let corruptedFound = false;

  try {
    const primaryRaw = window.localStorage.getItem(PRIMARY_KEY);
    if (primaryRaw) {
      const parsed = JSON.parse(primaryRaw);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          const sanitized = sanitizeRecord(item);
          if (sanitized && !seenIds.has(sanitized.id)) {
            seenIds.add(sanitized.id);
            pool.push(sanitized);
          } else if (!sanitized) {
            corruptedFound = true;
          }
        });
      } else {
        corruptedFound = true;
      }
    }
  } catch (err) {
    console.error('Primary storage corrupted JSON:', err);
    corruptedFound = true;
  }

  if (pool.length === 0) {
    LEGACY_KEYS.forEach((legacyKey) => {
      try {
        const raw = window.localStorage.getItem(legacyKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              const sanitized = sanitizeRecord(item);
              if (sanitized && !seenIds.has(sanitized.id)) {
                seenIds.add(sanitized.id);
                pool.push(sanitized);
              }
            });
          }
        }
      } catch {
        corruptedFound = true;
      }
    });
  }

  LEGACY_KEYS.forEach((legacyKey) => {
    try {
      window.localStorage.removeItem(legacyKey);
    } catch {
      // Ignore
    }
  });

  try {
    window.localStorage.setItem(PRIMARY_KEY, JSON.stringify(pool));
  } catch (err) {
    return { records: pool, status: 'quota-exceeded' };
  }

  return {
    records: pool,
    status: corruptedFound ? 'repaired' : 'ok'
  };
}


export function saveApplicationsSafely(records) {
  if (!isStorageAvailable()) {
    return 'storage-unavailable';
  }

  try {
    window.localStorage.setItem(PRIMARY_KEY, JSON.stringify(records));
    return 'ok';
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
    return 'quota-exceeded';
  }
}