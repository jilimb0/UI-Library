#!/usr/bin/env node

import { printHelp, runCommand } from './commands/index.js';
import { version } from './version.js';

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  printHelp();
  process.exit(0);
}

if (args[0] === '--version' || args[0] === '-v') {
  console.log(`@ui-construction-library/cli v${version}`);
  process.exit(0);
}

const [command, ...rest] = args;
await runCommand(command, rest);
