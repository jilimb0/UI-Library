#!/usr/bin/env node

const { exec } = require('node:child_process');

console.log('Updating dependencies...');

exec('npm update', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error updating dependencies: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Update stderr: ${stderr}`);
    return;
  }
  console.log(`Update stdout: ${stdout}`);
});
