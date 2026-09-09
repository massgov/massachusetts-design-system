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


## 1.2.0 (6/10/2026)

### Added
* Added a Codex skill workflow for comparing and syncing `primitives.css` with Base Tokens Figma variables.
* [DP-47071] Added motion tokens to primitives and semantic variables. #47


## 2.0.0 (7/22/2026)

### Changed
* [DP-145] Replaced composite typography shorthand tokens with longhand typography attribute tokens for font family, font weight, font size, and line height. #77

### Fixed
* [DP-145] Fix mismatched `--mds-text-heading-font-size-lg` value in media query. #77
* [DS-134] Updated mds-border-brand-neutral-high from mds-color-brand-gray-750 to mds-color-brand-gray-800 to meet accessibility criteria. #69

### Removed
* [DP-145] Removed one-off eyebrow text transform and letter spacing tokens, they now live in the styles layer. #77
* [DP-145] Removed unused `--mds-font-family` primitive token. #77
* [DP-361] Removed unused packages/tokens/package-lock.json. #84


## 3.0.0-beta.1 (8/19/2026)

### Changed
* [DS-443] Updated berkshire green 1300 and danger red 300 in primitives, updated interactive brand secondary scale in semantic tokens/index.css. #115
* [DS-381] Updated all color and font tokens to the latest updated tokens from design decisions as of 8/7/26. #105

