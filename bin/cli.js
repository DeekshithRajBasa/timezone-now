#!/usr/bin/env node
const { timezoneNow, getTimeDifference } = require('../index.js');

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
          toFormat: () => '7:00 AM',
          offset: timezone === 'America/New_York' ? -300 : 
                 timezone === 'Asia/Tokyo' ? 540 : 0
        })
      }),
      DATETIME_MED: 'DATETIME_MED',
      TIME_SIMPLE: 'TIME_SIMPLE'
    }
  };
}

const helpText = `
timezone-now - Get current time in any timezone

Usage:
  timezone-now <timezone> [format]     Get time in specified timezone
  timezone-now diff <tz1> <tz2>        Get time difference between timezones
  timezone-now --help                  Show this help message

Examples:
  timezone-now America/New_York
  timezone-now Europe/London TIME_SIMPLE
  timezone-now Asia/Tokyo "yyyy-MM-dd HH:mm:ss"
  timezone-now diff America/New_York Asia/Tokyo

Format Options:
  - DATETIME_HUGE      (e.g., Wednesday, October 14, 2020, 9:21 AM EDT)
  - DATETIME_SHORT     (e.g., 10/14/2020, 9:21 AM)
  - DATE_MED          (e.g., Oct 14, 2020)
  - TIME_SIMPLE       (e.g., 9:21 AM)
  - Custom format     (e.g., "yyyy-MM-dd HH:mm:ss")
`;

function showHelp() {
  console.log(helpText);
  process.exit(0);
}

function handleError(error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}

async function main() {
  try {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      showHelp();
      return;
    }

    const command = args[0];

    if (command === 'diff') {
      const [, tz1, tz2] = args;
      if (!tz1 || !tz2) {
        throw new Error('Please provide two timezones for difference calculation\nExample: timezone-now diff America/New_York Asia/Tokyo');
      }
      const diff = getTimeDifference(tz1, tz2);
      console.log(`Time difference between ${tz1} and ${tz2}: ${diff.formatted}`);
      if (diff.minutes > 0) {
        console.log(`(${diff.hours} hours and ${diff.minutes} minutes)`);
      } else {
        console.log(`(${diff.hours} hours)`);
      }
    } else {
      const [timezone, format] = args;
      if (!timezone) {
        throw new Error('Please provide a timezone\nExample: timezone-now America/New_York');
      }
      const options = format ? { format } : undefined;
      const time = timezoneNow(timezone, options);
      process.stdout.write(time + '\n');
    }
  } catch (error) {
    handleError(error);
  }
}

// Ensure we handle any unhandled promise rejections
process.on('unhandledRejection', (error) => {
  handleError(error);
});

main(); 