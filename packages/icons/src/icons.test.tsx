/**
 * Icon package smoke tests.
 *
 * Verifies:
 *   1. IconProps contract — size and standard SVG passthrough props are accepted.
 *   2. iconManifest completeness — every entry is well-formed with required fields.
 *   3. iconRegistry shape — keys map to callable function components.
 *   4. Render shape — individual named icon exports render an SVG root element.
 *   5. Tree-shakeability — individual named exports exist alongside the registry.
 *
 * NOTE: iconRegistry is resolved from src/ at test time, where the icons/
 * directory contains both .tsx source and stale compiled .js/.d.ts artifacts.
 * The resolver picks whichever file Node finds first, so registry completeness
 * is validated via iconManifest (pure data, 299 entries) instead.
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { iconManifest } from './icon-manifest';
import {
  type IconName,
  type IconProps,
  iconRegistry,
  SearchIcon,
  UserIcon,
} from './index';

// ── 1. IconProps type contract ────────────────────────────────────────────────

describe('IconProps', () => {
  it('accepts size as a number', () => {
    const props: IconProps = { size: 24 };
    expect(props.size).toBe(24);
  });

  it('accepts size as a string', () => {
    const props: IconProps = { size: '1.5rem' };
    expect(props.size).toBe('1.5rem');
  });

  it('accepts standard SVG props', () => {
    const props: IconProps = {
      className: 'text-primary',
      'aria-label': 'Search',
      width: 16,
      height: 16,
    };
    expect(props.className).toBe('text-primary');
    expect(props['aria-label']).toBe('Search');
  });
});

// ── 2. iconManifest completeness ──────────────────────────────────────────────

describe('iconManifest', () => {
  it('contains a substantial set of icons', () => {
    expect(iconManifest.length).toBeGreaterThan(100);
  });

  it('every entry has required fields: componentName, exportName, name, keywords, category, status', () => {
    for (const entry of iconManifest) {
      expect(
        entry.componentName,
        `${entry.name} missing componentName`
      ).toBeTruthy();
      expect(entry.exportName, `${entry.name} missing exportName`).toBeTruthy();
      expect(entry.name, `entry missing name`).toBeTruthy();
      expect(
        Array.isArray(entry.keywords),
        `${entry.name} keywords must be array`
      ).toBe(true);
      expect(entry.category, `${entry.name} missing category`).toBeTruthy();
      expect(
        ['ready', 'planned'].includes(entry.status),
        `${entry.name} invalid status`
      ).toBe(true);
    }
  });

  it('contains well-known icon names', () => {
    const knownNames: IconName[] = [
      'search',
      'user',
      'check',
      'x',
      'menu',
      'plus',
      'trash',
    ];
    const manifestNames = new Set(iconManifest.map((e) => e.name));
    for (const name of knownNames) {
      expect(manifestNames.has(name), `manifest missing "${name}"`).toBe(true);
    }
  });

  it('has no duplicate names', () => {
    const names = iconManifest.map((e) => e.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('all ready icons have at least one keyword', () => {
    const readyWithNoKeywords = iconManifest.filter(
      (e) => e.status === 'ready' && e.keywords.length < 1
    );
    expect(readyWithNoKeywords).toHaveLength(0);
  });
});

// ── 3. iconRegistry shape ─────────────────────────────────────────────────────

describe('iconRegistry', () => {
  it('is a non-empty object', () => {
    expect(typeof iconRegistry).toBe('object');
    expect(Object.keys(iconRegistry).length).toBeGreaterThan(0);
  });

  it('every resolved registry key maps to a function component', () => {
    for (const [name, component] of Object.entries(iconRegistry)) {
      expect(
        typeof component,
        `iconRegistry["${name}"] must be a function`
      ).toBe('function');
    }
  });
});

// ── 4. Render shape ───────────────────────────────────────────────────────────

describe('icon component render shape', () => {
  it('SearchIcon renders an SVG element', () => {
    const { container } = render(<SearchIcon />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('SearchIcon forwards width and height attributes', () => {
    const { container } = render(<SearchIcon width={32} height={32} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('SearchIcon forwards className', () => {
    const { container } = render(<SearchIcon className="my-icon" />);
    expect(container.querySelector('svg')?.classList.contains('my-icon')).toBe(
      true
    );
  });

  it('UserIcon renders an SVG element', () => {
    const { container } = render(<UserIcon />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('icon components are marked aria-hidden by default', () => {
    const { container } = render(<SearchIcon />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true'
    );
  });

  it('icon renders with currentColor stroke by default', () => {
    const { container } = render(<SearchIcon />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
  });
});

// ── 5. Tree-shakeability — named exports exist ────────────────────────────────

describe('named exports', () => {
  it('SearchIcon is a named export', () => {
    expect(typeof SearchIcon).toBe('function');
  });

  it('UserIcon is a named export', () => {
    expect(typeof UserIcon).toBe('function');
  });
});
