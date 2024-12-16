module.exports = {
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