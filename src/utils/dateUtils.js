// Converts a date into a relative time format
export function getRelativeTime(dateString) {
  // Convert the given date string into a Date object.
  // T00:00:00 sets the time to midnight.
  const targetDate = new Date(dateString + 'T00:00:00');

  // Get today's date.
  const today = new Date();

  // Reset the time to midnight so we only compare dates, not hours/minutes.
  today.setHours(0, 0, 0, 0);

  // Calculate the difference between today's date and the target date.
  // The result is in milliseconds.
  const diffTime = today - targetDate;

  // Convert the difference from milliseconds into days.
  const diffDays = Math.floor(
    diffTime / (1000 * 60 * 60 * 24)
  );

  // If the application was added today
  if (diffDays === 0) return 'Today';

  // If the application was added yesterday
  if (diffDays === 1) return 'Yesterday';

  // If the application is less than 30 days old,
  // display the number of days.
  if (diffDays < 30) return `${diffDays} days ago`;

  // Convert days into approximate months.
  const diffMonths = Math.floor(diffDays / 30);

  // Handle the singular "month".
  if (diffMonths === 1) return '1 month ago';

  // If the application is less than 12 months old,
  // display the number of months.
  if (diffMonths < 12) return `${diffMonths} months ago`;

  // Convert days into approximate years.
  const diffYears = Math.floor(diffDays / 365);

  // Handle singular and plural "year".
  return diffYears === 1
    ? '1 year ago'
    : `${diffYears} years ago`;
}


// Converts a date into an exact readable date format.
// Example: "Mon, Sep 07, 2026"
export function formatExactDate(dateString) {
  // Convert the date string into a Date object.
  const date = new Date(dateString + 'T00:00:00');

  // Format the date according to the user's browser locale.
  return date.toLocaleDateString(undefined, {

    weekday: 'short',

    year: 'numeric',

    month: 'short',

    day: 'numeric'
  });
}
