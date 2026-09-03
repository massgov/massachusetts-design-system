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
    dev/            # UAT environment (designsystem.dev.tss.mass.gov, pending cert)
      init.tf       #   backend + //tagging + provider
      main.tf       #   static_site module
      outputs.tf
    stage/          # staging environment (designsystem.stage.tss.mass.gov, pending cert)
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
| dev | `designsystem.dev.tss.mass.gov` | `dzf18n4wmc83k.cloudfront.net` | pending | RITM0488699 |
| stage | `designsystem.stage.tss.mass.gov` | `dazaojizlhqqt.cloudfront.net` | pending | RITM0488702 |
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
- `deploy-prod.yml`: builds Storybook and deploys it to **prod** — manual
  dispatch, runs in the gated `prod` environment.

## Notes

- The GitHub OIDC provider already exists in this account (managed by
  `massgov/ds-infrastructure-secure`); the central `gha_pipeline` roles
  reference it.
- Tags come from the central `//tagging` remote state — do not hardcode them.
- Shared modules are pinned at `?ref=1.x` (house convention).
- All AWS auth is GitHub OIDC role assumption — no long-lived AWS keys in the
  repo.
