import { z } from 'zod';

/** Common HTML input types */
const InputTypeSchema = z.enum([
  'text',
  'email',
  'password',
  'number',
  'search',
  'tel',
  'url',
  'date',
  'datetime-local',
]);

/** Button props schema (matches core ButtonProps + behaviors ButtonBehaviorOptions) */
export const ButtonPropsSchema = z.object({
  as: z.string().optional(),
  href: z.string().optional(),
  target: z.string().optional(),
  rel: z.string().optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
  variant: z
    .enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'])
    .optional(),
  size: z.enum(['default', 'sm', 'lg', 'icon']).optional(),
  leftIcon: z.any().optional(),
  rightIcon: z.any().optional(),
  className: z.string().optional(),
  onClick: z.function().args(z.any()).returns(z.void()).optional(),
});

/** Input props schema (matches core InputProps + behaviors FieldBehaviorOptions) */
export const InputPropsSchema = z.object({
  type: InputTypeSchema.optional().default('text'),
  size: z.enum(['default', 'sm', 'lg']).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  error: z.boolean().optional(),
  errorMessage: z.string().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  className: z.string().optional(),
});

/** Select props schema */
export const SelectPropsSchema = z.object({
  size: z.enum(['default', 'sm', 'lg']).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  options: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  error: z.boolean().optional(),
  errorMessage: z.string().optional(),
  disabled: z.boolean().optional(),
  placeholder: z.string().optional(),
  className: z.string().optional(),
});

/** Switch props schema */
export const SwitchPropsSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  size: z.enum(['sm', 'default', 'md', 'lg']).optional(),
  disabled: z.boolean().optional(),
  checked: z.boolean().optional(),
  defaultChecked: z.boolean().optional(),
  onCheckedChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  className: z.string().optional(),
});

/** Checkbox props schema */
export const CheckboxPropsSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  error: z.boolean().optional(),
  errorMessage: z.string().optional(),
  indeterminate: z.boolean().optional(),
  size: z.enum(['sm', 'default', 'md', 'lg']).optional(),
  checked: z.boolean().optional(),
  onCheckedChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  className: z.string().optional(),
});

/** Tab trigger props schema (matches behaviors TabTriggerBehaviorOptions) */
export const TabTriggerPropsSchema = z.object({
  value: z.string(),
  tabValue: z.string(),
  onValueChange: z.function().args(z.string()).returns(z.void()).optional(),
  onNext: z.function().returns(z.void()).optional(),
  onPrev: z.function().returns(z.void()).optional(),
});

/** Tooltip props schema (core level) */
export const TooltipPropsSchema = z.object({
  content: z.any(),
  side: z.enum(['top', 'right', 'bottom', 'left']).optional().default('top'),
  delayMs: z.number().optional(),
  className: z.string().optional(),
});

/** Popover props schema (core level) */
export const PopoverPropsSchema = z.object({
  trigger: z.any(),
  content: z.any(),
  side: z.enum(['top', 'right', 'bottom', 'left']).optional().default('bottom'),
  sideOffset: z.number().optional().default(8),
  open: z.boolean().optional(),
  defaultOpen: z.boolean().optional(),
  onOpenChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional().default('md'),
  className: z.string().optional(),
});

/** Slider props schema (core level) */
export const SliderPropsSchema = z.object({
  value: z.array(z.number()).optional(),
  defaultValue: z.array(z.number()).optional(),
  onChange: z.function().args(z.array(z.number())).returns(z.void()).optional(),
  onValueChange: z
    .function()
    .args(z.array(z.number()))
    .returns(z.void())
    .optional(),
  min: z.number().optional().default(0),
  max: z.number().optional().default(100),
  step: z.number().optional().default(1),
  size: z.enum(['sm', 'md', 'lg']).optional().default('md'),
  orientation: z
    .enum(['horizontal', 'vertical'])
    .optional()
    .default('horizontal'),
  className: z.string().optional(),
});

/** Dialog props schema (core level — replaces behavior-level DialogPropsSchema) */
export const DialogPropsSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().optional(),
  onOpenChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  className: z.string().optional(),
});

/** Tabs props schema (core level) */
export const TabsPropsSchema = z.object({
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  onValueChange: z.function().args(z.string()).returns(z.void()).optional(),
  className: z.string().optional(),
});

/** Accordion props schema (core level) */
export const AccordionPropsSchema = z.object({
  type: z.enum(['single', 'multiple']).optional().default('single'),
  collapsible: z.boolean().optional().default(false),
  defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
  value: z.union([z.string(), z.array(z.string())]).optional(),
  onValueChange: z
    .function()
    .args(z.union([z.string(), z.array(z.string())]))
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type TooltipProps = z.infer<typeof TooltipPropsSchema>;
export type PopoverProps = z.infer<typeof PopoverPropsSchema>;
export type SliderProps = z.infer<typeof SliderPropsSchema>;
export type DialogProps = z.infer<typeof DialogPropsSchema>;
export type TabsProps = z.infer<typeof TabsPropsSchema>;
export type AccordionProps = z.infer<typeof AccordionPropsSchema>;
export type ButtonProps = z.infer<typeof ButtonPropsSchema>;
export type InputProps = z.infer<typeof InputPropsSchema>;
export type SelectProps = z.infer<typeof SelectPropsSchema>;
export type SwitchProps = z.infer<typeof SwitchPropsSchema>;
export type CheckboxProps = z.infer<typeof CheckboxPropsSchema>;
export type TabTriggerProps = z.infer<typeof TabTriggerPropsSchema>;

/** Validate any component props against a schema */
export function validateProps<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { valid: boolean; errors?: string[]; data?: T } {
  const result = schema.safeParse(input);
  if (result.success) return { valid: true, data: result.data };
  return {
    valid: false,
    errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
  };
}
