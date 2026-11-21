import { describe, expect, it } from 'vitest';
import {
  KNOWN_TERMINAL_MNEMONICS,
  parseTerminalCommand,
} from './commandGrammar';

describe('commandGrammar', () => {
  it('exports the 16 canonical terminal mnemonics', () => {
    expect(KNOWN_TERMINAL_MNEMONICS).toContain('DES');
    expect(KNOWN_TERMINAL_MNEMONICS).toContain('FA');
    expect(KNOWN_TERMINAL_MNEMONICS).toContain('DDIS');
    expect(KNOWN_TERMINAL_MNEMONICS).toContain('WEI');
    expect(KNOWN_TERMINAL_MNEMONICS).toContain('EQS');
    expect(KNOWN_TERMINAL_MNEMONICS.length).toBe(16);
  });

  it('parses [Subject] [Mnemonic] commands', () => {
    expect(parseTerminalCommand('AAPL FA')).toEqual({
      mode: 'mnemonic',
      subject: 'AAPL',
      mnemonic: 'FA',
      raw: 'AAPL FA',
    });

    expect(parseTerminalCommand('btcusdt risk')).toEqual({
      mode: 'mnemonic',
      subject: 'btcusdt',
      mnemonic: 'RISK',
      raw: 'btcusdt risk',
    });

    expect(parseTerminalCommand('USD/EUR FX')).toEqual({
      mode: 'mnemonic',
      subject: 'USD/EUR',
      mnemonic: 'FX',
      raw: 'USD/EUR FX',
    });

    expect(parseTerminalCommand('my-repo DES')).toEqual({
      mode: 'mnemonic',
      subject: 'my-repo',
      mnemonic: 'DES',
      raw: 'my-repo DES',
    });

    expect(parseTerminalCommand('outlet-1 SPLC')).toEqual({
      mode: 'mnemonic',
      subject: 'outlet-1',
      mnemonic: 'SPLC',
      raw: 'outlet-1 SPLC',
    });
  });

  it('parses multi-token subjects with asset-class qualifiers and <GO>', () => {
    expect(parseTerminalCommand('AAPL US <EQUITY> DDIS <GO>')).toEqual({
      mode: 'mnemonic',
      subject: 'AAPL US',
      mnemonic: 'DDIS',
      raw: 'AAPL US <EQUITY> DDIS <GO>',
    });

    expect(parseTerminalCommand('BTC <CRYPTO> TCA GO')).toEqual({
      mode: 'mnemonic',
      subject: 'BTC',
      mnemonic: 'TCA',
      raw: 'BTC <CRYPTO> TCA GO',
    });
  });

  it('parses standalone portfolio/market mnemonics', () => {
    for (const cmd of ['WEI', 'PORT', 'EQS', 'MA', 'wei <GO>']) {
      const parsed = parseTerminalCommand(cmd);
      expect(parsed.mode).toBe('mnemonic');
      expect(parsed.subject).toBeUndefined();
      expect(parsed.mnemonic).toBe(cmd.split(' ')[0].toUpperCase());
    }
  });

  it('parses ratio, spread, and scaling expressions with or without spaces', () => {
    expect(parseTerminalCommand('SOLUSDT / BTCUSDT')).toEqual({
      mode: 'expression',
      expression: { left: 'SOLUSDT', operator: '/', right: 'BTCUSDT' },
      raw: 'SOLUSDT / BTCUSDT',
    });

    expect(parseTerminalCommand('AAPL/QQQ')).toEqual({
      mode: 'expression',
      expression: { left: 'AAPL', operator: '/', right: 'QQQ' },
      raw: 'AAPL/QQQ',
    });

    expect(parseTerminalCommand('XLE - CL1')).toEqual({
      mode: 'expression',
      expression: { left: 'XLE', operator: '-', right: 'CL1' },
      raw: 'XLE - CL1',
    });

    expect(parseTerminalCommand('XLE-CL1')).toEqual({
      mode: 'expression',
      expression: { left: 'XLE', operator: '-', right: 'CL1' },
      raw: 'XLE-CL1',
    });

    expect(parseTerminalCommand('BTCUSDT * 100')).toEqual({
      mode: 'expression',
      expression: { left: 'BTCUSDT', operator: '*', right: '100' },
      raw: 'BTCUSDT * 100',
    });
  });

  it('falls back to search mode for plain queries and kebab slugs', () => {
    expect(parseTerminalCommand('')).toEqual({ mode: 'search', raw: '' });
    expect(parseTerminalCommand('   ')).toEqual({ mode: 'search', raw: '   ' });
    expect(parseTerminalCommand('open-settings')).toEqual({
      mode: 'search',
      raw: 'open-settings',
    });
    expect(parseTerminalCommand('Apple Inc')).toEqual({
      mode: 'search',
      raw: 'Apple Inc',
    });
  });

  it('supports custom knownMnemonics overrides', () => {
    expect(parseTerminalCommand('NVDA ALPHA', ['ALPHA'])).toEqual({
      mode: 'mnemonic',
      subject: 'NVDA',
      mnemonic: 'ALPHA',
      raw: 'NVDA ALPHA',
    });
  });
});
