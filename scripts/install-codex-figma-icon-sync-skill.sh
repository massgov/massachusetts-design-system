#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$REPO_ROOT/.codex/skills/figma-icon-sync"
DEST_DIR="${CODEX_HOME:-$HOME/.codex}/skills/figma-icon-sync"

if [[ ! -f "$SOURCE_DIR/SKILL.md" ]]; then
  echo "Skill source not found: $SOURCE_DIR/SKILL.md" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
cp "$SOURCE_DIR/SKILL.md" "$DEST_DIR/SKILL.md"

echo "Installed figma-icon-sync to $DEST_DIR"
echo "Restart Codex to pick up the updated skill."
