# Icons roadmap

## Status

- Current shipped scope: 298 ready icon components exported from `@ui-construction-library/icons`.
- Target production scope: 290 icons across 10 categories.
- Delivery strategy: incremental batches, with naming and consistency rules fixed up front.

## Target scope

| Category | Count |
|---|---:|
| Navigation & direction | 37 |
| Actions & editing | 36 |
| Status & feedback | 34 |
| Users & auth | 29 |
| Files & content | 30 |
| Data & layout | 28 |
| Commerce & finance | 26 |
| Media & devices | 27 |
| Development & brands | 27 |
| Toggles & visibility | 24 |
| Total | 290 |

## Rules

- Use PascalCase component names with the `Icon` suffix only.
- Keep one canonical export name per icon; aliases belong only in metadata and search.
- Add icons as families and directional sets, not as isolated niche glyphs.
- Preserve a single 24x24 canvas, stroke-based construction, and consistent optical balance.
- Maintain searchable metadata for every icon: `name`, `category`, `tags`, `aliases`, `keywords`, `status`.

## Delivery batches

### Batch A

Core application coverage:

- Navigation & direction
- Actions & editing
- Status & feedback
- Users & auth
- Toggles & visibility

### Batch B

Admin and SaaS coverage:

- Files & content
n- Data & layout
- Commerce & finance

### Batch C

Extended product coverage:

- Media & devices
- Development & brands


## Progress snapshot

| Category | Ready now |
|---|---:|
| Navigation & direction | 37 |
| Actions & editing | 36 |
| Status & feedback | 34 |
| Users & auth | 29 |
| Toggles & visibility | 24 |
| Batch A subtotal | 122 |
| Cross-category foundation (`HomeIcon`, `SettingsIcon`) | 2 |
| Total ready | 298 |

## Working checklist

### Planning

- [x] Freeze target scope and categories.
- [x] Freeze implementation rules.
- [x] Define delivery batches.
- [x] Add icon metadata source of truth.
- [ ] Add progress tracking per category.

### Package architecture

- [x] Replace hard-coded build validation with generated or metadata-driven validation.
- [x] Add a source manifest for icon names and categories.
- [x] Keep `index.ts` exports synchronized with the manifest.
- [x] Add tests or checks for duplicate names and missing exports.

### Batch A implementation

- [ ] Navigation & direction
- [ ] Actions & editing
- [ ] Status & feedback
- [ ] Users & auth
- [ ] Toggles & visibility

### Batch B implementation

- [ ] Files & content
- [ ] Data & layout
- [ ] Commerce & finance

### Batch C implementation

- [ ] Media & devices
- [ ] Development & brands

## Batch A initial implementation list

### Navigation & direction

- ArrowUpIcon
- ArrowDownIcon
- ArrowLeftIcon
- ArrowRightIcon
- ChevronUpIcon
- ChevronDownIcon
- ChevronLeftIcon
- ChevronRightIcon
- ExternalLinkIcon
- LinkIcon
- UnlinkIcon
- MoreHorizontalIcon
- MoreVerticalIcon
- MenuIcon
- UndoIcon
- RedoIcon

### Actions & editing

- PlusIcon
- MinusIcon
- XIcon
- CheckIcon
- EditIcon
- PencilIcon
- TrashIcon
- CopyIcon
- SaveIcon
- DownloadIcon
- UploadIcon
- ShareIcon
- SendIcon
- RefreshCwIcon
- SearchIcon

### Status & feedback

- InfoIcon
- AlertTriangleIcon
- AlertCircleIcon
- ClockIcon
- CalendarIcon
- BellIcon
- BellOffIcon
- ActivityIcon
- StarIcon
- HeartIcon

### Users & auth

- UserIcon
- UsersIcon
- UserPlusIcon
- UserMinusIcon
- MailIcon
- MessageCircleIcon
- PhoneIcon
- LockIcon
- UnlockIcon
- LogInIcon
- LogOutIcon

### Toggles & visibility

- EyeIcon
- EyeOffIcon
- MoonIcon
- SunIcon
- MaximizeIcon
- MinimizeIcon
- ToggleLeftIcon
- ToggleRightIcon
- CheckSquareIcon
- SquareIcon
- CircleIcon

## Notes

Start Batch A by shipping the missing directional, CRUD, auth, and visibility primitives first, because they unlock the widest range of components, demos, dashboards, and docs examples.
