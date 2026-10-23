---
'@tunghtml/strapi-plugin-dynamic-enum': major
---

Move into the strapi-field-kit monorepo and rewrite in TypeScript.

- The package now ships a built `dist` (via `@strapi/sdk-plugin`) instead of raw JSX source.
- The field shows its hint text, and the placeholder and "created" notification are translated (English and Vietnamese).
- Drops the unused `react-redux` peer dependency and declares `react-intl`, which Strapi's admin already provides.
- Breaking: requires Node 20+.
