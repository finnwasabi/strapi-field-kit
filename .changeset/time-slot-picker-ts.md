---
'@tunghtml/strapi-plugin-time-slot-picker': major
---

Move into the strapi-field-kit monorepo and rewrite in TypeScript.

- The package now ships a built `dist` (via `@strapi/sdk-plugin`) instead of raw JSX source.
- New "Editors can add and remove dates" option brings back the date picker and remove buttons removed in 1.1.0. It is off by default, so existing fields look the same.
- Without that option, the empty state explains that dates come from the API.
- Labels are translated (English and Vietnamese); invalid dates show as written instead of "undefined, undefined NaN".
- Breaking: requires Node 20+.
