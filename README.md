# timezone-now

A lightweight NPM package to get the current time in any timezone using the robust Luxon library.

## Installation

```bash
npm install timezone-now
```

For global CLI installation:
```bash
npm install -g timezone-now
```

## Usage

### Basic Usage
```javascript
const { timezoneNow } = require('timezone-now');

// Get current time in New York
console.log(timezoneNow('America/New_York')); // Example output: Dec 15, 2023, 8:30 PM

// Get current time in London
console.log(timezoneNow('Europe/London')); // Example output: Dec 16, 2023, 1:30 AM
```

### Custom Formatting
```javascript
// Use predefined Luxon formats
console.log(timezoneNow('America/New_York', { format: 'DATE_FULL' })); 
// Output: December 15, 2023

console.log(timezoneNow('Europe/London', { format: 'TIME_SIMPLE' })); 
// Output: 1:30 PM

// Use custom format string
console.log(timezoneNow('Asia/Tokyo', { format: 'yyyy-MM-dd HH:mm:ss' })); 
// Output: 2023-12-16 10:30:45
```

### Fallback Timezone
```javascript
// Specify a fallback timezone for invalid inputs
console.log(timezoneNow(null, { fallbackTimezone: 'UTC' })); 
// Uses UTC as fallback

// Invalid timezone will fall back to UTC by default
console.log(timezoneNow('Invalid/Timezone')); 
```

### Time Difference Calculation
```javascript
const { getTimeDifference } = require('timezone-now');

const diff = getTimeDifference('America/New_York', 'Asia/Tokyo');
console.log(diff);
// Output: {
//   hours: 14,
//   minutes: 0,
//   formatted: '+14:00',
//   raw: 840
// }
```

## CLI Usage

After global installation, you can use the package from the command line:

```bash
# Get current time in a timezone
timezone-now America/New_York

# Get time with custom format
timezone-now America/New_York TIME_SIMPLE

# Calculate time difference between two zones
timezone-now diff America/New_York Asia/Tokyo
```

## Features

- 🌎 Supports all IANA timezone identifiers
- 🚀 Lightweight and easy to use
- ⚡️ Built on top of the reliable Luxon library
- 🛡️ Includes error handling for invalid timezones
- 📝 Customizable output formats
- 🔄 Fallback timezone support
- 💻 CLI support
- ⏱️ Time difference calculation

## Error Handling

The package handles various error cases:
- When no timezone is provided (falls back to UTC)
- When an invalid timezone is provided (falls back to specified fallback timezone)
- When invalid format is provided

```javascript
// Will use fallback timezone (UTC)
timezoneNow();

// Will throw an error if fallback also fails
timezoneNow('Invalid/Timezone', { fallbackTimezone: 'Also/Invalid' });
```

## Common Timezone Examples

- `America/New_York` - New York
- `America/Los_Angeles` - Los Angeles
- `Europe/London` - London
- `Europe/Paris` - Paris
- `Asia/Tokyo` - Tokyo
- `Asia/Dubai` - Dubai
- `Australia/Sydney` - Sydney
- `Pacific/Auckland` - Auckland

## License

MIT

## Contributing

Contributions, issues, and feature requests are welcome!