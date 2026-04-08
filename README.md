# Massachusetts Design System

This repository contains the source code for Massachusetts Design System packages. Today it includes:

- `packages/assets` for icons, animation files, and state seal assets published as `@massds/mds-assets`
- `packages/tokens` for CSS design tokens published as `@massds/mds-tokens`

Each package has its own README with package-specific development and publishing details.

For general guidance on how to use the Design System, check out the [Design System Microsite](https://www.mass.gov/massachusetts-design-system).

In the upcoming quarter, we will be working on creating the HTML, CSS and Javascript for required components such as State Banner and Footer. We will announce when these components will be ready for testing and use.

We are a small but mighty crew enthusiastic to partner with teams hoping to leverage the Massachusetts Design System for upcoming projects. Please provide any feedback in our Community of Practice channel on Microsoft Teams or via email at <designsystem@mass.gov>.

[Read more about the Community of Practice here](https://www.mass.gov/info-details/design-system-community-of-practice).

## Development

### Changelogs

Package changes should include a changelog fragment for each affected package.

1. Add a markdown file under `packages/<package>/changelog.d/`
2. Start from the package template at `packages/<package>/changelog.d/changelog.template.md`
3. Keep the entry focused on the user-facing change

This expectation is also called out in the pull request template and validated in CI by `.github/workflows/check-package-changelogs.yml`.

### Releases

Packages are released independently and published to npm through GitHub Actions.

- `packages/assets` publishes through `.github/workflows/publish-assets.yml`
- `packages/tokens` publishes through `.github/workflows/publish-tokens.yml`

High-level release flow:

1. Create a release branch `release/<package>-<version>` from `main`
2. Make sure the package version in `package.json` is updated following [semantic versioning](https://semver.org/)
3. Compile changelog fragments into `CHANGELOG.md` by running `npm run changelog:release`
4. Create a package-specific git tag that matches the package version
5. Push the tag to trigger the publish workflow

Tag format:

- Assets: `assets-v<version>`
- Tokens: `tokens-v<version>`

Release channels:

- Stable versions such as `1.0.0` publish to npm with the default `latest` dist-tag
- Prerelease versions such as `1.1.0-beta.1` publish to npm with the `beta` dist-tag

For package-specific release details, see:

- `packages/assets/README.md`
- `packages/tokens/README.md`
