const { execSync } = require('child_process');
const path = require('path');

const CLI_PATH = path.resolve(__dirname, '../bin/cli.js');

describe('CLI', () => {
  const runCLI = (args) => {
    try {
      const result = execSync(`node "${CLI_PATH}" ${args}`, {
        encoding: 'utf8',
        env: { 
          ...process.env, 
          TZ: 'UTC',
          NODE_PATH: path.resolve(__dirname, '..'),
          TEST_MODE: 'true'
        },
        cwd: path.resolve(__dirname, '..')
      });
      return result.trim();
    } catch (error) {
      return error;
    }
  };

  test('shows help text when no arguments provided', () => {
    const output = runCLI('--help');
    expect(output).toContain('timezone-now - Get current time in any timezone');
    expect(output).toContain('Usage:');
    expect(output).toContain('Examples:');
  });

  test('shows current time for valid timezone', () => {
    const output = runCLI('America/New_York');
    expect(output).toBe('Dec 25, 2023, 7:00 AM');
  });

  test('shows time with custom format', () => {
    const output = runCLI('America/New_York TIME_SIMPLE');
    expect(output).toBe('7:00 AM');
  });

  test('shows time difference between two timezones', () => {
    const output = runCLI('diff America/New_York Asia/Tokyo');
    expect(output).toContain('Time difference between America/New_York and Asia/Tokyo: +14:00');
    expect(output).toContain('(14 hours)');
  });

  test('shows error when missing timezone arguments for diff', () => {
    const result = runCLI('diff');
    expect(result.stderr?.toString() || '').toContain('Error: Please provide two timezones for difference calculation');
  });
}); 