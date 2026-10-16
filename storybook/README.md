# Storybook

This package builds the storybook site for Massachusetts Design System resources. Its
published snapshots follow the version of `@massds/mds-components`; each
snapshot also records the exact versions of the assets, styles, and tokens
packages used to build it.

## Local development

From the repository root, install dependencies and start Storybook with:

```bash
npm ci
npm run storybook
```

To create a static build locally, run:

```bash
npm run build:storybook
```

## Release and versioned deployments

Manual dispatch of the production deploy workflow updates the root Storybook
site at designsystem.mass.gov.

Storybook snapshots are released with components package releases. The version
shown in Storybook and used in the URL is the exact `@massds/mds-components`
version pinned in this package's `package.json`.

When preparing a components release:

1. Update `packages/components/package.json` and prepare the components
   changelog as described in the [components release guide](../packages/components/README.md#subsequent-releases).
2. From the repository root, run:

   ```bash
   npm run changelog:release --workspace @massds/mds-components
   ```

   The `prechangelog:release` hook runs
   [`scripts/prepare-storybook-release.mjs`](../scripts/prepare-storybook-release.mjs).
   It copies the exact versions from the assets, components, styles, and tokens
   workspace manifests into this package's dependencies and refreshes the root
   `package-lock.json`.
3. Review and commit the components version, Storybook dependency versions,
   lockfile, and changelog together. Build and inspect the release before
   merging:

   ```bash
   npm ci
   npm run build
   npm run build:storybook
   ```

4. Merge the release PR into `main`, then create the matching tag
   `components-v<version>` on that release commit. For example, version
   `0.1.0-beta.0` uses the tag `components-v0.1.0-beta.0`.

The tag starts [the components publish workflow](../.github/workflows/publish-components.yml).
It checks that the tag matches the package version, builds and publishes the
components package, then invokes the production Storybook deployment using the
same release commit. Stable components versions publish to npm's `latest`
dist-tag; prereleases publish to `beta`.

After the publish succeeds, the production workflow builds Storybook with the
base path `/version/<version>/`, syncs it to that version's production S3
prefix, and invalidates the matching CloudFront paths. The deployment uses the
gated `prod` GitHub environment and waits for its required approval. The
versioned site is available at:

```text
https://designsystem.mass.gov/version/<version>/
```
