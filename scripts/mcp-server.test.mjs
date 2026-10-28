import assert from 'node:assert/strict';
import test from 'node:test';
import { handleMcpJsonRpcRequest, UI_LIBRARY_MCP_TOOLS } from './mcp-server.mjs';

test('uilibrary-mcp: tool definitions match specification', () => {
  const names = UI_LIBRARY_MCP_TOOLS.map((t) => t.name);
  assert.equal(UI_LIBRARY_MCP_TOOLS.length, 4);
  assert.ok(names.includes('uilibrary_list_components'));
  assert.ok(names.includes('uilibrary_get_component_contract'));
  assert.ok(names.includes('uilibrary_get_design_tokens'));
  assert.ok(names.includes('uilibrary_get_gold_kit_recipe'));
});

test('uilibrary-mcp: handles initialize, notifications and ping', async () => {
  const initRes = await handleMcpJsonRpcRequest({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {},
  });
  assert.equal(initRes.result.protocolVersion, '2024-11-05');
  assert.equal(initRes.result.serverInfo.name, 'ui-library-mcp');

  const notifyRes = await handleMcpJsonRpcRequest({
    jsonrpc: '2.0',
    method: 'notifications/initialized',
  });
  assert.equal(notifyRes, null);

  const pingRes = await handleMcpJsonRpcRequest({
    jsonrpc: '2.0',
    id: 2,
    method: 'ping',
  });
  assert.deepEqual(pingRes, { jsonrpc: '2.0', id: 2, result: {} });
});

test('uilibrary-mcp: lists components from api-snapshot.json', async () => {
  const res = await handleMcpJsonRpcRequest({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'uilibrary_list_components',
      arguments: { category: 'all' },
    },
  });

  assert.equal(res.error, undefined);
  const data = JSON.parse(res.result.content[0].text);
  assert.ok(data.totalCount > 40);
  assert.ok(Array.isArray(data.components.atoms));
  assert.ok(data.components.atoms.includes('Button'));
  assert.ok(data.components.molecules.includes('Dialog'));
});

test('uilibrary-mcp: retrieves component contract for Button', async () => {
  const res = await handleMcpJsonRpcRequest({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'uilibrary_get_component_contract',
      arguments: { componentName: 'Button' },
    },
  });

  assert.equal(res.error, undefined);
  const data = JSON.parse(res.result.content[0].text);
  assert.equal(data.component, 'Button');
  assert.equal(data.category, 'atoms');
  assert.ok(data.codeSnippet.includes('ButtonProps'));
  assert.ok(data.a11yGuidance.waiAria.length > 0);
});

test('uilibrary-mcp: retrieves gold kit recipe for telegram-theme', async () => {
  const res = await handleMcpJsonRpcRequest({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'uilibrary_get_gold_kit_recipe',
      arguments: { recipe: 'telegram-theme' },
    },
  });

  assert.equal(res.error, undefined);
  const snippet = res.result.content[0].text;
  assert.ok(snippet.includes('TelegramAdaptiveApp'));
  assert.ok(snippet.includes('ThemeProvider'));
});
