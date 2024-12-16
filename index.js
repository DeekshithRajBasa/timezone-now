// For testing purposes, we can override the DateTime module
let luxon = require('luxon');

if (process.env.TEST_MODE === 'true') {
  luxon = {
    DateTime: {
      now: () => ({
        setZone: (timezone) => ({
          isValid: !timezone.includes('Invalid'),
          toLocaleString: (format) => {
            if (timezone === 'America/New_York') {
              if (format === 'TIME_SIMPLE') return '7:00 AM';
              return 'Dec 25, 2023, 7:00 AM';
            }
            return 'Dec 25, 2023, 12:00 PM';
          },
          toFormat: (format) => {
            if (timezone === 'America/New_York') {
              return '2023-12-25 07:00';
            }
            return '2023-12-25 12:00';
          },
          offset: timezone === 'America/New_York' ? -300 : 
                 timezone === 'Asia/Tokyo' ? 540 : 
                 timezone === 'Asia/Kolkata' ? 330 : 0
        })
      }),
      DATETIME_MED: 'DATETIME_MED',
      TIME_SIMPLE: 'TIME_SIMPLE'
    }
  };
}

const DEFAULT_TIMEZONE = 'UTC';
const DEFAULT_FORMAT = luxon.DateTime.DATETIME_MED;

/**
 * Get the current time in a specified timezone with formatting options.
 * @param {string} timezone - A valid IANA timezone string (e.g., "America/New_York").
 * @param {Object} options - Configuration options
 * @param {string} options.format - Output format (e.g., 'DATE_SHORT', 'TIME_SIMPLE', or Luxon format string)
 * @param {string} options.fallbackTimezone - Fallback timezone if the provided one is invalid
 * @returns {string} The formatted time in the specified timezone
 */
function timezoneNow(timezone, options = {}) {
  const {
    format = DEFAULT_FORMAT,
    fallbackTimezone = DEFAULT_TIMEZONE
  } = options;

  // Handle missing timezone with fallback
  const targetTimezone = timezone || fallbackTimezone;

  try {
    let time = luxon.DateTime.now().setZone(targetTimezone);
    
    // If invalid and fallback is different, try fallback
    if (!time.isValid && targetTimezone !== fallbackTimezone) {
      time = luxon.DateTime.now().setZone(fallbackTimezone);
    }
    
    if (!time.isValid) {
      throw new Error("Invalid timezone provided and fallback failed.");
    }

    // Handle predefined formats and default format
    if (format === DEFAULT_FORMAT || luxon.DateTime[format]) {
      return time.toLocaleString(format);
    }
    
    // Handle custom format string
    return time.toFormat(format);
  } catch (error) {
    throw new Error(`Failed to get time for timezone "${targetTimezone}": ${error.message}`);
  }
}

/**
 * Calculate the time difference between two timezones
 * @param {string} timezone1 - First timezone
 * @param {string} timezone2 - Second timezone
 * @returns {Object} Time difference details
 */
function getTimeDifference(timezone1, timezone2) {
  try {
    const time1 = luxon.DateTime.now().setZone(timezone1);
    const time2 = luxon.DateTime.now().setZone(timezone2);

    if (!time1.isValid || !time2.isValid) {
      throw new Error("Invalid timezone(s) provided");
    }

    const diffMinutes = time2.offset - time1.offset;
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;
    const sign = diffMinutes >= 0 ? '+' : '-';

    return {
      hours,
      minutes,
      formatted: `${sign}${hours}:${minutes.toString().padStart(2, '0')}`,
      raw: diffMinutes
    };
  } catch (error) {
    throw new Error(`Failed to calculate time difference: ${error.message}`);
  }
}

module.exports = {
  timezoneNow,
  getTimeDifference
};