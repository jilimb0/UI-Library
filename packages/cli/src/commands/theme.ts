import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const THEMES = [
  { id: 'dark', label: 'Dark theme', file: 'theme-dark.css' },
  { id: 'light', label: 'Light theme', file: 'theme-light.css' },
  {
    id: 'neutral',
    label: 'Neutral theme (grayscale)',
    file: 'theme-neutral.css',
  },
] as const;

/**
 * Resolve the path to the themes package dist directory.
 * Works both from the monorepo and when installed as a dependency.
 */
function getThemesDistDir(): string {
  const dir = dirname(fileURLToPath(import.meta.url));

  // Try workspace path first (from dist/commands/ up to packages/themes/dist)
  const workspacePath = resolve(
    dir,
    '..',
    '..',
    '..',
    '..',
    '..',
    'themes',
    'dist'
  );
  if (existsSync(workspacePath)) {
    return workspacePath;
  }

  // Try from node_modules when installed
  const nmPath = resolve(
    dir,
    '..',
    '..',
    'node_modules',
    '@ui-construction-library',
    'themes',
    'dist'
  );
  if (existsSync(nmPath)) {
    return nmPath;
  }

  // Try from the monorepo root
  const monoPath = resolve(
    dir,
    '..',
    '..',
    '..',
    '..',
    'packages',
    'themes',
    'dist'
  );
  if (existsSync(monoPath)) {
    return monoPath;
  }

  throw new Error(
    'Could not locate @ui-construction-library/themes dist directory.'
  );
}

function listThemes(): void {
  console.log('\n\x1b[1mAvailable Themes\x1b[0m\n');

  for (const theme of THEMES) {
    const importPath = `@ui-construction-library/themes/${theme.file}`;
    const dataAttr = `data-theme="${theme.id}"`;
    console.log(`  \x1b[36m${theme.id}\x1b[0m`);
    console.log(`    ${theme.label}`);
    console.log(`    Import: \x1b[90m${importPath}\x1b[0m`);
    console.log(`    HTML:   \x1b[90m<html ${dataAttr}>\x1b[0m`);
    console.log('');
  }
}

export async function themeCommand(args: string[]): Promise<void> {
  // --list flag
  if (args[0] === '--list' || args[0] === '-l' || args.length === 0) {
    listThemes();
    return;
  }

  const themeName = args[0]?.toLowerCase() ?? '';
  const matchedTheme = THEMES.find((t) => t.id === themeName);

  if (!matchedTheme) {
    console.error(
      `Unknown theme: "${themeName}". Available: ${THEMES.map((t) => t.id).join(', ')}`
    );
    process.exit(1);
  }

  // Copy theme CSS to current directory
  try {
    const themesDist = getThemesDistDir();
    const srcFile = resolve(themesDist, matchedTheme.file);
    const destFile = resolve(process.cwd(), matchedTheme.file);

    if (!existsSync(srcFile)) {
      console.error(`Theme file not found: ${srcFile}`);
      console.error('Make sure @ui-construction-library/themes is built.');
      process.exit(1);
    }

    copyFileSync(srcFile, destFile);
    console.log(`✓ Copied ${matchedTheme.file} to ${destFile}`);
    console.log(`\nUsage: <html data-theme="${matchedTheme.id}">`);
  } catch (error) {
    console.error(
      'Failed to copy theme CSS. Is @ui-construction-library/themes installed?',
      String(error)
    );
    process.exit(1);
  }
}
