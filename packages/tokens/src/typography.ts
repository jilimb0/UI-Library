export const typography = {
  fontFamily: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    serif:
      'Source Serif 4, ui-serif, Georgia, Cambria, "Times New Roman", serif',
    mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
  },
  fontSize: {
    xs: 'clamp(0.75rem, 0.72rem + 0.12vw, 0.875rem)',
    sm: 'clamp(0.875rem, 0.84rem + 0.16vw, 1rem)',
    base: 'clamp(1rem, 0.96rem + 0.22vw, 1.125rem)',
    lg: 'clamp(1.125rem, 1.04rem + 0.36vw, 1.375rem)',
    xl: 'clamp(1.25rem, 1.08rem + 0.72vw, 1.75rem)',
    '2xl': 'clamp(1.5rem, 1.18rem + 1.24vw, 2.375rem)',
    '3xl': 'clamp(1.875rem, 1.28rem + 2.1vw, 3rem)',
    '4xl': 'clamp(2.25rem, 1.4rem + 3vw, 4rem)',
    '5xl': 'clamp(3rem, 1.8rem + 4vw, 5rem)',
    '6xl': 'clamp(3.75rem, 2.4rem + 4.8vw, 6rem)',
  },
  lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.7',
  },
  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.015em',
    normal: '0',
    wide: '0.02em',
    wider: '0.08em',
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;
