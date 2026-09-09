export const CANONICAL_STORAGE_KEY = 'job_tracker_canonical_v3';
const LEGACY_KEYS = [
  'job_tracker_applications_v1',
  'job_tracker_applications',
  'applications',
  'job_applications'
];


export function loadAndMigrateApplications() {
  const mergedPool = [];
  const seenIds = new Set();
  const seenSignatures = new Set();

  function processRecord(rawItem) {
    if (!rawItem || typeof rawItem !== 'object') return null;

    // Normalization & fallback for corrupted persisted records
    const company = (rawItem.company || 'Unknown Company').trim();
    const role = (rawItem.role || 'Unknown Role').trim();
    const round = ['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'].includes(rawItem.round)
      ? rawItem.round
      : 'Applied';
    
    let appliedDate = rawItem.appliedDate;
    if (!appliedDate || isNaN(new Date(appliedDate + 'T00:00:00').getTime())) {
      appliedDate = new Date().toISOString().split('T')[0];
    }

    const jobLink = (rawItem.jobLink || '').trim();
    const signature = `${company.toLowerCase()}|${role.toLowerCase()}|${appliedDate}`;

    // Prefer existing valid UUID, or generate a fresh stable one
    const id = rawItem.id && typeof rawItem.id === 'string' && rawItem.id.length > 5
      ? rawItem.id
      : crypto.randomUUID();

    if (seenIds.has(id) || seenSignatures.has(signature)) {
      return null;
    }

    seenIds.add(id);
    seenSignatures.add(signature);

    return { id, company, role, round, appliedDate, jobLink };
  }

  // 1. Read canonical first
  try {
    const canonicalRaw = localStorage.getItem(CANONICAL_STORAGE_KEY);
    if (canonicalRaw) {
      const parsed = JSON.parse(canonicalRaw);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          const valid = processRecord(item);
          if (valid) mergedPool.push(valid);
        });
      }
    }
  } catch (err) {
    console.error('Error parsing canonical storage:', err);
  }

  // 2. Read legacy keys and migrate
  LEGACY_KEYS.forEach((oldKey) => {
    try {
      const oldRaw = localStorage.getItem(oldKey);
      if (oldRaw) {
        const parsed = JSON.parse(oldRaw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            const valid = processRecord(item);
            if (valid) mergedPool.push(valid);
          });
        }
      }
    } catch (err) {
      console.warn(`Skipping malformed legacy key: ${oldKey}`, err);
    }
  });

  // Save the deduplicated list into the canonical key
  try {
    localStorage.setItem(CANONICAL_STORAGE_KEY, JSON.stringify(mergedPool));
  } catch (err) {
    console.error('Failed to write migrated storage', err);
  }

  return mergedPool;
}