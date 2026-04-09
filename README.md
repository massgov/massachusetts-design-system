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

### Quick Start

1. Choose the package you want to work in: `packages/assets` or `packages/tokens`
2. Install dependencies from that package directory with `npm install`
3. Run the package checks you need, such as `npm run lint` or `npm run build`
4. Add a changelog fragment under `packages/<package>/changelog.d/` if your change affects a published package

> This expectation is also called out in the pull request template and validated in CI by `.github/workflows/check-package-changelogs.yml`.

For package-specific setup and commands, see the README inside each package directory.


### Releases

Packages are released independently and published to npm through GitHub Actions.

- `packages/assets` publishes through `.github/workflows/publish-assets.yml`
- `packages/tokens` publishes through `.github/workflows/publish-tokens.yml`

Recommended branch and tag strategy:
- Use `main` as the only long-lived release branch.
- Squash&merge feature work into `main` through pull requests with required checks.
- Create release tags only from `main`.
- Keep package-specific tag prefixes if more packages are added later, for example `assets-v*`, `tokens-v*`, and `components-v*`.

Release flow:

1. Create a release branch `release/<package>-<version>` from `main`
2. Make sure the package version in `package.json` is updated following [semantic versioning](https://semver.org/)
3. Compile changelog fragments into `CHANGELOG.md` by running `npm run changelog:release` inside the package directory
4. Create a PR and merge into `main` (without squashing)
5. In the GitHub UI, create a package-specific release tag on the release commit that matches the package version and copy in the relevant release notes from `CHANGELOG.md`
6. Creating the tag in GitHub triggers the publish workflow

Tag format:

- Assets: `assets-v<version>`
- Tokens: `tokens-v<version>`

Release channels:

- Stable versions such as `1.0.0` publish to npm with the default `latest` dist-tag
- Prerelease versions such as `1.1.0-beta.1` publish to npm with the `beta` dist-tag

For package-specific release details, see:

- [packages/assets/README.md](packages/assets/README.md)
- [packages/tokens/README.md](packages/tokens/README.md)
