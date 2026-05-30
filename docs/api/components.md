# Components API

Public API overview for `@ui-construction-library/core`.

## Atoms

### Button
| Prop | Type | Notes |
|---|---|---|
| `variant` | `string` | Visual emphasis preset. |
| `size` | `string` | Size preset. |
| `loading` | `boolean` | Shows loading state and prevents interaction. |
| `leftIcon` / `rightIcon` | `ReactNode` | Optional icon slots. |
| `as` | `ElementType` | Polymorphic render target. |

### Text / Heading
| Component | Prop | Type | Notes |
|---|---|---|---|
| `Text` | `as` | `ElementType` | Polymorphic render target. |
| `Text` | `size` | `string` | Typography size preset. |
| `Text` | `weight` | `string` | Font-weight preset. |
| `Heading` | `as` | `ElementType` | Polymorphic render target. |
| `Heading` | `level` | `1|2|3|4|5|6` | Semantic heading level. |

### Switch
| Prop | Type | Notes |
|---|---|---|
| `checked` / `defaultChecked` | `boolean` | Controlled or uncontrolled state. |
| `onCheckedChange` | `(checked: boolean) => void` | Controlled state callback. |
| `label` | `string` | Accessible label text. |
| `description` | `string` | Supporting helper text. |
| `size` | `sm \| default \| md \| lg` | Size preset. |

### Tag
| Prop | Type | Notes |
|---|---|---|
| `variant` | `string` | Visual style variant. |
| `size` | `string` | Size preset. |
| `icon` | `ReactNode` | Optional leading icon. |
| `onRemove` | `(event: React.MouseEvent) => void` | Enables dismiss action. |
| `removeLabel` | `string` | Accessible label for dismiss button. |

### Divider
| Prop | Type | Notes |
|---|---|---|
| `orientation` | `horizontal \| vertical` | Divider direction. |
| `label` | `ReactNode` | Optional labeled separator content. |

### Image
| Prop | Type | Notes |
|---|---|---|
| `src` | `string` | Image source URL. |
| `alt` | `string` | Required accessible alternative text. |
| `fallbackSrc` | `string` | Fallback image if primary source fails. |
| `aspectRatio` | `string` | Layout ratio token. |
| `loading` | `string` | Native loading mode. |

### Code / Kbd
| Component | Purpose |
|---|---|
| `Code` | Inline semantic code styling. |
| `Kbd` | Keyboard shortcut / command-key styling. |

## Molecules

### Pagination
| Prop | Type | Notes |
|---|---|---|
| `page` | `number` | Current page. |
| `totalPages` | `number` | Total page count. |
| `onPageChange` | `(page: number) => void` | Page selection callback. |
| `pageSize` | `number` | Current page size. |
| `pageSizeOptions` | `number[]` | Selectable page sizes. |
| `onPageSizeChange` | `(size: number) => void` | Page size callback. |

### Breadcrumb
| Prop | Type | Notes |
|---|---|---|
| `items` | `BreadcrumbItem[]` | Ordered navigation trail. |
| `separator` | `ReactNode` | Separator between items. |

### Stepper
| Prop | Type | Notes |
|---|---|---|
| `steps` | `Step[]` | Step definitions. |
| `activeStep` | `number` | Current step index. |
| `onStepChange` | `(step: number) => void` | Change callback. |
| `orientation` | `string` | Layout direction. |
| `linear` | `boolean` | Enforces sequential flow. |

### ComboBox
| Prop | Type | Notes |
|---|---|---|
| `options` | `ComboBoxOption[]` | Search options. |
| `value` | `string` | Selected value. |
| `onValueChange` | `(value: string) => void` | Selection callback. |
| `placeholder` | `string` | Input placeholder text. |

### SearchInput
| Prop | Type | Notes |
|---|---|---|
| `value` | `string` | Controlled search value. |
| `onChange` | `(value: string) => void` | Change callback. |
| `debounceMs` | `number` | Debounce interval. |
| `placeholder` | `string` | Input placeholder. |

### FileUpload
| Prop | Type | Notes |
|---|---|---|
| `multiple` | `boolean` | Allow multiple file selection. |
| `accept` | `string` | Native accept filter. |
| `maxSizeMb` | `number` | Maximum file size in megabytes. |
| `onFilesChange` | `(files: File[]) => void` | Selected file callback. |

### Slider
| Prop | Type | Notes |
|---|---|---|
| `value` | `number` | Controlled slider value. |
| `onValueChange` | `(value: number) => void` | Change callback. |
| `min` | `number` | Minimum value. |
| `max` | `number` | Maximum value. |
| `step` | `number` | Increment step. |

### OTPInput
| Prop | Type | Notes |
|---|---|---|
| `length` | `number` | Slot count. |
| `value` | `string` | Controlled OTP value. |
| `onChange` | `(value: string) => void` | Change callback. |

### Rating
| Prop | Type | Notes |
|---|---|---|
| `value` | `number` | Selected rating. |
| `max` | `number` | Maximum score. |
| `icon` | `ReactNode` | Optional rating icon. |
| `allowHalf` | `boolean` | Enables half-step ratings. |
| `onChange` | `(value: number) => void` | Change callback. |

### Popover / ContextMenu
| Component | Key props |
|---|---|
| `Popover` | `trigger`, `content`, `side` |
| `ContextMenu` | `trigger`, `items[]` |

### ColorPicker
| Prop | Type | Notes |
|---|---|---|
| `value` | `string` | Controlled color value. |
| `onChange` | `(value: string) => void` | Change callback. |

## Organisms

### Modal (compound)
| API | Description |
|---|---|
| `Modal` | Root compound component. |
| `Modal.Trigger` | Opens the modal. |
| `Modal.Content` | Dialog content container. |
| `Modal.Header` | Header region. |
| `Modal.Body` | Body region. |
| `Modal.Footer` | Footer actions. |
| `Modal.Close` | Close action. |
| `Modal.Title`, `Modal.Description` | Accessible title/description nodes. |

### Tabs (compound)
| API | Description |
|---|---|
| `Tabs` | Root compound component. |
| `Tabs.List` | Tablist container. |
| `Tabs.Trigger` | Individual tab trigger. |
| `Tabs.Content` | Associated tab panel. |

### Accordion (compound)
| API | Description |
|---|---|
| `Accordion` | Root compound component. |
| `Accordion.Item` | Individual item wrapper. |
| `Accordion.Trigger` | Expand/collapse control. |
| `Accordion.Content` | Collapsible content region. |

### DataTable
| Prop | Type | Notes |
|---|---|---|
| `data` | `T[]` | Table rows. |
| `columns` | `Column[]` | Column definitions. |
| `pageSize` | `number` | Optional pagination size. |
| `pageSizeOptions` | `number[]` | Page size choices. |

### Sidebar / Drawer
| Component | Key props |
|---|---|
| `Sidebar` | `groups`, `items`, `collapse`, `badgeCounters` |
| `Drawer` | `open`, `onOpenChange`, `side`, `title`, `description` |

### CommandPalette
| Prop | Type | Notes |
|---|---|---|
| `open` | `boolean` | Visibility state. |
| `onOpenChange` | `(open: boolean) => void` | Visibility change callback. |
| `groups` | `CommandPaletteGroup[]` | Grouped command items. |

### EmptyState
| Prop | Type | Notes |
|---|---|---|
| `icon` | `ReactNode` | Optional illustration/icon. |
| `title` | `ReactNode` | Main empty-state title. |
| `description` | `ReactNode` | Supporting copy. |
| `action` | `ReactNode` | Primary action slot. |

### Timeline
| Prop | Type | Notes |
|---|---|---|
| `items` | `TimelineItem[]` | Ordered timeline entries. |

### TreeView
| Prop | Type | Notes |
|---|---|---|
| `nodes` | `TreeNode[]` | Tree node structure. |
| `onSelect` | `(nodeId: string) => void` | Selection callback. |

### Calendar
| Prop | Type | Notes |
|---|---|---|
| `events` | `CalendarEvent[]` | Calendar events keyed by date. |

### Kanban
| Prop | Type | Notes |
|---|---|---|
| `columns` | `KanbanColumn[]` | Board columns. |
| `onChange` | `(columns: KanbanColumn[]) => void` | Board change callback. |
| `renderCard` | `(card) => ReactNode` | Custom card renderer. |

## Templates

### DashboardLayout
| Prop | Type | Notes |
|---|---|---|
| `sidebar` | `ReactNode` | Sidebar slot. |
| `header` | `ReactNode` | Header slot. |
| `children` | `ReactNode` | Main layout content. |

### SidebarLayout
| Prop | Type | Notes |
|---|---|---|
| `sidebar` | `ReactNode` | Sidebar slot. |
| `children` | `ReactNode` | Main layout content. |

### AuthLayout
| Prop | Type | Notes |
|---|---|---|
| `logo` | `ReactNode` | Logo slot. |
| `title` | `ReactNode` | Screen title. |
| `subtitle` | `ReactNode` | Supporting subtitle copy. |
| `children` | `ReactNode` | Layout body. |

### DocsLayout
| Prop | Type | Notes |
|---|---|---|
| `navigation` | `ReactNode` | Primary navigation slot. |
| `children` | `ReactNode` | Content area. |
| `toc` | `ReactNode` | Table-of-contents slot. |

### MarketingLayout
| Prop | Type | Notes |
|---|---|---|
| `header` | `ReactNode` | Top navigation/header slot. |
| `hero` | `ReactNode` | Hero section slot. |
| `sections` | `ReactNode` | Supporting content sections. |
| `footer` | `ReactNode` | Footer slot. |
| `children` | `ReactNode` | Main layout content. |

### StackedLayout
| Prop | Type | Notes |
|---|---|---|
| `navbar` | `ReactNode` | Top navigation slot. |
| `children` | `ReactNode` | Stacked layout body. |
