import React from 'react';

export default function StorageBanner({ status, onDismiss }) {
  if (status === 'ok' || !status) return null;

  const messages = {
    'storage-unavailable':
      'Local persistence is disabled (private browsing or storage permissions). Your changes will reset on page reload.',
    'quota-exceeded':
      'Storage quota exceeded. Older changes were not saved to disk. Please free up browser space.',
    'repaired':
      'Some corrupted or legacy application records were safely normalized and repaired.'
  };

  const isCritical = status === 'storage-unavailable' || status === 'quota-exceeded';

  return (
    <aside 
      className={`storage-banner ${isCritical ? 'banner-alert' : 'banner-info'}`}
      role="alert" 
      aria-live="polite"
    >
      <div className="banner-text">
        <strong className="banner-label">{isCritical ? 'Notice:' : 'Repaired:'}</strong>{' '}
        {messages[status] || 'Storage status notification.'}
      </div>
      <button 
        type="button" 
        className="banner-close-btn" 
        onClick={onDismiss} 
        aria-label="Dismiss storage notice"
      >
        &times;
      </button>
    </aside>
  );
}