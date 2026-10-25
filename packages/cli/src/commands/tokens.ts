/**
 * `ucl tokens` — design token reference and brand customisation guide.
 *
 * Shows the W3C token structure, how to override tokens via ThemeProvider,
 * and how to consume --ucl-* CSS custom properties.
 */

const TIERS = [
  {
    name: 'Tier 1 — Primitive scales',
    desc: 'Raw color palettes, spacing, type, motion, shadow',
    example: '--ucl-color-neutral-700: #1d1d1f  (light fg, primary, ring)',
  },
  {
    name: 'Tier 2 — Semantic aliases',
    desc: 'Theme-scoped *-foreground pairs, intent tokens',
    example: '--ucl-color-primary: #1d1d1f  (resolves from neutral-700)',
  },
  {
    name: 'Tier 3 — Component-state tokens',
    desc: 'Per-component default/hover/active/focus/disabled',
    example: '--ucl-button-primary-hover: #000000  (used by CSS :hover)',
  },
];

const CUSTOMISATION_GUIDE = `
\x1b[1mCustomising tokens at runtime (ThemeProvider)\x1b[0m

\x1b[36m1. Custom brand theme (single variant):\x1b[0m
\`\`\`tsx
import { ThemeProvider } from '@ui-construction-library/core';

<ThemeProvider
  defaultTheme="light"
  themes={{
    'brand-ocean': {
      semantic: {
        'color-primary': '#0066cc',
        'color-primary-foreground': '#ffffff',
        'color-ring': '#0066cc',
      },
      component: {
        'button-primary-default': '#0066cc',
        'button-primary-hover': '#0052a3',
        'button-primary-active': '#003d7a',
      },
    },
  }}
>
  {children}
</ThemeProvider>
\`\`\`

\x1b[36m2. Switch to a brand theme:\x1b[0m
\`\`\`tsx
const { setTheme } = useTheme();
setTheme('brand-ocean');
\`\`\`

\x1b[36m3. Tailwind v4 bridge (optional):\x1b[0m
\`\`\`css
/* After @import "tailwindcss" */
@import "@ui-construction-library/tokens/w3c/tailwind";
/* Now bg-primary, text-muted-foreground etc. follow the active theme */
\`\`\`

\x1b[36m4. CSS-only override (no React needed):\x1b[0m
\`\`\`css
[data-theme="brand-ocean"] {
  --ucl-color-primary: #0066cc;
  --ucl-button-primary-default: #0066cc;
  --ucl-button-primary-hover: #0052a3;
}
\`\`\`

\x1b[36m5. W3C token source (Figma / Tokens Studio / Style Dictionary):\x1b[0m
Import: \x1b[90m@ui-construction-library/tokens/w3c/json\x1b[0m
Resolved: \x1b[90m@ui-construction-library/tokens/w3c/resolved\x1b[0m
`;

function listTiers(): void {
  console.log('\n\x1b[1mDesign Token Architecture\x1b[0m\n');
  for (const tier of TIERS) {
    console.log(`  \x1b[1m${tier.name}\x1b[0m`);
    console.log(`    ${tier.desc}`);
    console.log(`    \x1b[90m${tier.example}\x1b[0m\n`);
  }
}

export async function tokensCommand(args: string[]): Promise<void> {
  const sub = args[0];

  if (!sub || sub === '--list' || sub === 'list') {
    listTiers();
    console.log(CUSTOMISATION_GUIDE);
    return;
  }

  if (sub === 'prefix') {
    console.log('\nCanonical CSS variable prefix: \x1b[36m--ucl-\x1b[0m\n');
    console.log(
      'All token CSS vars are emitted under --ucl-. Legacy unprefixed\n' +
        'aliases (--primary, --background, etc.) are provided in globals.css\n' +
        'as var(--ucl-*) forwarding declarations.\n'
    );
    return;
  }

  console.error(`Unknown tokens sub-command: "${sub}"`);
  console.log('Usage: ucl tokens [list|prefix]');
  process.exit(1);
}
