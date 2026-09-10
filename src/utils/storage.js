// src/utils/storage.js

export const CANONICAL_STORAGE_KEY = 'job_tracker_canonical_v4';
const MIGRATION_LOCK_KEY = 'job_tracker_migrated_lock';
const LEGACY_KEYS = [
  'job_tracker_applications_v1',
  'job_tracker_applications',
  'job_tracker_canonical_v3',
  'applications',
  'job_applications'
];

export function loadApplicationsWithOneTimeMigration() {
  // 1. If canonical data already exists, treat it as the single source of truth
  try {
    const canonicalRaw = localStorage.getItem(CANONICAL_STORAGE_KEY);
    if (canonicalRaw !== null) {
      const parsed = JSON.parse(canonicalRaw);
      if (Array.isArray(parsed)) {
        // Clean any leftover legacy keys so they never resurrect deleted records
        LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading canonical storage:', err);
  }

  // 2. Perform one-time migration if not yet locked
  const alreadyMigrated = localStorage.getItem(MIGRATION_LOCK_KEY);
  if (alreadyMigrated) {
    return [];
  }

  const merged = [];
  const seenIds = new Set();
  const seenSignatures = new Set();

  function sanitizeAndPush(item) {
    if (!item || typeof item !== 'object') return;
    const company = (item.company || '').trim();
    const role = (item.role || '').trim();
    const round = ['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'].includes(item.round)
      ? item.round
      : 'Applied';
    const appliedDate = item.appliedDate || new Date().toISOString().split('T')[0];
    const jobLink = (item.jobLink || '').trim();

    const signature = `${company.toLowerCase()}|${role.toLowerCase()}|${appliedDate}`;
    const id = item.id && typeof item.id === 'string' && item.id.length > 5
      ? item.id
      : crypto.randomUUID();

    if (!seenIds.has(id) && !seenSignatures.has(signature)) {
      seenIds.add(id);
      seenSignatures.add(signature);
      merged.push({ id, company, role, round, appliedDate, jobLink });
    }
  }

  LEGACY_KEYS.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(sanitizeAndPush);
        }
      }
    } catch {
      // Ignore corrupted legacy payloads
    }
  });

  // 3. Persist canonical state, set lock, and wipe legacy keys
  try {
    localStorage.setItem(CANONICAL_STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(MIGRATION_LOCK_KEY, 'true');
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch (err) {
    console.error('Failed to commit canonical storage migration:', err);
  }

  return merged;
}

export function saveApplications(applications) {
  try {
    localStorage.setItem(CANONICAL_STORAGE_KEY, JSON.stringify(applications));
  } catch (err) {
    console.error('Failed to save applications:', err);
  }
}