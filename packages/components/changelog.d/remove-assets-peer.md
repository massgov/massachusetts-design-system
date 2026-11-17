## Fixed

- Removed the assets npm peer dependency declaration. Components still depend on asset content, supplied as inline icon SVG or versioned CDN URLs for state seals, without requiring consumers to install the assets package. Assets remain a development dependency for component builds and rendering.
