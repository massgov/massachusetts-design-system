# Storybook

This package builds the Storybook site for Massachusetts Design System
resources. Its versioned production snapshots follow the version of
`@massds/mds-components`. Each snapshot uses the exact pinned versions of the
assets, styles, and tokens packages recorded in this package's `package.json`.

For guidance on using the Design System, see the [Massachusetts Design System resources](https://designsystem.mass.gov).

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

## Deployment caching

Dev, stage, and production use the same cache headers for root sites, branch
previews, and versioned snapshots. TTL (time to live) controls how long a cached
response stays fresh before it needs validation or replacement.

| File or URL | `Cache-Control` | Cache freshness / TTL |
| --- | --- | --- |
| HTML, including `/`, `/index.html`, and `/iframe.html` | `no-cache` | Must revalidate before reuse. `/` serves `index.html` with the same header. |
| JS/CSS under `assets/` with an eight-character build hash, such as `assets/ColorTokens-WgClPZZZ.js` | `public,max-age=31536000,immutable` | Fresh for up to 365 days. A changed build produces a new hashed URL. |
| Other uploaded files, including `index.json` and JS/CSS without a build hash | `no-cache` | Must revalidate before reuse. |

`no-cache` allows storage but requires validation before reuse. CloudFront
honors these origin headers with a minimum and default TTL of 0 seconds and a
maximum TTL of 31,536,000 seconds (365 days). Deployments also invalidate the
matching CloudFront paths, which can evict edge copies before their TTL expires.

Supporting files and hashed assets upload before HTML. Uploads preserve old
assets so tabs opened before a deployment can still load their original chunks.
Asset retention in S3 has no automatic expiration and is separate from the cache
TTL. Deleted-branch preview cleanup still removes that branch's files. Assets
already deleted by earlier deployments are not restored.

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
