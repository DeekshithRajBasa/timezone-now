const { timezoneNow, getTimeDifference } = require('../index');

// Mock DateTime from luxon
jest.mock('luxon', () => ({
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
}));

describe('timezoneNow', () => {
  test('returns correct time for valid timezone', () => {
    const result = timezoneNow('America/New_York');
    expect(result).toBe('Dec 25, 2023, 7:00 AM');
  });

  test('handles custom format', () => {
    const result = timezoneNow('America/New_York', { format: 'yyyy-MM-dd HH:mm' });
    expect(result).toBe('2023-12-25 07:00');
  });

  test('handles predefined Luxon format', () => {
    const result = timezoneNow('America/New_York', { format: 'TIME_SIMPLE' });
    expect(result).toBe('7:00 AM');
  });

  test('uses fallback timezone when primary is invalid', () => {
    const result = timezoneNow('Invalid/Timezone', { fallbackTimezone: 'UTC' });
    expect(result).toBe('Dec 25, 2023, 12:00 PM');
  });

  test('throws error when both primary and fallback timezones are invalid', () => {
    expect(() => {
      timezoneNow('Invalid/Timezone', { fallbackTimezone: 'Also/Invalid' });
    }).toThrow('Invalid timezone provided and fallback failed');
  });

  test('uses UTC when no timezone is provided', () => {
    const result = timezoneNow();
    expect(result).toBe('Dec 25, 2023, 12:00 PM');
  });
});

describe('getTimeDifference', () => {
  test('calculates correct time difference between timezones', () => {
    const result = getTimeDifference('America/New_York', 'Asia/Tokyo');
    expect(result).toEqual({
      hours: 14,
      minutes: 0,
      formatted: '+14:00',
      raw: 840
    });
  });

  test('handles negative time differences', () => {
    const result = getTimeDifference('Asia/Tokyo', 'America/New_York');
    expect(result).toEqual({
      hours: 14,
      minutes: 0,
      formatted: '-14:00',
      raw: -840
    });
  });

  test('handles time differences with minutes', () => {
    const result = getTimeDifference('America/New_York', 'Asia/Kolkata');
    expect(result).toEqual({
      hours: 10,
      minutes: 30,
      formatted: '+10:30',
      raw: 630
    });
  });

  test('throws error for invalid timezones', () => {
    expect(() => {
      getTimeDifference('Invalid/Timezone', 'Asia/Tokyo');
    }).toThrow('Invalid timezone(s) provided');
  });
}); 