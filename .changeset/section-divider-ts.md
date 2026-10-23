---
'@tunghtml/strapi-plugin-section-divider': major
---

Move into the strapi-field-kit monorepo and rewrite in TypeScript.

- The package now ships a built `dist` (via `@strapi/sdk-plugin`) instead of raw JSX source.
- The divider defaults to the full width of the edit view and can no longer be shrunk in "Configure the view". If an existing divider still shows at half width, reset its layout in "Configure the view".
- Adds English and Vietnamese admin translations.
- Breaking: requires Strapi 5 and Node 20+. Strapi 4 is no longer supported (the v4 admin entry was already removed in 1.0.18).
