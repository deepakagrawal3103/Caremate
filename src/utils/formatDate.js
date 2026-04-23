/**
 * Format date to readable string
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - Format type: 'full', 'date', 'time', 'datetime'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = "full") => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";

  const options = {
    full: { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" },
    date: { year: "numeric", month: "long", day: "numeric" },
    time: { hour: "2-digit", minute: "2-digit" },
    datetime: { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
  };

  return d.toLocaleDateString("en-IN", options[format] || options.full);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string} date 
 * @returns {string}
 */
export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

/**
 * Format time for display (HH:MM AM/PM)
 * @param {string} time24 - Time in 24hr format (e.g., "14:30")
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
export const formatTime12hr = (time24) => {
  const [hour, minute] = time24.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
};