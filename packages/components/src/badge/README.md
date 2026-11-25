# Badge

Non-interactive text labels for a status, count, or category. Use meaningful text so color is not the only way to identify the status.

- `text`: plain text, default `Press release`. Markup is escaped.
- `type`: `Neutral` (default), `Informative`, `Success`, `Warning`, or `Danger`. Unsupported values fall back to `Neutral`.
- `htmlAttributes`: optional native, ARIA, and data attributes. Custom classes are appended to the component classes.

The badge uses eyebrow typography and content-driven dimensions. Long labels can wrap within the available width. Keep labels brief and place them near the content they describe. For dynamically announced status changes, the consuming application should provide an appropriate live region.
