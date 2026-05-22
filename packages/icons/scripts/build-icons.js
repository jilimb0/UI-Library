#!/usr/bin/env node
/**
 * Validates owned icon modules exist. Extend to codegen from SVG assets when the set grows.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '../src/icons');
const required = [
  'ArrowLeftIcon.tsx',
  'ArrowRightIcon.tsx',
  'BellIcon.tsx',
  'CheckIcon.tsx',
  'ChevronDownIcon.tsx',
  'ChevronUpIcon.tsx',
  'CloseIcon.tsx',
  'HeartIcon.tsx',
  'HomeIcon.tsx',
  'MailIcon.tsx',
  'SearchIcon.tsx',
  'SettingsIcon.tsx',
  'StarIcon.tsx',
  'UserIcon.tsx',
  'UsersIcon.tsx',
];

for (const file of required) {
  const full = path.join(iconsDir, file);
  if (!fs.existsSync(full)) {
    console.error(`Missing icon module: ${file}`);
    process.exit(1);
  }
}

console.log(`Icon build check passed (${required.length} modules).`);
