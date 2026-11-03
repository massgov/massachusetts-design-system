# Changelog

All notable changes to `@massds/mds-components` are compiled in this file.
See [changelog guidance](README.md#changelogs).

## Unreleased

## 0.1.0-beta.2 (11/3/2026)

### Added
* [DS-475] Added a script to refresh component schema icon names from the asset library and integrated it into the Figma icon sync workflow. #212
* [DS-647] Added the Details Toggle component and Storybook documentation. #218

### Changed
* Semantic heading: Added the Semantic heading component to Storybook with Overview and Guidance pages #220
* Site Header: Vertically aligned text to center when there is a subheading #216
* Action link: Made Target its own control to match Inline Link controls #215
* Inline message: Replaced the level-two heading with a strong element so message titles do not affect the page heading hierarchy. #223

## 0.1.0-beta.0 (10/20/2026)

### Added
* Added public npm package metadata, GitHub Actions release automation, and changelog support for `@massds/mds-components`. #188
* Added SCSS linting and Twig syntax checks for component development and CI releases. #188
* Added Twig formatting checks and an autofix command for component templates. #188
* Components changelog release preparation now aligns Storybook's Design System dependency versions and refreshes the root lockfile before compiling release notes.

### Changed
* Update footer layout from using flexbox to using grid mixins. #233
* Re-added inline message explaining that our design system is currently in beta #196
* Added the inline link, overview, guidance, and API for the component
* [DS-580] Updated Action Link API to cover only necessary controls, added HTML attribute object #191
* In Footer component: Added Description property for Contact items #194

