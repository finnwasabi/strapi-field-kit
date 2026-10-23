# Strapi Field Kit

Custom fields that the Strapi 5 Content-Type Builder is missing. Each one started as a fix for a real client project and is published as its own npm package, so you install only what you need.

[![CI](https://github.com/finnwasabi/strapi-field-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/finnwasabi/strapi-field-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Fields

| Field | What it does | Package | Status |
|---|---|---|---|
| [Section Divider](./packages/section-divider) | Full-width labelled divider that splits long forms into sections | `@tunghtml/strapi-plugin-section-divider` | In the kit |
| Dynamic Enum | Enum dropdown where editors can add a new option as they type | `@tunghtml/strapi-plugin-dynamic-enum` | Moving in |
| Composite Field | Builds a display value from other fields, such as `firstName - lastName`, and keeps it in sync | `@tunghtml/strapi-plugin-composite-field` | Moving in |
| Time Slot Picker | Pick time slots across several dates, grouped by morning and afternoon | `@tunghtml/strapi-plugin-time-slot-picker` | Moving in |
| Filtered Relation | Lists related entries filtered by the current entry, with inline status changes | `@tunghtml/strapi-plugin-filtered-relation` | Moving in |
| Multiselect Checkbox | Checkbox list stored as a JSON array instead of a comma-separated string | `@tunghtml/strapi-plugin-multiselect-checkbox` | Moving in |

Until a field moves in, its code and issues live in its original `finnwasabi/strapi-plugin-*` repository.

## Install

Install any field on its own:

```bash
npm install @tunghtml/strapi-plugin-section-divider
```

Then rebuild the admin panel (`npm run build`) and restart Strapi. Each package's README covers its options.

## Development

Requirements: Node 20+ (see `.nvmrc`) and pnpm 10.

```bash
pnpm install
pnpm build        # build every plugin
pnpm test         # unit tests (Vitest)
pnpm typecheck
pnpm verify       # strapi-plugin verify for every package
```

### Playground

`playground/` is a Strapi 5 app wired to the local plugins, with a `Showcase` content type that uses every field.

```bash
pnpm build                          # the playground loads each plugin's dist
cp playground/.env.example playground/.env
pnpm playground                     # http://localhost:1337/admin
```

After changing a plugin, run `pnpm build` again and restart the playground.

### Releasing

Releases go through [Changesets](https://github.com/changesets/changesets):

1. Run `pnpm changeset`, pick the packages and the bump, and describe the change.
2. Commit the generated file with your PR.
3. After merge, the Release workflow opens a "chore: version packages" PR. Merging it publishes to npm.

## Need a custom Strapi plugin?

I build Strapi plugins and admin customizations for agencies and product teams. Get in touch through [tungln.is-a.dev](https://tungln.is-a.dev).

## License

MIT © Tung Le
