import { z } from 'zod';

export const WidgetColorGroupSchema = z.enum([
  'green',
  'blue',
  'red',
  'amber',
  'unlinked',
]);

export const ActiveWidgetColorGroupSchema = z.enum([
  'green',
  'blue',
  'red',
  'amber',
]);

export const LinkedEntityTypeSchema = z.enum([
  'ticker',
  'account',
  'repo',
  'outlet',
  'location',
]);

export const LinkedEntityPayloadSchema = z.object({
  symbol: z.string().trim().min(1).max(128),
  entityType: LinkedEntityTypeSchema,
  timeframe: z.string().trim().min(1).max(32).optional(),
  sourceWidgetId: z.string().trim().min(1).max(128),
  updatedAtMs: z.number().int().nonnegative(),
});

export const WidgetLinkBroadcastMessageSchema = z.object({
  group: ActiveWidgetColorGroupSchema,
  payload: LinkedEntityPayloadSchema.nullable(),
});

export const WidgetLinkGroupsSchema = z.object({
  green: LinkedEntityPayloadSchema.optional(),
  blue: LinkedEntityPayloadSchema.optional(),
  red: LinkedEntityPayloadSchema.optional(),
  amber: LinkedEntityPayloadSchema.optional(),
});

export type WidgetColorGroup = z.infer<typeof WidgetColorGroupSchema>;
export type ActiveWidgetColorGroup = z.infer<
  typeof ActiveWidgetColorGroupSchema
>;
export type LinkedEntityType = z.infer<typeof LinkedEntityTypeSchema>;
export type LinkedEntityPayload = z.infer<typeof LinkedEntityPayloadSchema>;
export type WidgetLinkBroadcastMessage = z.infer<
  typeof WidgetLinkBroadcastMessageSchema
>;
export type WidgetLinkGroups = z.infer<typeof WidgetLinkGroupsSchema>;
