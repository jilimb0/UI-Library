import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { Drawer } from '../Drawer/Drawer';

export type LineageFormType =
  | '10-K'
  | '10-Q'
  | '20-F'
  | '8-K'
  | '13F-HR'
  | '4'
  | 'CSV';

export interface FundamentalLineageCitation {
  accessionNumber: string;
  ticker: string;
  formType: LineageFormType;
  metricCode: string;
  xbrlTag: string;
  /** Strictly integer minor units (e.g. cents) — never floating-point. */
  valueMinor: bigint | number;
  currency?: string;
  sourceByteOffset: number;
  sourceByteLength: number;
  excerpt?: string;
  filedAt?: string;
}

export interface SourceLineageDrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange: (open: boolean) => void;
  citation: FundamentalLineageCitation | null;
  side?: 'left' | 'right' | 'bottom';
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW', 'VND', 'CLP', 'ISK']);
const THREE_DECIMAL_CURRENCIES = new Set(['BHD', 'JOD', 'KWD', 'OMR', 'TND']);

function getCurrencyMinorDecimals(currency: string): number {
  const upper = currency.toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(upper)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(upper)) return 3;
  return 2;
}

/**
 * Format integer minor units (e.g. cents) into a fixed-decimal currency string
 * using BigInt division/modulo only — zero IEEE 754 floating-point arithmetic.
 */
export function formatMinorUnits(
  valueMinor: bigint | number,
  currency = 'USD'
): string {
  const raw = typeof valueMinor === 'bigint' ? valueMinor : BigInt(valueMinor);
  const currencyCode = currency.trim() || 'USD';
  const decimals = getCurrencyMinorDecimals(currencyCode);
  const isNegative = raw < 0n;
  const abs = isNegative ? -raw : raw;
  const divisor = 10n ** BigInt(decimals);
  const major = abs / divisor;
  const minor = abs % divisor;

  const majorFormatted = major.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const minorFormatted =
    decimals > 0 ? `.${minor.toString().padStart(decimals, '0')}` : '';
  const sign = isNegative ? '-' : '';

  return `${sign}${majorFormatted}${minorFormatted} ${currencyCode}`;
}

export function SourceLineageDrawer({
  open,
  defaultOpen,
  onOpenChange,
  citation,
  side = 'right',
  title,
  description,
  className,
  style,
  'data-testid': testId = 'source-lineage-drawer',
}: SourceLineageDrawerProps) {
  const resolvedTitle =
    title ??
    (citation
      ? `Source Lineage — ${citation.ticker} (${citation.formType})`
      : 'Source Lineage');

  const resolvedDescription =
    description ??
    (citation
      ? `Filing ${citation.accessionNumber} · ${citation.metricCode}`
      : 'Inspect filing provenance and byte offsets.');

  const regionAriaLabel = citation
    ? `Source lineage citation for ${citation.ticker} ${citation.metricCode}`
    : 'Source lineage citation';

  // Axis 6 SSR guard: never access browser globals without typeof window !== 'undefined'
  const isClient = typeof window !== 'undefined';

  return (
    <Drawer
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      side={side}
      title={resolvedTitle}
      description={resolvedDescription}
      className={cn('source-lineage-drawer', className)}
      style={style}
    >
      <section
        aria-label={regionAriaLabel}
        data-testid={testId}
        data-ssr-hydrated={isClient ? 'true' : 'false'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {citation ? (
          <>
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '0.5rem 1rem',
                margin: 0,
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius, 2px)',
                background: 'var(--muted)',
                fontSize: '0.875rem',
              }}
            >
              <dt style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>
                Accession Number
              </dt>
              <dd
                style={{
                  margin: 0,
                  color: 'var(--foreground)',
                  fontFamily: 'monospace',
                }}
              >
                {citation.accessionNumber}
              </dd>

              <dt style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>
                Ticker / Form
              </dt>
              <dd style={{ margin: 0, color: 'var(--foreground)' }}>
                {citation.ticker} · {citation.formType}
              </dd>

              <dt style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>
                Metric Code
              </dt>
              <dd style={{ margin: 0, color: 'var(--foreground)' }}>
                {citation.metricCode}
              </dd>

              <dt style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>
                XBRL Tag
              </dt>
              <dd
                style={{
                  margin: 0,
                  color: 'var(--foreground)',
                  fontFamily: 'monospace',
                  wordBreak: 'break-word',
                }}
              >
                {citation.xbrlTag}
              </dd>

              <dt style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>
                Reported Value
              </dt>
              <dd
                style={{
                  margin: 0,
                  color: 'var(--foreground)',
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatMinorUnits(
                  citation.valueMinor,
                  citation.currency ?? 'USD'
                )}
              </dd>

              <dt style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>
                Byte Range
              </dt>
              <dd
                style={{
                  margin: 0,
                  color: 'var(--foreground)',
                  fontFamily: 'monospace',
                }}
              >
                [{citation.sourceByteOffset} ..{' '}
                {citation.sourceByteOffset + citation.sourceByteLength}] (
                {citation.sourceByteLength} bytes)
              </dd>

              {citation.filedAt ? (
                <>
                  <dt
                    style={{
                      color: 'var(--muted-foreground)',
                      fontWeight: 600,
                    }}
                  >
                    Filed At
                  </dt>
                  <dd style={{ margin: 0, color: 'var(--foreground)' }}>
                    {citation.filedAt}
                  </dd>
                </>
              ) : null}
            </dl>

            {citation.excerpt ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Source Excerpt
                </span>
                <blockquote
                  aria-label="Source excerpt"
                  style={{
                    margin: 0,
                    padding: '0.75rem',
                    borderLeft: '3px solid var(--border)',
                    background: 'var(--card)',
                    color: 'var(--card-foreground)',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {citation.excerpt}
                </blockquote>
              </div>
            ) : null}
          </>
        ) : (
          <p
            style={{
              margin: 0,
              color: 'var(--muted-foreground)',
              fontSize: '0.875rem',
            }}
          >
            No lineage citation selected.
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Drawer.Close
            className="ucl-button ucl-button--ghost ucl-button--sm"
            aria-label="Close source lineage drawer"
          >
            Close
          </Drawer.Close>
        </div>
      </section>
    </Drawer>
  );
}
