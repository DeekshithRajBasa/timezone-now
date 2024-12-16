// Mock the luxon module for CLI execution
const mockLuxon = require('./mocks/luxon');
jest.mock('luxon', () => mockLuxon);

// Ensure the mock is used when requiring luxon
require.cache[require.resolve('luxon')] = {
  exports: mockLuxon
}; 