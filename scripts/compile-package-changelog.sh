#!/usr/bin/env bash

set -euo pipefail

usage() {
  echo "Usage: $0 <package-path> [version] [date]"
  echo "Example: $0 packages/assets 1.1.1 2/17/2026"
}

if [[ $# -lt 1 || $# -gt 3 ]]; then
  usage
  exit 1
fi

package_path="${1%/}"
package_json="${package_path}/package.json"
changelog_path="${package_path}/CHANGELOG.md"
fragments_dir="${package_path}/changelog.d"
template_path="${fragments_dir}/changelog.template.md"

if [[ ! -f "$package_json" ]]; then
  echo "Missing package.json at ${package_json}."
  exit 1
fi

if [[ ! -f "$changelog_path" ]]; then
  echo "Missing CHANGELOG.md at ${changelog_path}."
  exit 1
fi

if [[ ! -d "$fragments_dir" ]]; then
  echo "Missing changelog fragments directory at ${fragments_dir}."
  exit 1
fi

version="${2:-$(node -p "try { require('./${package_json}').version || '' } catch { '' }")}"
release_date="${3:-$(date +%-m/%-d/%Y)}"

if [[ -z "$version" ]]; then
  echo "No version provided and no version found in ${package_json}."
  exit 1
fi

shopt -s nullglob
fragment_files=("${fragments_dir}"/*.md)
shopt -u nullglob

filtered_fragments=()
for file in "${fragment_files[@]}"; do
  if [[ "$file" != "$template_path" ]]; then
    filtered_fragments+=("$file")
  fi
done

if [[ ${#filtered_fragments[@]} -eq 0 ]]; then
  echo "No changelog fragments found in ${fragments_dir}."
  exit 1
fi

tmp_section="$(mktemp)"
tmp_changelog="$(mktemp)"
trap 'rm -f "$tmp_section" "$tmp_changelog"' EXIT

awk '
  BEGIN {
    order[1] = "Added"
    order[2] = "Changed"
    order[3] = "Fixed"
    order[4] = "Removed"
  }
  /^##[[:space:]]+(Added|Changed|Fixed|Removed)[[:space:]]*$/ {
    current = $2
    next
  }
  /^[*-][[:space:]]+/ {
    if (current != "") {
      sub(/^[*-][[:space:]]+/, "", $0)
      entries[current] = entries[current] "* " $0 "\n"
    }
    next
  }
  END {
    for (i = 1; i <= 4; i++) {
      type = order[i]
      if (entries[type] != "") {
        print "### " type
        printf "%s", entries[type]
        print ""
      }
    }
  }
' "${filtered_fragments[@]}" > "$tmp_section"

if [[ ! -s "$tmp_section" ]]; then
  echo "No valid changelog entries found in ${fragments_dir}."
  echo "Each fragment should contain a section like:"
  echo "## Added"
  echo "- [DP-12345] Added a new icon \`translate\`. #6"
  exit 1
fi

{
  echo "## ${version} (${release_date})"
  echo
  cat "$tmp_section"
} > "${tmp_section}.release"
mv "${tmp_section}.release" "$tmp_section"

awk -v release_file="$tmp_section" '
  {
    print
    if ($0 == "## Unreleased" && inserted == 0) {
      print ""
      while ((getline line < release_file) > 0) {
        print line
      }
      close(release_file)
      inserted = 1
    }
  }
  END {
    if (inserted == 0) {
      print ""
      while ((getline line < release_file) > 0) {
        print line
      }
      close(release_file)
    }
  }
' "$changelog_path" > "$tmp_changelog"

mv "$tmp_changelog" "$changelog_path"

echo "Compiled changelog fragments into ${changelog_path} for version ${version} (${release_date})."

for file in "${filtered_fragments[@]}"; do
  rm -f "$file"
done

echo "Removed released fragment files from ${fragments_dir}."
