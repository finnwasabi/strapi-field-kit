# @tunghtml/strapi-plugin-composite-field

## 2.0.0

### Major Changes

- dc31538: Move into the strapi-field-kit monorepo and rewrite in TypeScript.

  - The package now ships a built `dist` (via `@strapi/sdk-plugin`) instead of raw JSX source.
  - The "Combines: …" hint now shows under the field; 1.x passed it to a component that ignored it. A field description, when set, takes its place.
  - Placeholders, button label and hint are translated (English and Vietnamese).
  - Composition logic moved into tested helpers; drops the `lodash` import.
  - Breaking: requires Node 20+.
