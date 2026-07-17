import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const THEMES = ['dark', 'light', 'neutral'] as const;
const AI_CONFIG_TEMPLATE = `description: |
  You are working with @ui-construction-library — a React 19 UI component library.
  Import components from '@ui-construction-library/core' and theme CSS from '@ui-construction-library/themes'.

  ## Imports
  - Components: \`import { Button, Card, Dialog } from '@ui-construction-library/core'\`
  - Theme CSS: \`import '@ui-construction-library/themes/theme-{theme}.css'\`
  - Styles: \`import '@ui-construction-library/styles/styles.css'\`
  - Individual components: \`import { Button } from '@ui-construction-library/core/Button'\`

  ## Theming
  - Set \`data-theme="dark|light|neutral"\` on the root <html> element.
  - Use \`--ucl-*\` CSS custom properties for colors, spacing, typography.
  - All CSS variables are scoped under the \`[data-theme="..."]\` selector.

  ## Component Patterns
  - Every component accepts: className, variant (solid|outline|ghost), size (sm|md|lg), tone (primary|secondary|success|warning|error|info).
  - Use \`aria-label\` for icon-only buttons.
  - All interactive elements are keyboard-accessible and focusable.
`;

type InitOptions = {
  theme: string;
};

function parseArgs(args: string[]): InitOptions {
  const themeIndex = args.indexOf('--theme');
  const theme =
    themeIndex !== -1 && args[themeIndex + 1] ? args[themeIndex + 1] : 'dark';

  if (!THEMES.includes(theme as (typeof THEMES)[number])) {
    console.error(
      `Invalid theme: "${theme}". Available themes: ${THEMES.join(', ')}`
    );
    process.exit(1);
  }

  return { theme };
}

export async function initCommand(args: string[]): Promise<void> {
  const options = parseArgs(args);

  // Try to detect project root (where package.json is)
  const cwd = process.cwd();
  const hasPackageJson = existsSync(resolve(cwd, 'package.json'));

  if (!hasPackageJson) {
    console.warn(
      '⚠ No package.json found in current directory. Creating files anyway...'
    );
  }

  // Determine config directory based on what exists
  const cursorDir = resolve(cwd, '.cursor', 'rules');
  const opencodeDir = resolve(cwd, '.opencode');

  let targetDir: string | null = null;
  let targetFile: string;

  if (existsSync(opencodeDir)) {
    targetDir = opencodeDir;
    targetFile = resolve(targetDir, 'ucl-agent-guide.md');
  } else if (existsSync(resolve(cwd, '.cursor'))) {
    targetDir = cursorDir;
    targetFile = resolve(targetDir, 'ucl-agent.mdc');
  } else {
    // Default to .cursor/rules/
    targetDir = cursorDir;
    targetFile = resolve(targetDir, 'ucl-agent.mdc');
  }

  // Create directory if it doesn't exist
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
    console.log(`✓ Created ${targetDir}`);
  }

  // Write agent config
  const content = AI_CONFIG_TEMPLATE.replace('{theme}', options.theme);
  writeFileSync(targetFile, content, 'utf-8');
  console.log(`✓ Created ${targetFile}`);

  // Write a minimal .cursorrules file too (for older Cursor versions)
  const cursorRulesFile = resolve(cwd, '.cursorrules');
  if (!existsSync(cursorRulesFile)) {
    writeFileSync(
      cursorRulesFile,
      `You are working with @ui-construction-library (theme: ${options.theme}).\nImport components from '@ui-construction-library/core' and theme CSS from '@ui-construction-library/themes/theme-${options.theme}.css'.\n`,
      'utf-8'
    );
    console.log(`✓ Created ${cursorRulesFile}`);
  }

  console.log(`\nUI-Library agent config ready (theme: ${options.theme}).`);
  console.log(
    'AI coding assistants will now understand your UI component setup.'
  );
}
