import { componentCommand } from './component.js';
import { docsCommand } from './docs.js';
import { initCommand } from './init.js';
import { themeCommand } from './theme.js';

export function printHelp(): void {
  console.log(`
╔══════════════════════════════════════════╗
║  @ui-construction-library/cli  v0.1.0   ║
╚══════════════════════════════════════════╝

Usage: npx ucl <command> [options]

Commands:
  init                    Create AI agent config file for this project
  component [name]        Show component reference (list all if no name)
  docs                    List documentation topics
  theme --list            List available themes
  theme <name>            Copy theme CSS to current directory

Options:
  --help, -h              Show this help
  --version, -v           Show version
`);
}

const COMMANDS = ['init', 'component', 'docs', 'theme'] as const;
type Command = (typeof COMMANDS)[number];

export async function runCommand(
  command: string,
  args: string[]
): Promise<void> {
  if (!COMMANDS.includes(command as Command)) {
    console.error(`Unknown command: ${command}`);
    console.error(`Run 'npx ucl --help' for available commands.`);
    process.exit(1);
  }

  switch (command) {
    case 'init':
      await initCommand(args);
      break;
    case 'component':
      await componentCommand(args);
      break;
    case 'docs':
      await docsCommand(args);
      break;
    case 'theme':
      await themeCommand(args);
      break;
  }
}
