---
'@tunghtml/strapi-plugin-filtered-relation': major
---

Move into the strapi-field-kit monorepo and rewrite in TypeScript.

- The package now ships a built `dist` (via `@strapi/sdk-plugin`) instead of raw JSX source.
- Status changes write the configured status field; 1.x always wrote `participantStatus`.
- Error messages are generic and translated (English and Vietnamese) instead of mentioning investors and meetings.
- Rows link to the display field's target model from the schema, falling back to the old guess.
- The "Filters: …" hint now shows; 1.x passed it to a component that ignored it.
- Breaking: requires Node 20+.
