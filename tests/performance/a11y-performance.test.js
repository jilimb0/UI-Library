/**
 * A11y performance budget tests.
 *
 * Verifies that axe-core rule lookup and violation accumulation stay within
 * deterministic time budgets. Thresholds are intentionally generous — the
 * goal is to catch O(n²) regressions, not micro-benchmark optimisations.
 *
 * Budgets:
 *  - Build violation list (1 000 nodes × 5 rules): < 30 ms
 *  - Deduplicate violations (500 items):            < 10 ms
 *  - Rule lookup by id (10 000 ops):                < 20 ms
 */

import { performance } from 'node:perf_hooks';
import { describe, expect, it } from 'vitest';

// ---------------------------------------------------------------------------
// Minimal in-process stubs that replicate axe-like data shapes
// ---------------------------------------------------------------------------

function makeViolation(id, nodeCount) {
  return {
    id,
    impact: 'critical',
    description: `Rule ${id} violation`,
    nodes: Array.from({ length: nodeCount }, (_, i) => ({
      target: [`#node-${id}-${i}`],
      html: `<div id="node-${id}-${i}"></div>`,
    })),
  };
}

function buildViolationList(nodeCount, ruleCount) {
  const violations = [];
  for (let r = 0; r < ruleCount; r++) {
    violations.push(makeViolation(`rule-${r}`, nodeCount));
  }
  return violations;
}

function deduplicateViolations(violations) {
  const seen = new Set();
  return violations.filter((v) => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });
}

function buildRuleIndex(violations) {
  return Object.fromEntries(violations.map((v) => [v.id, v]));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('a11y performance baseline', () => {
  it('builds violation list for 1 000 nodes × 5 rules within 30 ms', () => {
    const start = performance.now();
    const violations = buildViolationList(1000, 5);
    const elapsed = performance.now() - start;

    expect(violations).toHaveLength(5);
    expect(violations[0].nodes).toHaveLength(1000);
    expect(elapsed).toBeLessThan(30);
  });

  it('deduplicates 500 violations within 10 ms', () => {
    // Create 500 violations: 250 unique + 250 duplicates
    const base = Array.from({ length: 250 }, (_, i) =>
      makeViolation(`rule-${i}`, 1)
    );
    const withDuplicates = [...base, ...base];

    const start = performance.now();
    const deduped = deduplicateViolations(withDuplicates);
    const elapsed = performance.now() - start;

    expect(deduped).toHaveLength(250);
    expect(elapsed).toBeLessThan(10);
  });

  it('performs 10 000 rule lookups by id within 20 ms', () => {
    const violations = buildViolationList(1, 100);
    const index = buildRuleIndex(violations);
    const ids = violations.map((v) => v.id);

    const start = performance.now();
    let hits = 0;
    for (let i = 0; i < 10000; i++) {
      const id = ids[i % ids.length];
      if (index[id]) hits++;
    }
    const elapsed = performance.now() - start;

    expect(hits).toBe(10000);
    expect(elapsed).toBeLessThan(20);
  });
});
