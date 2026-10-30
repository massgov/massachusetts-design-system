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

The GTM loader is injected once into Storybook's manager. Docs in the
preview iframe send events to the manager's data layer. GTM owns all GA4
tags, destinations, and event delivery. Storybook supplies these
`dataLayer.push()` events for the GTM Custom Event triggers:

| Event | Parameters |
|---|---|
| `page_view` | `page_location`, `page_title` |
| `storybook_view` | `story_id`, `view_kind` |
| `storybook_code_copy` | `story_id`, `code_language`, `code_tab` |

GTM processes events queued before its asynchronous loader completes.
Route events cover the initial docs/story route and subsequent navigation,
including back/forward, with consecutive repeats of the same route skipped.
Code-copy events record clicks on the docs snippet Copy button.

Use these Custom Event triggers for the GA4 event tags. Since Storybook
supplies page views, set `send_page_view` to `false` in the GTM Google tag
and disable **Page changes based on browser history events** in each GA4
web stream's Enhanced measurement settings. A second GTM History Change
pageview tag or click trigger for the same copy action would duplicate
these events.

When `GTM_CONTAINER_ID` is unset, analytics is disabled. There is no direct
GA4 loader or event fallback. Invalid GTM IDs or incomplete GTM environment
settings fail the build. Legacy `GA_MEASUREMENT_ID` GitHub variables are no
longer used and can be removed.
