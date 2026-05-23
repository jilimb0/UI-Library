#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPORT_DIR="${ROOT_DIR}/artifacts"
REPORT_FILE="${REPORT_DIR}/contract-compliance.md"

mkdir -p "${REPORT_DIR}"

components=(
  "Dropdown"
  "ContextMenu"
  "DatePicker"
  "Tooltip"
  "Popover"
  "Toast"
  "Kanban"
)

echo "# Contract Compliance Report" > "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"
echo "- Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "${REPORT_FILE}"
echo "- Scope: packages/core contracted components (W3-W4)" >> "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"
echo "| Component | Behavior Test | A11y Test | Keyboard/Focus Test | Status |" >> "${REPORT_FILE}"
echo "| --- | --- | --- | --- | --- |" >> "${REPORT_FILE}"

for component in "${components[@]}"; do
  component_dir="${ROOT_DIR}/packages/core/src/components"

  behavior="❌"
  a11y="❌"
  keyboard="❌"

  if rg -q "${component}" "${component_dir}" -g "**/${component}/${component}.test.tsx"; then
    behavior="✅"
  fi

  if rg -q "axe\\(|toHaveNoViolations" "${component_dir}" -g "**/${component}/*.test.tsx" -g "**/${component}/*.a11y.test.tsx"; then
    a11y="✅"
  fi

  if rg -q "Arrow|Escape|Enter|onKeyDown|keyboard|focus" "${component_dir}" -g "**/${component}/*.test.tsx" -g "**/${component}/*.keyboard.test.tsx"; then
    keyboard="✅"
  fi

  status="⚠️"
  if [[ "${behavior}" == "✅" && "${a11y}" == "✅" && "${keyboard}" == "✅" ]]; then
    status="✅"
  fi

  echo "| ${component} | ${behavior} | ${a11y} | ${keyboard} | ${status} |" >> "${REPORT_FILE}"
done

echo "" >> "${REPORT_FILE}"
echo "Report path: ${REPORT_FILE}"
echo "[contract-compliance] Report generated at ${REPORT_FILE}"
