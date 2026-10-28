# Storybook analytics

Production and stage share one GTM **Web** container while sending data
to separate GA4 properties. Each property has its own web data stream and
measurement ID. The container routes by hostname:

| Page Hostname | GA4 measurement ID |
|---|---|
| `designsystem.mass.gov` | `G-5M9F5X71DQ` |
| `designsystem.stage.tss.mass.gov` | `G-ZKGZE2KWX7` |


## Deployment and container versions

Set these GitHub Actions **environment variables**:

| Variable | `stage` | `prod` |
|---|---|---|
| `GTM_CONTAINER_ID` | `GTM-NQ73BX8S` | `GTM-NQ73BX8S` |
| `GTM_AUTH` | Staging environment `gtm_auth` value | Unset |
| `GTM_PREVIEW` | Staging environment `gtm_preview` value | Unset |

For independent container releases, create **Admin → Environments → New →
Staging** in GTM. Under **Actions → Get Snippet**, copy the `gtm_auth` and
`gtm_preview` query parameter values into the stage variables above. Both
must be set together. The site adds `gtm_cookies_win=x` for that snippet.
Use the standard container snippet on production. See Google's
[GTM environments guidance](https://support.google.com/tagmanager/answer/6311518?hl=en).

The hostname lookup determines the GA4 destination. GTM environments
determine which container version loads. Without the optional Staging
snippet values, both sites load the published Live container version;
hostname routing still keeps their GA4 data separate.

The loader is injected once into Storybook's manager. Docs in the preview
iframe send events to the manager's data layer. GTM mode replaces the
direct GA4 loader and `gtag()` event calls with `dataLayer.push()` events.
GTM processes events queued before its asynchronous loader completes.

When `GTM_CONTAINER_ID` is unset, the existing direct GA4 setup still uses
`GA_MEASUREMENT_ID` from the corresponding GitHub environment. This allows
stage to migrate before production. When GTM is configured, it owns GA4
configuration; `GA_MEASUREMENT_ID` is ignored. Invalid GTM IDs or incomplete
GTM environment settings fail the build.
