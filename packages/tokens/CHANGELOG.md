# Changelog

All notable changes to `@massds/mds-assets` are auto-compiled in this file. See [how to add a changelog](packages/tokens/README.md#changelogs)

## 1.0.0 (4/13/2026)

### Added
* Initial creation of the tokens.
* [DP-45882] Added linting to the CSS and HTML files. #16
* [DP-45888] Added npm packaging, dist generation, and a GitHub Actions publish workflow for the tokens package. #18

### Fixed
* [DP-46073] Fix breakpoint order to avoid unintentional overrides. #21
* [DP-46073] Add missing breakpoint variables and use max-width instead of min-width for media queries to match Figma breakpoint usage, set default values for full screen size coverage. #22

### Removed
* [DP-45882] Cleaned up duplicated primitive tokens. #16


## 1.1.0 (5/26/2026)

### Added
* [DP-46579] Added line height tokens to semantic token file #38
* [DP-46621] Add specific context variables for static colors, with updates to related styles. Update primitives to match latest variables in Figma.

### Fixed
* [DP-46214] Fix mismatching primitive token names. #30
* [DP-46814] Updated to latest value for static black #41

### Removed
* [DP-47113] Remove tokens empty lines at the end of file. #45

