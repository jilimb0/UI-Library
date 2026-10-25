import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const THEMES = ['dark', 'light', 'neutral'] as const;
const AI_CONFIG_TEMPLATE = `description: |
  You are working with @ui-construction-library — a React UI component library.
  Import components from '@ui-construction-library/core' and theme CSS from '@ui-construction-library/themes'.

  ## Imports
  - Components: \`import { Button, Card, Dialog } from '@ui-construction-library/core'\`
  - Theme CSS: \`import '@ui-construction-library/themes/theme-{theme}.css'\`
  - Styles: \`import '@ui-construction-library/styles/styles.css'\`

  ## Theming (ThemeProvider)
  - Wrap the app in \`<ThemeProvider defaultTheme="{theme}">\`
  - Switch theme: \`const { setTheme } = useTheme(); setTheme('dark')\`
  - Custom brand theme:
    \`\`\`tsx
    <ThemeProvider themes={{ 'brand-x': { semantic: { 'color-primary': '#0066cc' }, component: { 'button-primary-default': '#0066cc' } } }}>
    \`\`\`
  - All CSS variables use the \`--ucl-\` prefix (e.g. \`--ucl-color-primary\`).
  - Tailwind v4 bridge: \`@import "@ui-construction-library/tokens/w3c/tailwind"\` enables \`bg-primary\`, \`text-muted-foreground\` etc.

  ## Component Patterns
  - Every component accepts: className, variant, size.
  - asChild prop: \`<Button asChild><a href="/page">Link</a></Button>\`
  - Slot-level classNames: \`<Input classNames={{ label: 'font-bold', input: 'border-2' }} />\`
  - All interactive elements are keyboard-accessible (WAI-ARIA APG).

  ## Token tiers
  - Tier 1 primitive: \`--ucl-color-neutral-700\`, \`--ucl-radius-md\`, \`--ucl-shadow-sm\`
  - Tier 2 semantic: \`--ucl-color-primary\`, \`--ucl-color-background\`, \`--ucl-color-muted-foreground\`
  - Tier 3 component-state: \`--ucl-button-primary-hover\`, \`--ucl-input-border-focus\`

  ## W3C Design Tokens
  - Source JSON: \`@ui-construction-library/tokens/w3c/json\`
  - CSS vars: \`@ui-construction-library/tokens/w3c/css\`
  - Resolved JSON: \`@ui-construction-library/tokens/w3c/resolved\`
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
