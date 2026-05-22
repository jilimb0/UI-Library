# Components API

Актуальный обзор публичного API `@ui-construction-library/core`.

## Atoms

### Button
- Key props:
  - `variant`, `size`, `loading`, `leftIcon`, `rightIcon`
  - `as` (polymorphic render, например `as="a"`)

### Text / Heading
- Key props:
  - `as` (polymorphic)
  - `Text`: `size`, `weight`
  - `Heading`: `level`

### Switch
- Key props:
  - `checked` / `defaultChecked`
  - `onCheckedChange`
  - `label`, `description`, `size`

### Tag
- Key props:
  - `variant`, `size`, `icon`
  - `onRemove`, `removeLabel`

### Divider
- Key props:
  - `orientation`: `horizontal | vertical`
  - `label`

### Image
- Key props:
  - `src`, `alt`, `fallbackSrc`
  - `aspectRatio`, `loading`

### Code / Kbd
- Inline semantic primitives for docs and developer UIs.

## Molecules

### Pagination
- Key props:
  - `page`, `totalPages`, `onPageChange`
  - `pageSize`, `pageSizeOptions`, `onPageSizeChange`

### Breadcrumb
- Key props:
  - `items[]` (`label`, `href`, `onClick`, `current`)
  - `separator`

### Stepper
- Key props:
  - `steps[]`, `activeStep`, `onStepChange`
  - `orientation`, `linear`

### ComboBox
- Key props:
  - `options[]`, `value`, `onValueChange`
  - `placeholder`

### SearchInput
- Key props:
  - `value`, `onChange`
  - `debounceMs`, `placeholder`

### FileUpload
- Key props:
  - `multiple`, `accept`, `maxSizeMb`
  - `onFilesChange`

### Slider
- Key props:
  - `value`, `onValueChange`
  - `min`, `max`, `step`

### OTPInput
- Key props:
  - `length`, `value`, `onChange`

### Rating
- Key props:
  - `value`, `max`, `icon`, `allowHalf`, `onChange`

### Popover / ContextMenu
- `Popover`: `trigger`, `content`, `side`
- `ContextMenu`: `trigger`, `items[]`

### ColorPicker
- Key props:
  - `value`, `onChange`

## Organisms

### Modal (compound)
- API:
  - `Modal`
  - `Modal.Trigger`
  - `Modal.Content`
  - `Modal.Header`
  - `Modal.Body`
  - `Modal.Footer`
  - `Modal.Close`
  - `Modal.Title`, `Modal.Description`

### Tabs (compound)
- API:
  - `Tabs`
  - `Tabs.List`
  - `Tabs.Trigger`
  - `Tabs.Content`

### Accordion (compound)
- API:
  - `Accordion`
  - `Accordion.Item`
  - `Accordion.Trigger`
  - `Accordion.Content`

### DataTable
- Key props:
  - `data`, `columns`
  - `pageSize`, `pageSizeOptions`

### Sidebar / Drawer
- `Sidebar`: groups/items, collapse, badge counters
- `Drawer`: `open`, `onOpenChange`, `side`, `title`, `description`

### CommandPalette
- Key props:
  - `open`, `onOpenChange`, `groups[]`

### EmptyState
- Key props:
  - `icon`, `title`, `description`, `action`

### Timeline
- Key props:
  - `items[]` (`title`, `description`, `timestamp`, `icon`)

### TreeView
- Key props:
  - `nodes[]`, `onSelect`

### Calendar
- Key props:
  - `events[]`

### Kanban
- Key props:
  - `columns[]`, `onChange`, `renderCard`

## Templates

### DashboardLayout
- `sidebar`, `header`, `children`

### SidebarLayout
- `sidebar`, `children`

### AuthLayout
- `logo`, `title`, `subtitle`, `children`

### DocsLayout
- `navigation`, `children`, `toc`

### MarketingLayout
- `header`, `hero`, `sections`, `footer`, `children`

### StackedLayout
- `navbar`, `children`
