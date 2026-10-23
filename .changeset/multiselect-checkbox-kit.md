---
'@tunghtml/strapi-plugin-multiselect-checkbox': major
---

Move into the strapi-field-kit monorepo.

- Admin labels, empty state and validation messages are translated (English and Vietnamese); 1.x shipped translation keys that never matched.
- Option parsing and validation moved into tested helpers.
- Drops the unused plugin initializer and empty server boilerplate.
- Breaking: requires Node 20+.
