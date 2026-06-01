#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

TMP_CHECK_JSON="$(mktemp)"
SELECTED_OPTION=""
cleanup() {
  rm -f "$TMP_CHECK_JSON"
}
trap cleanup EXIT

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
        printf '  ❯ %s\n' "${options[$i]}" > /dev/tty
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

if [[ "${1:-}" == --bump=* ]]; then
  BUMP_CHOICE="${1#--bump=}"
  case "$BUMP_CHOICE" in
    patch|minor|major) ;;
    *)
      echo "[release:prepare] invalid --bump value: $BUMP_CHOICE"
      exit 1
      ;;
  esac
else
  select_option '[release:prepare] select bump type:' 'patch' 'minor' 'major'
  BUMP_CHOICE="$SELECTED_OPTION"
fi

echo "[release:prepare] bumping versions ($BUMP_CHOICE) and regenerating changelogs"
set +e
node ./scripts/check-published-code.js --json > "$TMP_CHECK_JSON"
CHECK_EXIT=$?
set -e

if [[ "$CHECK_EXIT" -ne 0 && "$CHECK_EXIT" -ne 1 ]]; then
  echo "[release:prepare] check-published-code failed with exit code $CHECK_EXIT"
  exit "$CHECK_EXIT"
fi

node ./scripts/bump-package-versions.js --bump="$BUMP_CHOICE" < "$TMP_CHECK_JSON"

echo "[release:prepare] done — versions and changelogs prepared with $BUMP_CHOICE bump"
