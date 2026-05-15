import '@testing-library/jest-dom';
import { server } from '../mocks/server';

// Start server before all tests
beforeAll(() => server.listen());

// Reset all handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
