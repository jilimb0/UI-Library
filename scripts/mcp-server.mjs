#!/usr/bin/env node
/**
 * UI-Library Design System MCP Server
 * Model Context Protocol (MCP) JSON-RPC 2.0 server over stdio.
 * Provides AI agents with accurate component contracts, design tokens,
 * and WAI-ARIA recipes directly from UI-Library sources.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import * as readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

export const UI_LIBRARY_MCP_TOOLS = [
  {
    name: 'uilibrary_list_components',
    description:
      'List all UI-Library design system components and hooks from api-snapshot.json, grouped by atomic design level (atoms, molecules, organisms, templates).',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['atoms', 'molecules', 'organisms', 'templates', 'all'],
          description: 'Filter components by category (default: all)',
        },
      },
    },
  },
  {
    name: 'uilibrary_get_component_contract',
    description:
      'Retrieve component interface, TypeScript props, variants, and accessibility (WAI-ARIA/SSR) requirements for a specific component.',
    inputSchema: {
      type: 'object',
      properties: {
        componentName: {
          type: 'string',
          description: 'Name of the component (e.g. Button, Dialog, Modal, Input, Drawer)',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'uilibrary_get_design_tokens',
    description:
      'Retrieve design tokens (colors, spacing, typography, radii, semantic tokens, or Tailwind theme values) from @ui-construction-library/tokens.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['semantic', 'raw', 'component', 'all'],
          description: 'Token set type (default: semantic)',
        },
      },
    },
  },
  {
    name: 'uilibrary_get_gold_kit_recipe',
    description:
      'Get production-ready, accessible TSX recipes for common UI-Library integration patterns (Telegram Mini App theme, Modal dialog, Form validation, Data Table, Auth Shell).',
    inputSchema: {
      type: 'object',
      properties: {
        recipe: {
          type: 'string',
          enum: [
            'telegram-theme',
            'accessible-modal',
            'form-with-field',
            'data-table-pagination',
            'auth-shell',
            'all',
          ],
          description: 'Recipe identifier to load',
        },
      },
      required: ['recipe'],
    },
  },
];

function loadApiSnapshot() {
  const snapshotPath = join(ROOT, 'packages', 'core', 'api-snapshot.json');
  if (existsSync(snapshotPath)) {
    try {
      return JSON.parse(readFileSync(snapshotPath, 'utf8'));
    } catch {
      // Fallback below
    }
  }
  return { componentModules: [] };
}

function findComponentSource(componentName) {
  const compDir = join(ROOT, 'packages', 'core', 'src', 'components');
  if (!existsSync(compDir)) return null;

  const categories = ['atoms', 'molecules', 'organisms', 'templates'];
  for (const cat of categories) {
    const targetDir = join(compDir, cat, componentName);
    if (existsSync(targetDir)) {
      const candidates = [
        join(targetDir, `${componentName}.tsx`),
        join(targetDir, `${componentName}.ts`),
        join(targetDir, 'index.ts'),
      ];
      for (const file of candidates) {
        if (existsSync(file)) {
          return {
            category: cat,
            filePath: file,
            content: readFileSync(file, 'utf8'),
          };
        }
      }
    }
  }
  return null;
}

function loadTokens(type = 'semantic') {
  const tokensDist = join(ROOT, 'packages', 'tokens', 'dist');
  const tokenFileMap = {
    semantic: join(tokensDist, 'tokens.semantic.json'),
    raw: join(tokensDist, 'tokens.raw.json'),
    component: join(tokensDist, 'tokens.component.json'),
  };

  const targetFile = tokenFileMap[type] || tokenFileMap.semantic;
  if (existsSync(targetFile)) {
    try {
      return JSON.parse(readFileSync(targetFile, 'utf8'));
    } catch {
      // fallback
    }
  }

  // Fallback to presets or source if dist not pre-built
  const fallbackPreset = join(ROOT, 'packages', 'tokens', 'tailwind.preset.ts');
  if (existsSync(fallbackPreset)) {
    return {
      note: 'Using fallback preset definition (dist files not compiled)',
      presetPath: fallbackPreset,
    };
  }

  return { message: 'Tokens not found in dist. Run pnpm build in packages/tokens.' };
}

const RECIPES = {
  'telegram-theme': `// Telegram Mini App Adaptive Theme Provider Recipe
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@ui-construction-library/core';

export function TelegramAdaptiveApp({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      setColorScheme(tg.colorScheme || 'light');
      tg.onEvent('themeChanged', () => {
        setColorScheme(tg.colorScheme || 'light');
      });
    }
  }, []);

  return <ThemeProvider colorScheme={colorScheme}>{children}</ThemeProvider>;
}`,
  'accessible-modal': `// Accessible Dialog / Modal Recipe with WAI-ARIA Focus Trap
import { useState } from 'react';
import { Button, Modal, Stack, Text, Heading } from '@ui-construction-library/core';

export function ConfirmActionModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="default" onClick={() => setOpen(true)}>Open Confirmation</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <Stack spacing="md" p="lg">
          <Heading id="modal-title" level={3}>Confirm Action</Heading>
          <Text id="modal-desc">Are you sure you want to proceed with this operation?</Text>
          <Stack direction="row" spacing="sm" justify="flex-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setOpen(false); }}>Confirm</Button>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}`,
  'form-with-field': `// Form Field Validation Pattern
import { useState } from 'react';
import { Field, Input, Button, Stack } from '@ui-construction-library/core';

export function UserProfileForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError(undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="md">
        <Field label="Email Address" required error={error} hint="We never share your email.">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </Field>
        <Button type="submit" variant="default">Save</Button>
      </Stack>
    </form>
  );
}`,
  'data-table-pagination': `// Accessible DataTable with Keyboard-accessible Pagination
import { DataTable, Pagination, Stack } from '@ui-construction-library/core';

export function RepositoryList({ items, page, totalPages, onPageChange }: any) {
  const columns = [
    { key: 'name', title: 'Repository Name' },
    { key: 'language', title: 'Language' },
    { key: 'stars', title: 'Stars' },
  ];

  return (
    <Stack spacing="md">
      <DataTable columns={columns} data={items} caption="Connected Repositories" />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        aria-label="Repository table pagination"
      />
    </Stack>
  );
}`,
  'auth-shell': `// AuthShell Responsive Template
import { AuthShell, Input, Button, Field, Stack, Heading, Text } from '@ui-construction-library/core';

export function LoginPage() {
  return (
    <AuthShell
      illustrationSlot={<div className="bg-primary-900 text-white p-8">Welcome Back</div>}
    >
      <Stack spacing="lg" maxW="400px" mx="auto">
        <Heading level={2}>Sign In</Heading>
        <Text variant="muted">Access your engineering workspace</Text>
        <Field label="Email">
          <Input type="email" placeholder="you@company.com" />
        </Field>
        <Field label="Password">
          <Input type="password" />
        </Field>
        <Button variant="default" fullWidth>Continue</Button>
      </Stack>
    </AuthShell>
  );
}`,
};

export async function handleMcpJsonRpcRequest(rpcReq) {
  // In JSON-RPC 2.0 / MCP notifications must NOT be responded to
  if (rpcReq.id === undefined || rpcReq.method?.startsWith('notifications/')) {
    return null;
  }

  const id = rpcReq.id ?? null;
  const method = rpcReq.method;

  try {
    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: 'ui-library-mcp',
            version: '1.0.0',
          },
        },
      };
    }

    if (method === 'ping') {
      return { jsonrpc: '2.0', id, result: {} };
    }

    if (method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: UI_LIBRARY_MCP_TOOLS,
        },
      };
    }

    if (method === 'tools/call') {
      const toolName = rpcReq.params?.name;
      const args = rpcReq.params?.arguments || {};

      if (toolName === 'uilibrary_list_components') {
        const snapshot = loadApiSnapshot();
        const categoryFilter = args.category || 'all';
        let modules = snapshot.componentModules || [];

        if (categoryFilter !== 'all') {
          modules = modules.filter((m) => m.startsWith(`${categoryFilter}/`));
        }

        const grouped = {
          atoms: modules.filter((m) => m.startsWith('atoms/')).map((m) => m.replace('atoms/', '')),
          molecules: modules
            .filter((m) => m.startsWith('molecules/'))
            .map((m) => m.replace('molecules/', '')),
          organisms: modules
            .filter((m) => m.startsWith('organisms/'))
            .map((m) => m.replace('organisms/', '')),
          templates: modules
            .filter((m) => m.startsWith('templates/'))
            .map((m) => m.replace('templates/', '')),
        };

        const resultData = {
          totalCount: modules.length,
          barrelExports: snapshot.barrelExports,
          components: categoryFilter === 'all' ? grouped : grouped[categoryFilter] || [],
        };

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(resultData, null, 2) }],
          },
        };
      }

      if (toolName === 'uilibrary_get_component_contract') {
        const compName = String(args.componentName || '').trim();
        if (!compName) {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: 'Missing componentName argument' },
          };
        }

        const source = findComponentSource(compName);
        if (!source) {
          return {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `Component "${compName}" not found in @ui-construction-library/core. Check available components via uilibrary_list_components.`,
                },
              ],
              isError: true,
            },
          };
        }

        // Extract props interface and variant snippet
        const contractInfo = {
          component: compName,
          category: source.category,
          sourceFile: source.filePath.replace(ROOT, ''),
          codeSnippet: source.content.slice(0, 3000),
          a11yGuidance: {
            waiAria: 'Enforce standard keyboard accessibility (Enter/Space on buttons, Esc on modals).',
            ssrGuard: 'Guard any window/document references with typeof window !== "undefined".',
            contrast: 'Use semantic tokens for foreground/background contrast compliance.',
          },
        };

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(contractInfo, null, 2) }],
          },
        };
      }

      if (toolName === 'uilibrary_get_design_tokens') {
        const tokens = loadTokens(args.type || 'semantic');
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(tokens, null, 2) }],
          },
        };
      }

      if (toolName === 'uilibrary_get_gold_kit_recipe') {
        const recipeKey = args.recipe;
        if (recipeKey === 'all') {
          return {
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(RECIPES, null, 2) }],
            },
          };
        }

        const foundRecipe = RECIPES[recipeKey];
        if (!foundRecipe) {
          return {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `Unknown recipe "${recipeKey}". Available recipes: ${Object.keys(RECIPES).join(', ')}`,
                },
              ],
              isError: true,
            },
          };
        }

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: foundRecipe }],
          },
        };
      }

      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Unknown tool: ${toolName}` },
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    };
  } catch (err) {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: `UI-Library MCP error: ${String(err)}` },
    };
  }
}

export function startUiLibraryMcpServer() {
  // Stdout is strictly reserved for JSON-RPC 2.0 messages
  console.log = (...args) => console.error(...args);
  console.info = (...args) => console.error(...args);

  const rl = readline.createInterface({
    input: process.stdin,
    terminal: false,
  });

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const req = JSON.parse(trimmed);
      const res = await handleMcpJsonRpcRequest(req);
      if (res !== null) {
        process.stdout.write(`${JSON.stringify(res)}\n`);
      }
    } catch {
      // ignore parse errors on broken lines
    }
  });
}

// Auto-run if executed directly
if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  startUiLibraryMcpServer();
}
