import { z } from 'zod';

/** Color scale (50-900) */
const ColorScaleSchema = z.object({
  50: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  100: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  200: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  300: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  400: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  500: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  600: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  700: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  800: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  900: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
});

/** Semantic intent (success, error, warning, info) */
const IntentSchema = z.object({
  bg: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  fg: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  border: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
});

/** Semantic colors */
const SemanticColorsSchema = z.object({
  background: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  foreground: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  muted: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  mutedForeground: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  border: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  primary: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  secondary: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  success: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  warning: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  error: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  info: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  card: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  accent: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  popover: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  ring: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  input: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  intent: z.object({
    success: IntentSchema,
    error: IntentSchema,
    warning: IntentSchema,
    info: IntentSchema,
  }),
});

/** Color tokens (primitive palette) */
export const ColorTokensSchema = z.object({
  primary: ColorScaleSchema,
  neutral: ColorScaleSchema,
  success: ColorScaleSchema,
  error: ColorScaleSchema,
  warning: ColorScaleSchema,
  info: ColorScaleSchema,
});

/** Theme name */
const ThemeNameSchema = z.enum(['light', 'dark']);

/** Theme configuration (matches tokens/cssVariables.ts) */
export const ThemeSchema = z.object({
  mode: ThemeNameSchema.optional(),
  colors: z
    .object({
      primary: ColorScaleSchema.partial().optional(),
      neutral: ColorScaleSchema.partial().optional(),
      success: ColorScaleSchema.partial().optional(),
      error: ColorScaleSchema.partial().optional(),
      warning: ColorScaleSchema.partial().optional(),
      info: ColorScaleSchema.partial().optional(),
    })
    .optional(),
  semantic: SemanticColorsSchema.partial().optional(),
  components: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  overrides: z.record(z.string(), z.string()).optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;
export type ColorTokens = z.infer<typeof ColorTokensSchema>;

/** Validate a theme object */
export function validateTheme(input: unknown): {
  valid: boolean;
  errors?: string[];
} {
  const result = ThemeSchema.safeParse(input);
  if (result.success) return { valid: true };
  return {
    valid: false,
    errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
  };
}
