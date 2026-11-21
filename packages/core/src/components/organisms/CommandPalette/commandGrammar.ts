export type CommandMode = 'search' | 'mnemonic' | 'expression';
export type RatioOperator = '/' | '-' | '*';

export interface ParsedExpression {
  left: string;
  operator: RatioOperator;
  right: string;
}

export interface ParsedTerminalCommand {
  mode: CommandMode;
  subject?: string;
  mnemonic?: string;
  expression?: ParsedExpression;
  raw: string;
}

export const KNOWN_TERMINAL_MNEMONICS = [
  'DES', // 30-second Security / Entity Tear Sheet
  'FA', // Financial Analysis / Standardized Statements
  'EM', // Earnings Matrix & Consensus Revisions
  'RV', // Relative Valuation & Peer Comps
  'DDIS', // Debt Maturity Wall
  'OWN', // 13F Institutional & Insider Ownership
  'CF', // Corporate Filings & Risk Factor Diff
  'SPLC', // Supply Chain Exposure Graph
  'PORT', // Portfolio Attribution & Stress Testing
  'TCA', // Transaction Cost Analysis & Quarantine
  'RISK', // Risk Limits & TiltGuard
  'FX', // FX Forward & Cross-Rate Matrix
  'BMAP', // Geospatial Map & Site Screening
  'MA', // M&A Precedent Comps & Underwriting
  'WEI', // Market / Fleet Overview Monitors
  'EQS', // Parametric Screener
] as const;

export type TerminalMnemonic = (typeof KNOWN_TERMINAL_MNEMONICS)[number];

const ASSET_TAG_RE = /^<[A-Za-z0-9_-]+>$/;
const ATTACHED_GO_RE = /^(.+)<go>$/i;
const DIV_MUL_EXPR_RE = /^([A-Za-z0-9._:-]+)\s*(\/|\*)\s*([A-Za-z0-9._:-]+)$/;
const SPACED_MINUS_EXPR_RE = /^([A-Za-z0-9._:-]+)\s+-\s+([A-Za-z0-9._:-]+)$/;
const COMPACT_UPPER_MINUS_EXPR_RE = /^([A-Z0-9.]{2,})-([A-Z0-9.]{2,})$/;

function stripGoAndAssetTags(
  tokens: string[],
  mnemonicSet: Set<string>
): string[] {
  const normalized = [...tokens];
  if (normalized.length > 0) {
    const last = normalized[normalized.length - 1];
    const attachedMatch = ATTACHED_GO_RE.exec(last);
    if (attachedMatch) {
      normalized[normalized.length - 1] = attachedMatch[1];
    } else if (/^<go>$/i.test(last)) {
      normalized.pop();
    }
  }

  const filtered = normalized.filter((token) => !ASSET_TAG_RE.test(token));

  if (
    filtered.length >= 2 &&
    /^go$/i.test(filtered[filtered.length - 1]) &&
    mnemonicSet.has(filtered[filtered.length - 2].toUpperCase())
  ) {
    filtered.pop();
  }

  return filtered;
}

function matchExpression(trimmed: string): ParsedExpression | null {
  const divMul = DIV_MUL_EXPR_RE.exec(trimmed);
  if (divMul) {
    return {
      left: divMul[1],
      operator: divMul[2] as RatioOperator,
      right: divMul[3],
    };
  }

  const spacedMinus = SPACED_MINUS_EXPR_RE.exec(trimmed);
  if (spacedMinus) {
    return {
      left: spacedMinus[1],
      operator: '-',
      right: spacedMinus[2],
    };
  }

  const compactUpperMinus = COMPACT_UPPER_MINUS_EXPR_RE.exec(trimmed);
  if (compactUpperMinus) {
    return {
      left: compactUpperMinus[1],
      operator: '-',
      right: compactUpperMinus[2],
    };
  }

  return null;
}

export function parseTerminalCommand(
  input: string,
  knownMnemonics: readonly string[] = KNOWN_TERMINAL_MNEMONICS
): ParsedTerminalCommand {
  const raw = input;
  const trimmed = input.trim();
  if (!trimmed) {
    return { mode: 'search', raw };
  }

  const mnemonicSet = new Set(knownMnemonics.map((m) => m.toUpperCase()));
  const tokens = stripGoAndAssetTags(trimmed.split(/\s+/), mnemonicSet);

  if (tokens.length > 0) {
    const candidate = tokens[tokens.length - 1].toUpperCase();
    if (mnemonicSet.has(candidate)) {
      if (tokens.length === 1) {
        return {
          mode: 'mnemonic',
          mnemonic: candidate,
          raw,
        };
      }
      return {
        mode: 'mnemonic',
        subject: tokens.slice(0, -1).join(' '),
        mnemonic: candidate,
        raw,
      };
    }
  }

  const expression = matchExpression(trimmed);
  if (expression) {
    return {
      mode: 'expression',
      expression,
      raw,
    };
  }

  return { mode: 'search', raw };
}
