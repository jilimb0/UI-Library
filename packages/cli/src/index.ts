#!/usr/bin/env node

import { printHelp, runCommand } from './commands/index.js';

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  printHelp();
  process.exit(0);
}

if (args[0] === '--version' || args[0] === '-v') {
  console.log('@ui-construction-library/cli v0.1.0');
  process.exit(0);
}

const [command, ...rest] = args;
await runCommand(command, rest);
