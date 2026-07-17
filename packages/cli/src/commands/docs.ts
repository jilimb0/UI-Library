import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Try to find the UI-Library docs directory by walking up from cwd
 * or checking common locations.
 */
function findDocsDir(): string | null {
  const candidates = [
    // If running from within the monorepo
    resolve(process.cwd(), '../../docs'),
    resolve(process.cwd(), '../docs'),
    resolve(process.cwd(), 'docs'),
    // Common monorepo root locations
    resolve(process.cwd(), '..', '..', 'docs'),
    resolve(process.cwd(), '..', '..', '..', 'docs'),
  ];

  for (const dir of candidates) {
    const resolved = resolve(dir);
    if (existsSync(resolved) && statSync(resolved).isDirectory()) {
      return resolved;
    }
  }

  return null;
}

function printDocsTree(dir: string, indent = 0): void {
  const entries = readdirSync(dir).sort();
  const pad = '  '.repeat(indent);

  for (const entry of entries) {
    // Skip hidden files, node_modules, dist
    if (entry.startsWith('.') || entry === 'node_modules' || entry === 'dist') {
      continue;
    }

    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      console.log(`${pad} \x1b[1m${entry}/\x1b[0m`);
      printDocsTree(fullPath, indent + 1);
    } else if (entry.endsWith('.md')) {
      const content = readFileSync(fullPath, 'utf-8');
      const title = extractTitle(content) || entry.replace('.md', '');
      console.log(`${pad} \x1b[36m${entry}\x1b[0m — ${title}`);
    }
  }
}

function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : null;
}

function printDocCategories(docsDir: string): void {
  const categories = readdirSync(docsDir).sort();

  console.log('\n\x1b[1mUI-Library Documentation\x1b[0m\n');
  console.log('  Documentation root:', docsDir, '\n');

  for (const cat of categories) {
    if (cat.startsWith('.')) continue;
    const catPath = resolve(docsDir, cat);
    if (!statSync(catPath).isDirectory()) continue;

    const label = cat
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
    console.log(`  \x1b[1m${label}\x1b[0m`);

    const files = readdirSync(catPath)
      .filter((f: string) => f.endsWith('.md'))
      .sort();

    for (const file of files) {
      const fullPath = resolve(catPath, file);
      const content = readFileSync(fullPath, 'utf-8');
      const title = extractTitle(content) || file.replace('.md', '');
      console.log(`    \x1b[36m${file}\x1b[0m — ${title}`);
    }

    console.log('');
  }
}

export async function docsCommand(args: string[]): Promise<void> {
  const docsDir = findDocsDir();

  if (!docsDir) {
    console.error('Could not find UI-Library docs directory.');
    console.error('Run this command from within the UI-Library monorepo.');
    process.exit(1);
  }

  if (args[0] === '--tree' || args[0] === '-t') {
    console.log(`\nDocs tree: ${docsDir}\n`);
    printDocsTree(docsDir);
  } else if (docsDir) {
    printDocCategories(docsDir);
  }
}
