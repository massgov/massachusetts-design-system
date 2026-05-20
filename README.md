# Massachusetts Design System

This repository contains the source code for Massachusetts Design System packages. Today it includes:

- `packages/assets` for icons, animation files, and state seal assets published as `@massds/mds-assets`
- `packages/tokens` for CSS design tokens published as `@massds/mds-tokens`
- `packages/styles` for generated helper and utility CSS `@massds/mds-styles` (currently not published)

Each package has its own README with package-specific development and publishing details.

For general guidance on how to use the Design System, check out the [Design System Microsite](https://www.mass.gov/massachusetts-design-system).

In the upcoming quarter, we will be working on creating the HTML, CSS and Javascript for required components such as State Banner and Footer. We will announce when these components will be ready for testing and use.

We are a small but mighty crew enthusiastic to partner with teams hoping to leverage the Massachusetts Design System for upcoming projects. Please provide any feedback in our Community of Practice channel on Microsoft Teams or via email at <designsystem@mass.gov>.

[Read more about the Community of Practice here](https://www.mass.gov/info-details/design-system-community-of-practice).

## Development

### Quick Start

1. Install dependencies from the repository root with `npm install`
2. You can also run all available package builds or lints with `npm run build` and `npm run lint`
3. Or run a specific package from the root with npm workspaces, such as:
  - `npm run build:assets`
  - `npm run lint:tokens`
  - `npm run watch:styles` - this will track changes in tokens and styles and spins up the styles demo site in the browser
4. Add a changelog fragment under `packages/<package>/changelog.d/` if your change affects a published package

> This expectation is also called out in the pull request template and validated in CI by `.github/workflows/check-package-changelogs.yml`.

For package-specific setup and commands, see the README inside each package directory.

### Workspace Dependencies

The root `package.json` uses npm workspaces for local development across the packages in `packages/`. Use normal semver ranges for internal package relationships so each published package manifest stays valid outside the monorepo.

Use `peerDependencies` when a package expects the consuming app to install another Design System package. For example, `@massds/mds-styles` declares `@massds/mds-tokens` as a peer dependency because consumers need tokens available when they use the styles package.

When the components package is added, place it under `packages/components`, add it to the root `workspaces` list after the packages it depends on, and declare the existing packages it expects consumers to install:

```json
{
  "peerDependencies": {
    "@massds/mds-assets": "^1.1.1",
    "@massds/mds-styles": "^0.1.0",
    "@massds/mds-tokens": "^1.0.0"
  }
}
```

If a package's own build or tests directly import a peer package, add the same range to that package's `devDependencies` as well. npm will link the local workspace package during root installs when the local version satisfies the range.


### Releases

Packages are released independently and published to npm through GitHub Actions.

- `packages/assets` publishes through `.github/workflows/publish-assets.yml`
- `packages/tokens` publishes through `.github/workflows/publish-tokens.yml`
- `packages/styles` will need its own publish workflow before the first npm release

Recommended branch and tag strategy:
- Use `main` as the only long-lived release branch.
- Squash&merge feature work into `main` through pull requests with required checks.
- Create release tags only from `main`.
- Keep package-specific tag prefixes if more packages are added later, for example `assets-v*`, `tokens-v*`, and `components-v*`.

Release flow:

1. Create a release branch `release/<package>-<version>` from `main`
2. Make sure the package version in `package.json` is updated following [semantic versioning](https://semver.org/) and run `npm install && npm run build`
3. Compile changelog fragments into `CHANGELOG.md` by running `npm run changelog:release` inside the package directory
4. Create a PR and merge into `main` (without squashing)
5. In the GitHub UI, create a package-specific release tag on the release commit that matches the package version and copy in the relevant release notes from `CHANGELOG.md`
6. Creating the tag in GitHub triggers the publish workflow

Tag format:

- Assets: `assets-v<version>`
- Tokens: `tokens-v<version>`
- Styles: `styles-v<version>`

Release channels:

- Stable versions such as `1.0.0` publish to npm with the default `latest` dist-tag
- Prerelease versions such as `1.1.0-beta.1` publish to npm with the `beta` dist-tag

For package-specific release details, see:

- [packages/assets/README.md](packages/assets/README.md)
- [packages/tokens/README.md](packages/tokens/README.md)
- [packages/styles/README.md](packages/styles/README.md)
