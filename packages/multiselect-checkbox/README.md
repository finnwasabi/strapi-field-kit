# Multiselect Checkbox

Part of [Strapi Field Kit](https://github.com/finnwasabi/strapi-field-kit).

A Strapi 5 custom field that shows a list of checkboxes and stores the choices as a JSON array, such as `["News", "Guide"]`, instead of a comma-separated string.

[![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-multiselect-checkbox.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-multiselect-checkbox)
[![npm downloads](https://img.shields.io/npm/dm/@tunghtml/strapi-plugin-multiselect-checkbox.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-multiselect-checkbox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![A tags field with checkboxes for News, Guide and Release; News and Release are checked](https://raw.githubusercontent.com/finnwasabi/strapi-field-kit/main/packages/multiselect-checkbox/docs/edit-view.png)

Based on [strapi-plugin-multiselect-field](https://github.com/fxm90/strapi-plugin-multiselect-field) by Felix Mau (MIT), changed to store an array and to use checkboxes.

## Features

- Checkbox grid in two columns
- Stored as a JSON array, so the API returns `["News", "Guide"]`
- `label:value` options store a value different from the label shown
- Saved values that are no longer options show unchecked, and are dropped the next time the field changes
- English and Vietnamese admin translations

## Requirements

- Strapi 5.18 or later
- Node.js 20 or later

## Installation

```bash
npm install @tunghtml/strapi-plugin-multiselect-checkbox
```

Strapi picks the plugin up from your dependencies. Rebuild the admin panel and restart:

```bash
npm run build
npm run develop
```

## Usage

1. Open **Content-Type Builder**, click **Add another field**, open the **Custom** tab and choose **Multiselect Checkbox**.
2. Under **Options**, enter one option per line. Use `label:value` to store a different value, e.g. `Release notes:release-notes`.
3. Optionally set a **Default value** as a JSON array.

### In a schema file

```json
{
  "attributes": {
    "tags": {
      "type": "customField",
      "customField": "plugin::multiselect-checkbox.multiselect-checkbox",
      "options": ["News", "Guide", "Release notes:release-notes"]
    }
  }
}
```

## Upgrading from 1.x

2.0 requires Node 20 and ships a built `dist`. Schemas and saved data keep working unchanged: the custom field id is still `plugin::multiselect-checkbox.multiselect-checkbox`. The admin labels are now translated (1.x shipped translation keys that never matched).

## License

MIT © Felix Mau and Tung Le
