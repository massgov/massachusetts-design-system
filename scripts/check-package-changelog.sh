#!/usr/bin/env bash

set -euo pipefail

BASE_REF="${1:-origin/main}"

changed_files="$(git diff --name-only "${BASE_REF}...HEAD")"

check_package() {
  local package_name="$1"
  local package_path="packages/${package_name}"
  local fragment_pattern="^${package_path}/changelog\\.d/.+\\.md$"
  local template_path="${package_path}/changelog.d/changelog.template.md"

  local package_changes
  package_changes="$(printf '%s\n' "$changed_files" | grep "^${package_path}/" || true)"

  if [[ -z "$package_changes" ]]; then
    echo "No changes detected for ${package_name}."
    return 0
  fi

  local relevant_changes
  relevant_changes="$(printf '%s\n' "$package_changes" | grep -v "^${package_path}/CHANGELOG\\.md$" | grep -v "^${template_path}$" | grep -v "^${package_path}/changelog\\.d/" || true)"

  if [[ -z "$relevant_changes" ]]; then
    echo "Only changelog files changed for ${package_name}."
    return 0
  fi

  if printf '%s\n' "$changed_files" | grep -Eq "^${template_path}$"; then
    echo "Only the changelog template changed for ${package_name}."
    return 0
  fi

  if printf '%s\n' "$changed_files" | grep -Eq "$fragment_pattern"; then
    echo "Found changelog fragment for ${package_name}."
    return 0
  fi

  echo "Missing changelog fragment for ${package_name}."
  echo "Add a markdown file under ${package_path}/changelog.d/ using ${template_path}."
  return 1
}

check_package "assets"
check_package "styles"
check_package "tokens"
