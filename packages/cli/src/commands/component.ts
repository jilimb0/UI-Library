import {
  foundationalComponents,
  getComponentById,
  type RegistryComponent,
} from '@ui-construction-library/registry';

const CATEGORY_ORDER = [
  'actions',
  'forms',
  'data-display',
  'feedback',
  'navigation',
  'overlays',
  'layout',
  'media',
  'typography',
  'foundations',
];

function fmt(label: string, value: string, indent = 0): string {
  const pad = '  '.repeat(indent);
  return `${pad}\x1b[90m${label}:\x1b[0m ${value}`;
}

function fmtTitle(text: string): string {
  return `\n\x1b[1m${text}\x1b[0m`;
}

function displayComponent(comp: RegistryComponent): void {
  console.log(fmtTitle(`${comp.displayName} (\`${comp.id}\`)`));
  console.log(fmt('Package', comp.package));
  console.log(fmt('Version', comp.version));
  console.log(fmt('Category', comp.category));
  console.log(fmt('Status', comp.status));
  console.log(fmt('Description', comp.description));

  // Props
  if (comp.props.length > 0) {
    console.log(fmtTitle('\nProps'));
    for (const prop of comp.props) {
      const required = 'required' in prop && prop.required ? ' *' : '';
      const defaultValue =
        'defaultValue' in prop && prop.defaultValue
          ? ` (default: ${prop.defaultValue})`
          : '';
      console.log(
        `  \x1b[36m${prop.name}${required}\x1b[0m\x1b[90m: ${prop.type}${defaultValue}\x1b[0m`
      );
      if (prop.description) {
        console.log(`    ${prop.description}`);
      }
    }
  }

  // States
  if (comp.states.length > 0) {
    console.log(fmtTitle('\nStates'));
    console.log(`  ${comp.states.join(', ')}`);
  }

  // Recipes
  if (comp.recipes && comp.recipes.length > 0) {
    console.log(fmtTitle('\nRecipes'));
    for (const recipe of comp.recipes) {
      console.log(`  \x1b[33m${recipe.label}\x1b[0m`);
      console.log(`    ${recipe.description}`);
      if ('doExample' in recipe && recipe.doExample) {
        console.log(`    \x1b[32mDo:\x1b[0m ${recipe.doExample}`);
      }
      if ('dontExample' in recipe && recipe.dontExample) {
        console.log(`    \x1b[31mDon't:\x1b[0m ${recipe.dontExample}`);
      }
    }
  }

  // Anti-patterns
  if (comp.antiPatterns && comp.antiPatterns.length > 0) {
    console.log(fmtTitle('\nAnti-patterns'));
    for (const ap of comp.antiPatterns) {
      console.log(`  \x1b[31m${ap.id}\x1b[0m`);
      console.log(`    ${ap.description}`);
    }
  }

  // A11y
  if (comp.a11y) {
    console.log(fmtTitle('\nAccessibility'));
    console.log(`  \x1b[90mRole:\x1b[0m ${comp.a11y.role}`);
    if (comp.a11y.keyboard.length > 0) {
      console.log(
        `  \x1b[90mKeyboard:\x1b[0m ${comp.a11y.keyboard.join(', ')}`
      );
    }
  }
}

function listComponents(): void {
  console.log(
    `\n\x1b[1mUI-Library Components\x1b[0m (${foundationalComponents.length} total)\n`
  );

  // Group by category
  const byCategory = new Map<string, RegistryComponent[]>();
  for (const comp of foundationalComponents) {
    const cat = comp.category || 'other';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(comp);
  }

  // Sort categories
  const sortedCategories = [...byCategory.keys()].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  for (const cat of sortedCategories) {
    const comps = byCategory.get(cat)!;
    console.log(`  \x1b[1m${cat}\x1b[0m`);
    for (const comp of comps) {
      const statusTag =
        comp.status === 'stable' ? '' : ` \x1b[33m[${comp.status}]\x1b[0m`;
      console.log(
        `    \x1b[36m${comp.id}\x1b[0m${statusTag} — ${comp.description}`
      );
    }
    console.log('');
  }
}

export async function componentCommand(args: string[]): Promise<void> {
  const componentName = args[0];

  if (!componentName || componentName === '--help') {
    listComponents();
    return;
  }

  // Try exact match first, then case-insensitive
  const exact = getComponentById(componentName);
  if (exact) {
    displayComponent(exact);
    return;
  }

  const fuzzy = foundationalComponents.find(
    (c: RegistryComponent) =>
      c.slug.toLowerCase() === componentName.toLowerCase()
  );

  if (fuzzy) {
    displayComponent(fuzzy);
    return;
  }

  console.error(`Component not found: "${componentName}"`);
  console.log('\nAvailable components:');
  listComponents();
  process.exit(1);
}
