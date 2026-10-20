# Storybook

This package builds the Storybook site for Massachusetts Design System
resources. Its versioned production snapshots follow the version of
`@massds/mds-components`. Each snapshot uses the exact pinned versions of the
assets, styles, and tokens packages recorded in this package's `package.json`.

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

Storybook snapshots are built and deployed with components package releases;
Storybook is not published as a separate npm package. The version displayed in
Storybook and used in the URL is the exact `@massds/mds-components` version
pinned in this package's `package.json`.

When preparing a components release:

1. Update `packages/components/package.json` and add the components changelog
   fragments, following the
   [components release guide](../packages/components/README.md#subsequent-releases).
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
   lockfile, and changelog together. Build and review the release before merging:

   ```bash
   npm ci
   npm run build
   npm run build:storybook
   ```

4. Merge the release PR into `main`, then create the matching tag
   `components-v<version>` on that release commit. For example, version
   `0.1.0-beta.0` uses `components-v0.1.0-beta.0`.

The tag starts the
[components publish workflow](../.github/workflows/publish-components.yml).
It checks that the tag matches the package version, builds and publishes the
components package, then triggers the production Storybook workflow after
publishing succeeds. That follow-up workflow runs from `main` to meet the prod
environment's branch policy, verifies that the matching tag points to the
published commit, and checks out that release commit to build Storybook. Stable
versions publish to npm's `latest` dist-tag; prereleases publish to `beta`.

For versioned deployments of older tags with a stale Storybook components pin,
the workflow aligns that pin and the lockfile to the checked-out components
version before installing dependencies. Other package pins and the tagged source
remain unchanged. Root deployments still require the committed pin to match.

After the npm publish succeeds, the production workflow builds Storybook with the
base path `/version/<version>/`, syncs it to that version's production S3
prefix, and invalidates the matching CloudFront paths. The deployment uses the
gated `prod` GitHub environment and waits for its required approval. The
versioned site is available at:

```text
https://designsystem.mass.gov/version/<version>/
```

The CloudFront rewrite function redirects a URL without a trailing slash to the
canonical route. Apply the prod infrastructure change for that function before
the first versioned release.

Manual dispatch of the
[production deploy workflow](../.github/workflows/deploy-prod.yml) from `main`
updates the root Storybook site at <https://designsystem.mass.gov> when the
components version input is blank. To redeploy or backfill a versioned snapshot,
enter the exact components version (for example, `0.1.0-beta.0`). The workflow
checks out and verifies the matching `components-v<version>` tag, then deploys
to `/version/<version>/` through the same `prod` approval. Root S3 syncs preserve
existing `version/*` snapshots.
