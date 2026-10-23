# Composite Field

Part of [Strapi Field Kit](https://github.com/finnwasabi/strapi-field-kit).

A Strapi 5 custom field that builds a display value from other fields of the entry, such as `Ms - Jane - Doe`, either on demand or automatically as those fields change.

[![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-composite-field.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-composite-field)
[![npm downloads](https://img.shields.io/npm/dm/@tunghtml/strapi-plugin-composite-field.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-composite-field)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![A display_name field showing "Launch night - News", with the hint "Combines: title, category (auto-generated)"](https://raw.githubusercontent.com/finnwasabi/strapi-field-kit/main/packages/composite-field/docs/edit-view.png)

## Features

- Combine any text, string or enum fields, plus relations (their `name`, `title` or `label`)
- Generate on demand with the play button, or automatically when a source field changes
- A manual edit is kept until one of the source fields changes again
- Opening an entry keeps its saved value instead of regenerating it
- Dates show as `MM/DD/YYYY` and times as `HH:MM`
- Works inside components: field names are read next to the composite field
- English and Vietnamese admin translations

## Requirements

- Strapi 5.33.2 or later
- Node.js 20 or later

## Installation

```bash
npm install @tunghtml/strapi-plugin-composite-field
```

Strapi picks the plugin up from your dependencies. Rebuild the admin panel and restart:

```bash
npm run build
npm run develop
```

## Usage

1. Open **Content-Type Builder**, click **Add another field**, open the **Custom** tab and choose **Composite**.
2. Under **Fields to combine**, enter one field name per line, for example `salutation`, `firstName`, `lastName`.
3. Optionally set a **Separator** (default ` - `). A space-only separator joins the values with single spaces.
4. In **Advanced settings**, tick **Auto-generate** to update the value as you type. Without it, click the play button in the field.

### In a schema file

```json
{
  "attributes": {
    "displayName": {
      "type": "customField",
      "customField": "plugin::composite-field.composite",
      "options": {
        "fields": "salutation\nfirstName\nlastName",
        "separator": " - ",
        "autoGenerate": true
      }
    }
  }
}
```

Empty source fields are skipped, so `Ms`, `Jane` and an empty last name give `Ms - Jane`.

## Upgrading from 1.x

2.0 requires Node 20 and ships a built `dist` instead of raw JSX. Schemas and saved values keep working unchanged: the custom field id is still `plugin::composite-field.composite`.

The "Combines: …" line under the field now actually shows (in 1.x it was passed to a component that ignored it). It is replaced by the field's description when you set one.

## License

MIT © Tung Le
