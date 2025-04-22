/**
 * Formats time in a human-readable format
 * @param {Date} date - The date object
 * @returns {string} - Formatted time string (e.g., "2:30 PM")
 */
export function formatTimeToHumanReadable(date) {
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";

	hours = hours % 12;
	hours = hours ? hours : 12; // the hour "0" should be "12"
	const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

	return `${hours}:${minutesStr} ${ampm}`;
}
