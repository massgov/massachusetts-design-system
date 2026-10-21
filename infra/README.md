# Infrastructure — designsystem.mass.gov hosting

Terraform for hosting the Design System Storybook site on AWS (S3 +
CloudFront). Follows massgov/SSR conventions (shared state backend,
`mds-terraform-common` modules, `infra/env/{env}` layout).

## Account & backend

| | |
|---|---|
| Region | `us-east-1` |
| State backend | bucket `application-configurations`, table `terraform` (shared, pre-existing) |
| State key (dev) | `terraform/state/nonprod/design-mass-gov-dev.tfstate` |
| State key (stage) | `terraform/state/nonprod/design-mass-gov-stage.tfstate` |
| State key (prod) | `terraform/state/prod/design-mass-gov-prod.tfstate` |

## Layout

```
infra/
  template/
    static-site/    # Custom S3 + OAC + CloudFront module (domain-less friendly)
  env/
    dev/            # UAT environment (designsystem.dev.tss.mass.gov)
      init.tf       #   backend + //tagging + provider
      main.tf       #   static_site module
      outputs.tf
    stage/          # staging environment (designsystem.stage.tss.mass.gov)
      init.tf       #   backend (stage state key) + //tagging (environment=stage)
      main.tf       #   static_site module
      outputs.tf
    prod/           # production, reuses template/static-site verbatim
      init.tf       #   backend (prod state key) + //tagging (environment=prod)
      main.tf       #   static_site module (designsystem.mass.gov wired in)
      outputs.tf
```

### Why a custom static-site module?

`mds-terraform-common//static-site` hard-requires a domain + Route53 zone (it
names the bucket after the domain and always provisions an ACM cert + DNS
record), and our DNS zones are not in Route53. Each env stands the site up
on the default `*.cloudfront.net` URL first, then attaches its custom domain
via the optional `aliases` / `acm_certificate_arn` inputs once DNS and a
us-east-1 ACM cert exist. Tagging and the deploy role still use the shared
`//tagging` and `//gha_pipeline` modules.

## Custom domains

| Env | Hostname | DNS CNAME target | ACM cert (us-east-1) | SNOW |
|---|---|---|---|---|
| dev | `designsystem.dev.tss.mass.gov` | `dzf18n4wmc83k.cloudfront.net` | issued, wired in | RITM0488699 |
| stage | `designsystem.stage.tss.mass.gov` | `dazaojizlhqqt.cloudfront.net` | issued, wired in | RITM0488702 |
| prod | `designsystem.mass.gov` | `d3grhllmck6oga.cloudfront.net` | issued, wired in | RITM0488614 |

DNS records are owned by the mass.gov / tss.mass.gov DNS teams and are
requested via ServiceNow. ACM certs are DNS-validated, so each new cert also
needs its validation CNAME added through the same channel. To wire a domain
in: request the cert, get the validation CNAME published, wait for `ISSUED`,
then set `aliases` and `acm_certificate_arn` in `env/<env>/main.tf`.

## Apply

```bash
terraform -chdir=infra/env/<env> init     # <env> = dev | stage | prod
terraform -chdir=infra/env/<env> plan
terraform -chdir=infra/env/<env> apply
```

In CI, `apply.yml` runs this: **dev** auto-applies on push to `main`; **stage**
and **prod** apply only through their gated environments (manual dispatch).

## IAM roles & GitHub environments (managed in github-iac)

This repo's GitHub Actions roles, teams, and environments are managed as code
in `massgov/github-iac` via the `mds-gh-repository` module (the canonical
massgov pattern).

Each environment has its own scoped `DEPLOY_ROLE_ARN` variable, surfaced
automatically by the module; `PLAN_ROLE_ARN` is a repo-level variable.
Workflow jobs bind to `environment: <env>` so `vars.DEPLOY_ROLE_ARN` resolves
to that environment's role. Set the per-env site outputs as **environment**
variables after applying each env:

| Variable | Scope | Source |
|---|---|---|
| `DEV_BUCKET` / `DEV_DISTRIBUTION_ID` | dev env | `terraform output` of `infra/env/dev` |
| `STAGE_BUCKET` / `STAGE_DISTRIBUTION_ID` | stage env | `terraform output` of `infra/env/stage` |
| `PROD_BUCKET` / `PROD_DISTRIBUTION_ID` | prod env | `terraform output` of `infra/env/prod` |

## Workflows

- `pr-plan.yml` → `plan.yml`: `terraform plan` as a PR check (`PLAN_ROLE_ARN`),
  run against dev, stage, and prod.
- `apply.yml`: `terraform apply`. Dev auto-applies on push to `main`; stage
  and prod run in their gated environments (manual dispatch, approval
  required).
- `deploy-dev.yml`: builds Storybook and deploys it to **dev** on push to
  `main`. Pull requests can also deploy approved branch previews under
  `/branch/<branch-name>/` in the dev bucket; configure required reviewers on
  the `dev-preview` GitHub environment so these preview deploys pause for
  approval. The `main` sync preserves `branch/*` objects so approved previews
  are not removed by root deploys. When a branch is deleted, the matching
  `/branch/<branch-name>/` preview is removed from S3 and invalidated in
  CloudFront.
- `deploy-stage.yml`: builds Storybook and deploys it to **stage** — manual
  dispatch, runs in the gated `stage` environment.
- `deploy-prod.yml`: builds Storybook and deploys it to **prod** — components
  releases publish a snapshot at `/version/<version>/`; manual dispatch deploys
  the root site. Both run in the gated `prod` environment, and root syncs
  preserve versioned snapshots.

The static-site CloudFront function redirects bare `/version/<version>` URLs
to their trailing-slash form. Apply the infrastructure change to prod before
the first versioned Storybook release so the route resolves correctly.

## Deployments and asset retention

All site deploys use `scripts/deploy-storybook.mjs` with `SITE_BUCKET` and an
optional `S3_PREFIX` (`branch/<name>` or `version/<version>`). The script uploads
assets and supporting files before HTML. HTML and mutable files receive
`Cache-Control: no-cache`; hashed JS/CSS receive
`Cache-Control: public,max-age=31536000,immutable`. Copies overwrite unchanged
files too, so existing S3 objects receive the cache headers on the next deploy.
The CloudFront policy has minimum/default TTLs of zero and honors those headers,
including directory URLs rewritten to `index.html`.

Previous files under each site's `assets/` remain available for seven days
after a successful deployment first observes that they are no longer in the
current build. `_deployment/retired-assets.json` records retirement timestamps
per deployment prefix. Existing assets are adopted on the first deployment;
their upload age does not shorten retention. Cleanup runs on subsequent
successful deployments, so unused files may remain longer than seven days.
Current assets and other preview/version prefixes are never eligible for this
cleanup. Supporting files outside `assets/` are retained without automatic
cleanup. Explicit branch deletion still removes the entire preview.

Deployments for a given target must be serialized to protect the retention
state. The workflows queue rather than cancel an active deployment. Production
loads deployment tooling from the workflow commit so older release tags can
still use the corrected deployment process.

Rollout:

1. Apply Terraform for each environment to install the origin-header cache
   policy (dev auto-applies; stage/prod use the gated `apply.yml` workflow).
2. Deploy the site using the updated workflow from `main`. Existing version
   paths receive new object headers when redeployed with `components_version`.
3. Verify `Cache-Control: no-cache` on `/`, `/index.html`, and `/iframe.html`,
   and immutable caching on a hashed JS/CSS URL. Repeat for preview/version
   paths as needed. Existing CloudFront invalidation steps purge older headers.
4. Keep a tab open across another deploy, then navigate to a previously unopened
   story. Its old asset URLs should remain accessible.

These changes cannot restore chunks deleted by earlier deployments. A tab
already affected by a missing chunk still needs a refresh. Tabs older than the
retention window may also need to refresh.

Run the deployment regression tests with:

```bash
node --test scripts/deploy-storybook.test.mjs
```

## Notes

- The GitHub OIDC provider already exists in this account (managed by
  `massgov/ds-infrastructure-secure`); the central `gha_pipeline` roles
  reference it.
- Tags come from the central `//tagging` remote state — do not hardcode them.
- Shared modules are pinned at `?ref=1.x` (house convention).
- All AWS auth is GitHub OIDC role assumption — no long-lived AWS keys in the
  repo.
