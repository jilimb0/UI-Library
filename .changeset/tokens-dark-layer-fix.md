---
'@ui-construction-library/tokens': patch
---

Fix `generateCSSVariables` emitting single-mode values into both theme layers.
The dark `[data-theme="dark"]` block previously shipped light values (e.g.
`--color-background: #ffffff`), breaking any consumer that sets `data-theme`
without ThemeProvider regeneration. Both layers now always carry their own
values; `Theme.mode` is deprecated but accepted for compatibility.
