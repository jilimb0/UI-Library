#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

TMP_CHECK_OUTPUT="$(mktemp)"
TMP_CHECK_JSON="$(mktemp)"
SELECTED_OPTION=""
cleanup() {
  rm -f "$TMP_CHECK_OUTPUT" "$TMP_CHECK_JSON"
}
trap cleanup EXIT

# ── interactive arrow-key menu ─────────────────────────────────────────────────
select_option() {
  local prompt="$1"
  shift
  local options=("$@")
  local selected=0
  local count=${#options[@]}
  local key

  while true; do
    printf '\033[2J\033[H' > /dev/tty
    printf '%s\n\n' "$prompt" > /dev/tty
    for i in "${!options[@]}"; do
      if [ "$i" -eq "$selected" ]; then
        printf '  \u276f %s\n' "${options[$i]}" > /dev/tty
      else
        printf '    %s\n' "${options[$i]}" > /dev/tty
      fi
    done
    IFS= read -rsn1 key </dev/tty
    if [[ "$key" == $'\x1b' ]]; then
      IFS= read -rsn2 key </dev/tty
      case "$key" in
        '[A') selected=$(( (selected - 1 + count) % count )) ;;
        '[B') selected=$(( (selected + 1) % count )) ;;
      esac
    elif [[ "$key" == '' || "$key" == $'\n' ]]; then
      SELECTED_OPTION="${options[$selected]}"
      printf '\033[2J\033[H' > /dev/tty
      return 0
    fi
  done
}

# ── collect structured check results ────────────────────────────────────────────
run_check() {
  echo "[stable] checking published code freshness"
  set +e
  node ./scripts/checks/check-published-code.js | tee "$TMP_CHECK_OUTPUT"
  CHECK_EXIT=$?
  set -e
  node ./scripts/checks/check-published-code.js --json > "$TMP_CHECK_JSON" 2>/dev/null || true
}

# ── preview: show what changelogs will look like after bump ────────────────────
preview_changelogs() {
  local bump_type="$1"
  echo
  echo "[stable] dry-run bump preview ($bump_type):"
  node ./scripts/utils/bump-package-versions.js --bump="$bump_type" --dry-run < "$TMP_CHECK_JSON"
  echo
  echo "[stable] current CHANGELOG.md snapshots:"
  for pkg_dir in packages/*/CHANGELOG.md packages/integrations/*/CHANGELOG.md; do
    [ -f "$pkg_dir" ] || continue
    echo
    echo "  ┌─ $pkg_dir"
    head -20 "$pkg_dir" | sed 's/^/  │ /'
    echo "  └─"
  done
  echo
}

# ───────────────────────────────────────────────────────────────────────
echo "[stable] platform preflight"
pnpm release:preflight
pnpm check:deps
pnpm check:api

echo "[stable] build workspace"
pnpm build

run_check

if [ "${CHECK_EXIT:-1}" -eq 0 ]; then
  echo "[stable] all published packages already match local code — nothing to do"
  exit 0
fi

NEEDS_PUBLISH="$(grep -E '^(UNPUBLISHED|OUTDATED|CODE_MISMATCH|BROKEN_NPM)' "$TMP_CHECK_OUTPUT" || true)"
if [ -z "$NEEDS_PUBLISH" ]; then
  echo "[stable] check failed but no actionable packages found"
  exit 1
fi

echo
echo "[stable] packages requiring attention:"
printf '%s\n' "$NEEDS_PUBLISH"
echo

# ── confirm publish ───────────────────────────────────────────────────────────────
while true; do
  select_option '[stable] publish actionable packages?' \
    'Publish' \
    'Preview changelogs' \
    'Cancel'
  echo "[stable] selected: $SELECTED_OPTION"

  case "$SELECTED_OPTION" in
    'Publish') break ;;
    'Preview changelogs')
      select_option '[stable] select bump type for preview:' 'patch' 'minor' 'major'
      preview_changelogs "$SELECTED_OPTION"
      ;;
    'Cancel')
      echo "[stable] cancelled"
      exit 1
      ;;
  esac
done

# ── select bump ───────────────────────────────────────────────────────────────────
while true; do
  select_option '[stable] select bump type:' 'patch' 'minor' 'major'
  BUMP_CHOICE="$SELECTED_OPTION"
  echo "[stable] bump type: $BUMP_CHOICE"

  select_option "[stable] confirm bump: $BUMP_CHOICE" \
    'Confirm' \
    'Change' \
    'Cancel'
  case "$SELECTED_OPTION" in
    'Confirm') break ;;
    'Change')  continue ;;
    'Cancel')
      echo "[stable] cancelled"
      exit 1
      ;;
  esac
done

# ── bump versions + regenerate changelogs ────────────────────────────────────────
echo "[stable] bumping versions ($BUMP_CHOICE) and regenerating changelogs"
node ./scripts/utils/bump-package-versions.js --bump="$BUMP_CHOICE" < "$TMP_CHECK_JSON"

# ── publish to npm ───────────────────────────────────────────────────────────────
echo "[stable] publishing to npm --tag latest"
pnpm -r --filter "./packages/**" publish --access public --tag latest --no-git-checks

# ── git tag + push ────────────────────────────────────────────────────────────────
echo "[stable] creating git tags"
TAGGED_PACKAGES=()

for pkg_dir in packages/*/package.json packages/integrations/*/package.json; do
  [ -f "$pkg_dir" ] || continue
  PKG_NAME="$(node -p "require('./$pkg_dir').name" 2>/dev/null || true)"
  PKG_VER="$(node -p "require('./$pkg_dir').version" 2>/dev/null || true)"

  [ -z "$PKG_NAME" ] || [ -z "$PKG_VER" ] && continue
  # only tag packages in our scope
  echo "$PKG_NAME" | grep -q '@ui-construction-library/' || continue

  TAG="${PKG_NAME}@${PKG_VER}"
  if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "[stable] tag already exists: $TAG — skipping"
  else
    git tag "$TAG" -m "release: $TAG"
    echo "[stable] tagged: $TAG"
    TAGGED_PACKAGES+=("$TAG")
  fi
done

if [ ${#TAGGED_PACKAGES[@]} -eq 0 ]; then
  echo "[stable] no new tags created"
else
  echo "[stable] pushing tags to origin"
  git push origin --tags
  echo "[stable] pushed ${#TAGGED_PACKAGES[@]} tag(s): ${TAGGED_PACKAGES[*]}"
fi

echo "[stable] done"
