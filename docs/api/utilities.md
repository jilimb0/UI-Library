# Utilities API

Public utility exports from `@ui-construction-library/core` and `@ui-construction-library/utils`.

## `@ui-construction-library/core` utilities

### cn

Merges Tailwind CSS class names, resolves conflicts via `tailwind-merge`.

```ts
import { cn } from '@ui-construction-library/core';

cn('px-4 py-2', 'px-6'); // 'py-2 px-6'
```

### formatCurrency

| Param | Type | Notes |
|---|---|---|
| `amount` | `number` | Numeric value |
| `currency` | `string` | ISO 4217 code (default `USD`) |
| `locale` | `string` | Locale string (default `en-US`) |

### formatNumber

| Param | Type | Notes |
|---|---|---|
| `num` | `number` | Input value |
| `decimals` | `number` | Decimal places (default `0`) |

### formatDate

| Param | Type | Notes |
|---|---|---|
| `date` | `Date` | Input date |
| `locale` | `string` | Locale string (default `en-US`) |
| `options` | `Intl.DateTimeFormatOptions` | Format overrides |

### formatRelativeTime

| Param | Type | Notes |
|---|---|---|
| `date` | `Date` | Input date |
| `baseDate` | `Date` | Reference date (default `new Date()`) |
| `locale` | `string` | Locale string |

Returns `"just now"`, `"5 minutes ago"`, `"in 2 hours"`, `"last week"`, etc.

### truncateText

| Param | Type | Notes |
|---|---|---|
| `text` | `string` | Input text |
| `maxLength` | `number` | Maximum length before truncation |
| `suffix` | `string` | Truncation suffix (default `"..."`) |

### validateField

| Param | Type | Notes |
|---|---|---|
| `value` | `unknown` | Value to validate |
| `rules` | `ValidationRule[]` | Array of validation rules |
| Returns | `string \| null` | Error message or `null` |

### commonValidators

Pre-built validation functions:

| Validator | Description |
|---|---|
| `required` | Value must not be empty |
| `email` | Must be a valid email address |
| `url` | Must be a valid URL |
| `minLength(n)` | Minimum character length |
| `maxLength(n)` | Maximum character length |
| `pattern(regex)` | Must match regular expression |
| `phone` | Must be a valid phone number |

### announceToScreenReader

Sends a string to the browser's live region for screen reader announcement.

| Param | Type |
|---|---|
| `message` | `string` |

### getAriaProps

Extracts `aria-*` props from a props object.

| Param | Type | Returns |
|---|---|---|
| `props` | `Record<string, unknown>` | `Record<string, string>` |

### generateId

Generates a unique ID string with optional prefix.

| Param | Type | Returns |
|---|---|---|
| `prefix` | `string` (default `"ui"`) | `string` |

---

## `@ui-construction-library/utils` (internal)

Internal infrastructure utilities — not part of the default consumer API path.

### String

| Function | Signature | Description |
|---|---|---|
| `truncate` | `(str: string, max: number, suffix?: string) => string` | Truncates string at word boundary |
| `slugify` | `(text: string) => string` | Converts text to URL-safe slug |
| `capitalize` | `(str: string) => string` | Capitalizes first character |

### Number

| Function | Signature | Description |
|---|---|---|
| `formatNumber` | `(num: number, decimals?: number) => string` | Locale-aware number formatting |
| `random` | `(min: number, max: number) => number` | Random integer in range |
| `clamp` | `(num: number, min: number, max: number) => number` | Constrains value to range |

### Date

| Function | Signature | Description |
|---|---|---|
| `formatDate` | `(date: Date, locale?: string) => string` | Locale-aware date formatting |
| `formatRelative` | `(date: Date, base?: Date, locale?: string) => string` | Relative time string |
| `parseDate` | `(dateStr: string) => Date` | Parses date string to Date object |
| `startOfMonth` | `(date: Date) => Date` | First day of month |
| `endOfMonth` | `(date: Date) => Date` | Last day of month |
| `addDays` | `(date: Date, amount: number) => Date` | Adds days |
| `addMonths` | `(date: Date, amount: number) => Date` | Adds months |
| `subMonths` | `(date: Date, amount: number) => Date` | Subtracts months |
| `startOfWeek` | `(date: Date, weekStartsOn?: number) => Date` | First day of week |
| `endOfWeek` | `(date: Date, weekStartsOn?: number) => Date` | Last day of week |
| `isSameMonth` | `(a: Date, b: Date) => boolean` | Same month check |
| `isSameDay` | `(a: Date, b: Date) => boolean` | Same day check |
| `toDateKey` | `(date: Date) => string` | Date to `YYYY-MM-DD` string |
| `formatCalendar` | `(date: Date, locale?: string) => string` | Calendar header format |

### Object

| Function | Signature | Description |
|---|---|---|
| `omit` | `(obj: T, keys: K[]) => Omit<T, K>` | Removes specified keys |
| `pick` | `(obj: T, keys: K[]) => Pick<T, K>` | Selects specified keys |
| `merge` | `(target: T, source: U) => T & U` | Deep object merge |
