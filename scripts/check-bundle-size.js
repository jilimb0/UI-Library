#!/usr/bin/env node

const { exec } = require('node:child_process');

console.log('Checking bundle size...');

exec('npx size-limit', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error checking bundle size: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Size check stderr: ${stderr}`);
    return;
  }
  console.log(`Size check stdout: ${stdout}`);
});
