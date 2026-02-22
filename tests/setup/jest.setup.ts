import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { configureAxe } from 'jest-axe';

const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: true }
  }
});

(globalThis as typeof globalThis & { axe: typeof axe }).axe = axe;
