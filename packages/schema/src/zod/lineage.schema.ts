import { z } from 'zod';

export const LineageFormTypeSchema = z.enum([
  '10-K',
  '10-Q',
  '20-F',
  '8-K',
  '13F-HR',
  '4',
  'CSV',
]);

export const FundamentalLineageCitationSchema = z.object({
  accessionNumber: z.string().min(1),
  ticker: z.string().min(1),
  formType: LineageFormTypeSchema,
  metricCode: z.string().min(1),
  xbrlTag: z.string().min(1),
  // Axis 4: Strictly integer minor units (bigint or safe integer), never float
  valueMinor: z.union([z.bigint(), z.number().int()]),
  currency: z.string().default('USD'),
  sourceByteOffset: z.number().int().nonnegative(),
  sourceByteLength: z.number().int().positive(),
  excerpt: z.string().optional(),
  filedAt: z.string().optional(),
});

export type LineageFormType = z.infer<typeof LineageFormTypeSchema>;
export type FundamentalLineageCitation = z.infer<
  typeof FundamentalLineageCitationSchema
>;
export type FundamentalLineageCitationInput = z.input<
  typeof FundamentalLineageCitationSchema
>;
