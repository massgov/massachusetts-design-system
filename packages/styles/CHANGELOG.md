# Changelog

All notable changes to `@massds/mds-styles` are auto-compiled in this file. See [how to add a changelog](packages/styles/README.md#changelogs)

## 0.1.0-beta.0 (5/26/2026)

### Added
* Added npm publishing workflow metadata, GitHub Actions release automation, and changelog support for the styles package.


## 1.0.0 (5/29/2026)

### Changed
* [DP-47147] Updated the styles package build to publish bundled CSS under `dist/css/` and shared Sass modules under `dist/scss/`, removing the separate runtime CSS layer outputs. #50


## 1.1.0 (7/27/2026)

### Added
* [DP-47412] Added font-smoothing to our component reset #61
* [DP-145] Added text style utilities and a `text()` Sass mixin that compose typography from longhand token attributes. #77

### Changed
* [DP-145] Updated `packages/tokens` dependency to v2.0.0. #77
* [DP-145] Updated typography utilities to emit longhand font declarations instead of `font` shorthand declarations. #77
* [DP-145] Rename _scales.scss to _variables.scss #77

### Removed
* [DP-47412] Removed row gap from grid styles #58
* [DP-45434] Updated mixins: added resets for address and unordered list. Updated focus mixin to handle both focus color tokens. #53

