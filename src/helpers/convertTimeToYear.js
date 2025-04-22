/**
 * Converts current time to a year format
 * For example: 2:30 PM -> 14:30 -> 1430
 * @param {Date} date - The current date object
 * @returns {number} - The time formatted as a year
 */
export function convertTimeToYear(date) {
	const hours = date.getHours();
	const minutes = date.getMinutes();

	// Format as HHMM to represent a year
	return parseInt(`${hours}${minutes.toString().padStart(2, '0')}`);
}
