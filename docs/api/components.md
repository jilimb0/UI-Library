# Components API

Public API overview for `@ui-construction-library/core`.

## Atoms

### Avatar

| Prop | Type | Notes |
|---|---|---|
| `src` | `string` | Image source URL |
| `alt` | `string` | Accessible alternative text |
| `size` | `sm \| md \| lg` | Size preset |
| `fallback` | `ReactNode` | Shown when image fails or is loading |
| `status` | `online \| offline \| away \| busy` | Presence indicator dot |

### Badge

| Prop | Type | Notes |
|---|---|---|
| `variant` | `default \| secondary \| outline \| destructive` | Visual style variant |
| `size` | `sm \| md \| lg` | Size preset |
| `children` | `ReactNode` | Badge content |

### Button

| Prop | Type | Notes |
|---|---|---|
| `variant` | `default \| primary \| secondary \| outline \| ghost \| danger \| link` | Visual emphasis preset |
| `size` | `sm \| md \| lg` | Size preset |
| `loading` | `boolean` | Shows loading spinner and prevents interaction |
| `leftIcon` / `rightIcon` | `ReactNode` | Optional icon slots |
| `as` | `ElementType` | Polymorphic render target (e.g., `a`, `Link`) |
| `asChild` | `boolean` | Delegate rendering to child element |

### Checkbox

| Prop | Type | Notes |
|---|---|---|
| `checked` / `defaultChecked` | `boolean` | Controlled or uncontrolled state |
| `onCheckedChange` | `(checked: boolean) => void` | State change callback |
| `indeterminate` | `boolean` | Tri-state indicator |
| `label` | `string` | Accessible label text |
| `description` | `string` | Supporting helper text |
| `disabled` | `boolean` | Prevents interaction |

### Code

| Prop | Type | Notes |
|---|---|---|
| `children` | `string` | Inline code content |
| `variant` | `inline \| block` | Display mode |

### Divider

| Prop | Type | Notes |
|---|---|---|
| `orientation` | `horizontal \| vertical` | Divider direction |
| `label` | `ReactNode` | Optional labeled separator content |

### Heading

| Prop | Type | Notes |
|---|---|---|
| `as` | `ElementType` | Polymorphic render target |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | Semantic heading level |

### Icon

| Prop | Type | Notes |
|---|---|---|
| `name` | `IconName` | Icon identifier from manifest |
| `size` | `number \| string` | Width and height in pixels |
| `color` | `string` | Fill or stroke colour |

### Image

| Prop | Type | Notes |
|---|---|---|
| `src` | `string` | Image source URL |
| `alt` | `string` | Required accessible alternative text |
| `fallbackSrc` | `string` | Fallback image if primary source fails |
| `aspectRatio` | `string` | Layout ratio token |
| `loading` | `string` | Native loading mode (`lazy` / `eager`) |

### Input

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Accessible label text |
| `type` | `string` | Native input type (`text`, `email`, `password`, etc.) |
| `placeholder` | `string` | Placeholder text |
| `description` | `string` | Supporting helper text |
| `error` | `string` | Error message (sets `aria-invalid`) |
| `leftIcon` / `rightIcon` | `ReactNode` | Icon slots inside the input |

### Kbd

| Prop | Type | Notes |
|---|---|---|
| `children` | `string` | Keyboard shortcut text |

### Link

| Prop | Type | Notes |
|---|---|---|
| `href` | `string` | Target URL |
| `variant` | `default \| subtle \| underline` | Visual style |
| `external` | `boolean` | Adds target="_blank" rel="noopener noreferrer" |

### Progress

| Prop | Type | Notes |
|---|---|---|
| `value` | `number` | Current progress (0-100) |
| `max` | `number` | Maximum value (default 100) |
| `size` | `sm \| md \| lg` | Thickness preset |
| `variant` | `default \| success \| warning \| error` | Colour variant |

### RadioButton / RadioGroup

| Prop | Type | Notes |
|---|---|---|
| `value` | `string` | Radio value |
| `name` | `string` | Group name |
| `label` | `string` | Accessible label |
| `checked` | `boolean` | Selected state |
| `onChange` | `(value: string) => void` | Selection callback |

### Select

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Accessible label text |
| `options` | `{ value: string; label: string }[]` | Selectable options |
| `placeholder` | `string` | Default unselected text |
| `error` | `string` | Error message |
| `description` | `string` | Supporting helper text |

### Skeleton

| Prop | Type | Notes |
|---|---|---|
| `variant` | `text \| circular \| rectangular` | Shape preset |
| `width` | `string \| number` | Width |
| `height` | `string \| number` | Height |

### Spinner

| Prop | Type | Notes |
|---|---|---|
| `size` | `sm \| md \| lg` | Size preset |
| `color` | `string` | Stroke colour |
| `label` | `string` | Accessible loading label |

### Switch

| Prop | Type | Notes |
|---|---|---|
| `checked` / `defaultChecked` | `boolean` | Controlled or uncontrolled state |
| `onCheckedChange` | `(checked: boolean) => void` | State change callback |
| `label` | `string` | Accessible label text |
| `description` | `string` | Supporting helper text |
| `size` | `sm \| md \| lg` | Size preset |

### Tag

| Prop | Type | Notes |
|---|---|---|
| `variant` | `default \| primary \| success \| warning \| error` | Visual style variant |
| `size` | `sm \| md \| lg` | Size preset |
| `icon` | `ReactNode` | Optional leading icon |
| `onRemove` | `(event: React.MouseEvent) => void` | Enables dismiss action |
| `removeLabel` | `string` | Accessible label for dismiss button |

### Text

| Prop | Type | Notes |
|---|---|---|
| `as` | `ElementType` | Polymorphic render target |
| `size` | `xs \| sm \| md \| lg \| xl` | Typography size preset |
| `weight` | `normal \| medium \| semibold \| bold` | Font-weight preset |
| `color` | `default \| muted \| success \| warning \| error` | Colour preset |

### TextArea

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Accessible label text |
| `placeholder` | `string` | Placeholder text |
| `description` | `string` | Supporting helper text |
| `error` | `string` | Error message |
| `rows` | `number` | Visible row count |

## Molecules

### Accordion

| Prop | Type | Notes |
|---|---|---|
| `type` | `single \| multiple` | Allow multiple items open |
| `defaultValue` | `string \| string[]` | Initially open item(s) |
| `items` | `AccordionItem[]` | Item definitions |

### Alert

| Prop | Type | Notes |
|---|---|---|
| `variant` | `info \| success \| warning \| error` | Severity preset |
| `title` | `string` | Alert heading |
| `children` | `ReactNode` | Alert body content |
| `icon` | `ReactNode` | Custom icon override |
| `onClose` | `() => void` | Enables dismiss action |

### Breadcrumb

| Prop | Type | Notes |
|---|---|---|
| `items` | `BreadcrumbItem[]` | Ordered navigation trail |
| `separator` | `ReactNode` | Separator between items |

### Card

| Prop | Type | Notes |
|---|---|---|
| `variant` | `default \| elevated \| outline \| flat` | Visual style |
| `padding` | `none \| sm \| md \| lg` | Inner padding preset |
| `children` | `ReactNode` | Card content |

### ColorPicker

| Prop | Type | Notes |
|---|---|---|
| `value` | `string` | Controlled color value |
| `onChange` | `(value: string) => void` | Change callback |
| `presets` | `string[]` | Quick-select colour presets |

### ComboBox

| Prop | Type | Notes |
|---|---|---|
| `options` | `ComboBoxOption[]` | Searchable options |
| `value` | `string` | Selected value |
| `onValueChange` | `(value: string) => void` | Selection callback |
| `placeholder` | `string` | Input placeholder text |
| `creatable` | `boolean` | Allow custom values not in options |

### ContextMenu

| Prop | Type | Notes |
|---|---|---|
| `trigger` | `ReactNode` | Target element |
| `items` | `ContextMenuItem[]` | Menu items with optional submenus |

### DatePicker

| Prop | Type | Notes |
|---|---|---|
| `value` / `defaultValue` | `Date` | Controlled or uncontrolled date |
| `onChange` | `(date: Date) => void` | Date selection callback |
| `minDate` / `maxDate` | `Date` | Allowed date range |
| `locale` | `string` | Locale string for i18n |

### Dialog

| Prop | Type | Notes |
|---|---|---|
| `open` / `defaultOpen` | `boolean` | Visibility state |
| `onOpenChange` | `(open: boolean) => void` | Visibility callback |
| `children` | `ReactNode` | Dialog content |

### Dropdown

| Prop | Type | Notes |
|---|---|---|
| `items` | `DropdownItem[]` | Selectable items |
| `value` | `string` | Selected value |
| `onChange` | `(value: string) => void` | Selection callback |
| `open` / `defaultOpen` | `boolean` | Controlled open state |
| `size` | `sm \| md \| lg` | Size preset |

### Field

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Field label |
| `description` | `string` | Helper text |
| `error` | `string` | Validation error |
| `required` | `boolean` | Adds required indicator |
| `children` | `ReactNode` | Form control slot |

### FileUpload

| Prop | Type | Notes |
|---|---|---|
| `multiple` | `boolean` | Allow multiple file selection |
| `accept` | `string` | Native accept filter |
| `maxSizeMb` | `number` | Maximum file size in MB |
| `onFilesChange` | `(files: File[]) => void` | Selected file callback |
| `disabled` | `boolean` | Prevents interaction |

### MenuItem

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Menu item text |
| `icon` | `ReactNode` | Leading icon |
| `shortcut` | `string` | Keyboard shortcut display |
| `onSelect` | `() => void` | Selection callback |
| `disabled` | `boolean` | Prevents interaction |

### OTPInput

| Prop | Type | Notes |
|---|---|---|
| `length` | `number` | Digit slot count |
| `value` | `string` | Controlled OTP value |
| `onChange` | `(value: string) => void` | Change callback |
| `disabled` | `boolean` | Prevents interaction |

### Pagination

| Prop | Type | Notes |
|---|---|---|
| `page` | `number` | Current page |
| `totalPages` | `number` | Total page count |
| `onPageChange` | `(page: number) => void` | Page selection callback |
| `pageSize` | `number` | Current page size |
| `pageSizeOptions` | `number[]` | Selectable page sizes |
| `onPageSizeChange` | `(size: number) => void` | Page size callback |

### Popover

| Prop | Type | Notes |
|---|---|---|
| `trigger` | `ReactNode` | Target element |
| `content` | `ReactNode` | Popover content |
| `side` | `top \| right \| bottom \| left` | Preferred placement |
| `open` / `defaultOpen` | `boolean` | Controlled open state |
| `size` | `sm \| md \| lg` | Width preset |

### Rating

| Prop | Type | Notes |
|---|---|---|
| `value` | `number` | Selected rating |
| `max` | `number` | Maximum score |
| `icon` | `ReactNode` | Optional rating icon |
| `allowHalf` | `boolean` | Enables half-step ratings |
| `onChange` | `(value: number) => void` | Change callback |

### SearchInput

| Prop | Type | Notes |
|---|---|---|
| `value` | `string` | Controlled search value |
| `onChange` | `(value: string) => void` | Change callback |
| `debounceMs` | `number` | Debounce interval |
| `placeholder` | `string` | Input placeholder |
| `onClear` | `() => void` | Clear action callback |

### Slider

| Prop | Type | Notes |
|---|---|---|
| `value` | `number` | Controlled slider value |
| `onValueChange` | `(value: number) => void` | Change callback |
| `min` | `number` | Minimum value |
| `max` | `number` | Maximum value |
| `step` | `number` | Increment step |
| `label` | `string` | Accessible label |

### Stepper

| Prop | Type | Notes |
|---|---|---|
| `steps` | `Step[]` | Step definitions |
| `activeStep` | `number` | Current step index |
| `onStepChange` | `(step: number) => void` | Change callback |
| `orientation` | `horizontal \| vertical` | Layout direction |
| `linear` | `boolean` | Enforces sequential flow |

### Tabs

| Prop | Type | Notes |
|---|---|---|
| `value` / `defaultValue` | `string` | Controlled or uncontrolled tab |
| `onValueChange` | `(value: string) => void` | Tab selection callback |
| `variant` | `underline \| pills \| buttons` | Visual style |

### Toast

| Prop | Type | Notes |
|---|---|---|
| `variant` | `info \| success \| warning \| error` | Severity preset |
| `title` | `string` | Toast heading |
| `description` | `string` | Supporting body text |
| `duration` | `number` | Auto-dismiss timeout (ms) |
| `onClose` | `() => void` | Dismiss callback |
| `action` | `{ label: string; onClick: () => void }` | Primary action |

### Tooltip

| Prop | Type | Notes |
|---|---|---|
| `content` | `ReactNode` | Tooltip text/content |
| `side` | `top \| right \| bottom \| left` | Preferred placement |
| `delay` | `number` | Show delay (ms) |
| `children` | `ReactNode` | Target element |

## Organisms

### Accordion (compound)

| API | Description |
|---|---|
| `Accordion` | Root compound component |
| `Accordion.Item` | Individual item wrapper |
| `Accordion.Trigger` | Expand/collapse control |
| `Accordion.Content` | Collapsible content region |

### AppShell

| Prop | Type | Notes |
|---|---|---|
| `sidebar` | `ReactNode` | Sidebar slot |
| `header` | `ReactNode` | Top bar slot |
| `children` | `ReactNode` | Main content area |

### Calendar

| Prop | Type | Notes |
|---|---|---|
| `events` | `CalendarEvent[]` | Calendar events keyed by date |
| `view` | `month \| week \| day` | Calendar view mode |
| `onEventClick` | `(event: CalendarEvent) => void` | Event selection callback |

### CommandPalette

| Prop | Type | Notes |
|---|---|---|
| `open` | `boolean` | Visibility state |
| `onOpenChange` | `(open: boolean) => void` | Visibility callback |
| `groups` | `CommandPaletteGroup[]` | Grouped command items |

### DataTable

| Prop | Type | Notes |
|---|---|---|
| `data` | `T[]` | Table rows |
| `columns` | `Column<T>[]` | Column definitions |
| `pageSize` | `number` | Optional pagination size (default 10) |
| `pageSizeOptions` | `number[]` | Page size choices |
| `sortable` | `boolean` | Enables column sorting |

### Drawer

| Prop | Type | Notes |
|---|---|---|
| `open` | `boolean` | Visibility state |
| `onOpenChange` | `(open: boolean) => void` | Visibility callback |
| `side` | `left \| right` | Slide-in direction |
| `title` | `string` | Drawer heading |
| `description` | `string` | Supporting text |

### EmptyState

| Prop | Type | Notes |
|---|---|---|
| `icon` | `ReactNode` | Optional illustration/icon |
| `title` | `ReactNode` | Main empty-state title |
| `description` | `ReactNode` | Supporting copy |
| `action` | `ReactNode` | Primary action slot |

### Form

| Prop | Type | Notes |
|---|---|---|
| `onSubmit` | `(data: Record<string, unknown>) => void` | Submit handler |
| `children` | `ReactNode` | Form fields |
| `validation` | `Record<string, string[]>` | Validation errors map |

### Modal (compound)

| API | Description |
|---|---|
| `Modal` | Root compound component |
| `Modal.Trigger` | Opens the modal |
| `Modal.Content` | Dialog content container |
| `Modal.Header` | Header region |
| `Modal.Body` | Body region |
| `Modal.Footer` | Footer actions |
| `Modal.Close` | Close action |
| `Modal.Title` | Accessible title node |
| `Modal.Description` | Accessible description node |

### Navigation

| Prop | Type | Notes |
|---|---|---|
| `items` | `NavigationItem[]` | Navigation tree |
| `activePath` | `string` | Current active route |
| `onNavigate` | `(path: string) => void` | Navigation callback |

### PageHeader

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Page title |
| `description` | `ReactNode` | Page description |
| `actions` | `ReactNode` | Action buttons slot |
| `breadcrumb` | `BreadcrumbItem[]` | Optional breadcrumb trail |

### Sidebar

| Prop | Type | Notes |
|---|---|---|
| `groups` | `SidebarGroup[]` | Navigation groups |
| `collapse` | `boolean` | Collapsed/expanded state |
| `badgeCounters` | `Record<string, number>` | Notification badges |

### Table

| Prop | Type | Notes |
|---|---|---|
| `data` | `T[]` | Table rows |
| `columns` | `Column<T>[]` | Column definitions |
| `onRowClick` | `(row: T) => void` | Row selection callback |

### Tabs (compound)

| API | Description |
|---|---|
| `Tabs` | Root compound component |
| `Tabs.List` | Tablist container |
| `Tabs.Trigger` | Individual tab trigger |
| `Tabs.Content` | Associated tab panel |

### Timeline

| Prop | Type | Notes |
|---|---|---|
| `items` | `TimelineItem[]` | Ordered timeline entries |

### TopNav

| Prop | Type | Notes |
|---|---|---|
| `items` | `TopNavItem[]` | Navigation links |
| `activePath` | `string` | Current active route |
| `logo` | `ReactNode` | Brand logo slot |

### TreeView

| Prop | Type | Notes |
|---|---|---|
| `nodes` | `TreeNode[]` | Tree node structure |
| `onSelect` | `(nodeId: string) => void` | Selection callback |
| `defaultExpandedIds` | `string[]` | Initially expanded nodes |

### Kanban

| Prop | Type | Notes |
|---|---|---|
| `columns` | `KanbanColumn[]` | Board columns |
| `onChange` | `(columns: KanbanColumn[]) => void` | Board change callback |
| `renderCard` | `(card: KanbanCard) => ReactNode` | Custom card renderer |

## Templates

### DashboardLayout

| Prop | Type | Notes |
|---|---|---|
| `sidebar` | `ReactNode` | Sidebar slot |
| `header` | `ReactNode` | Header slot |
| `children` | `ReactNode` | Main layout content |

### SidebarLayout

| Prop | Type | Notes |
|---|---|---|
| `sidebar` | `ReactNode` | Sidebar slot |
| `children` | `ReactNode` | Main layout content |

### AuthLayout

| Prop | Type | Notes |
|---|---|---|
| `logo` | `ReactNode` | Logo slot |
| `title` | `ReactNode` | Screen title |
| `subtitle` | `ReactNode` | Supporting subtitle copy |
| `children` | `ReactNode` | Layout body |

### DocsLayout

| Prop | Type | Notes |
|---|---|---|
| `navigation` | `ReactNode` | Primary navigation slot |
| `children` | `ReactNode` | Content area |
| `toc` | `ReactNode` | Table-of-contents slot |

### MarketingLayout

| Prop | Type | Notes |
|---|---|---|
| `header` | `ReactNode` | Top navigation/header slot |
| `hero` | `ReactNode` | Hero section slot |
| `sections` | `ReactNode` | Supporting content sections |
| `footer` | `ReactNode` | Footer slot |
| `children` | `ReactNode` | Main layout content |

### StackedLayout

| Prop | Type | Notes |
|---|---|---|
| `navbar` | `ReactNode` | Top navigation slot |
| `children` | `ReactNode` | Stacked layout body |
