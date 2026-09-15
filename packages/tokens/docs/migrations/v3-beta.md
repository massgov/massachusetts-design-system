# Tokens v3.0.0 Migration Guide 

This guide is for consumers of MDS tokens code resources ([@massds/mds-tokens](https://www.npmjs.com/package/@massds/mds-tokens)) on V2 who want to learn about the changes between V2 and V3 ([see release notes](https://github.com/massgov/massachusetts-design-system/releases/tag/tokens-v3.0.0-beta.1)) and navigate the breaking changes we introduced to the color and typography tokens. 

(NOTE: If you need to update from V1 to V2 first, follow this [Migration Guide for V1 to V2](https://massgov.atlassian.net/wiki/spaces/DS/pages/2750545929/Tokens+v2.0.0+Migration+Guide) ) 

## Color token updates 

The color tokens have been updated to simplify the naming, make the system easier to understand, and better reflect the purpose of each token. These changes improve consistency across Figma, Storybook, and code while making the tokens easier to discover and reuse. 

| V2 | V3 Beta | Why |
| --- | --- | --- |
| `--mds-background-adaptive-*` | `--mds-interactive-*` | Better reflects that these tokens can be applied to any interactive element that changes color, including backgrounds, borders, text, and icons. |
| `--mds-text-and-icons-*` | `--mds-content-*` | Simplifies the naming and recognizes that icons are a form of content alongside text. |
| `--mds-border-focus-*` | `--mds-focus-*` | Elevates focus to its own top-level token group and encourages consistent use across components. |
| `--mds-background-base-*` | `--mds-base-*` | Creates a single home for white, black, and inverse tokens that can be reused across the interface. |

### Additional changes 

White, black, and inverse tokens have been moved from nested groups into the shared Base token set. 

highlight-brand-mid has moved from Interactive to Border because it is used as a static highlight color and does not follow the interactive emphasis scale. 

A new Overlay token group has been introduced (--mds-overlay-*) to support overlays and translucent fills. Only overlay-neutral-mid is exposed to designers in Figma for creating modal scrims and overlays, while the remaining overlay tokens remain available for implementation in code. 

## Typography updates 

The label, eyebrow, and caption scales now follow a more consistent T-shirt sizing convention. The unsuffixed token represents the default, or middle, size in each scale. Larger sizes have been renamed accordingly; their underlying values have not changed. 

| V2 | V3 Beta |
| --- | --- |
| `--mds-text-label-*-md` | `--mds-text-label-*-lg` |
| `--mds-text-label-*-lg` | `--mds-text-label-*-xl` |
| `--mds-text-label-*-xl` | `--mds-text-label-*-2xl` |
| `--mds-text-caption-*-md` | `--mds-text-caption-*-lg` |
| `--mds-text-eyebrow-*-md` | `--mds-text-eyebrow-*-lg` |

Here, `*` represents the typography property, such as font-size or line-height. 

The corresponding text-style mixin names have also changed: 

| V2 | V3 Beta |
| --- | --- |
| `label-md` | `label-lg` |
| `label-lg` | `label-xl` |
| `label-xl` | `label-2xl` |
| `caption-md` | `caption-lg` |
| `eyebrow-md` | `eyebrow-lg` |

For a complete list of token changes, see [Tokens v2 to v3 mapping.xlsx](https://massgov.sharepoint.com/:x:/s/TSS-TEAMS-XDR-ExperienceDesign_Research/IQCnkj5s1IP4Rq4aL1aqzIl1AfxC1zmjPXNU8hvlKmDyLP4?e=zXl5EA). 

// Add a note about joining CoP with link to the MDS page 

## Impact 

This release makes the token system easier to understand, discover, and use consistently across design and code. The updated naming also gives us a clearer foundation for extending the token system in future releases. 

Because these changes rename existing color and typography tokens, V3 is a breaking change for consumers of **@massds/mds-tokens**. Before upgrading, update any code that references the renamed tokens or text-style mixins to use their V3 equivalents. References to V2 token names will no longer work after the upgrade. 

The underlying values of the renamed typography tokens have not changed, so these updates should not result in visual changes when the corresponding V3 tokens are used. 

Use the [V2-to-V3 token mapping spreadsheet](https://massgov.sharepoint.com/:x:/s/TSS-TEAMS-XDR-ExperienceDesign_Research/IQCnkj5s1IP4Rq4aL1aqzIl1AfxC1zmjPXNU8hvlKmDyLP4?e=zXl5EA) to identify the replacements needed in your code. 

If you need help planning or completing your upgrade, please reach out to the Design System team at designsystem@mass.gov. 

 
