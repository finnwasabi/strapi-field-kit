# Section Divider

Part of [Strapi Field Kit](https://github.com/finnwasabi/strapi-field-kit).

A Strapi 5 custom field that adds a labelled divider to the edit view, so long forms read as clear sections. It stores no data.

[![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-section-divider.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-section-divider)
[![npm downloads](https://img.shields.io/npm/dm/@tunghtml/strapi-plugin-section-divider.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-section-divider)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![A "contact_divider" section divider spanning the full width between the title field and the email and phone fields](https://raw.githubusercontent.com/finnwasabi/strapi-field-kit/main/packages/section-divider/docs/edit-view.png)

## Features

- Full-width divider on its own row of the edit view
- Label comes from the field's name or its label in "Configure the view"
- Light and dark mode through the Strapi Design System
- English and Vietnamese admin translations
- No data stored; the API always returns `null` for the field

## Requirements

- Strapi 5
- Node.js 20 or later

## Installation

```bash
npm install @tunghtml/strapi-plugin-section-divider
```

Strapi picks the plugin up from your dependencies. Rebuild the admin panel and restart:

```bash
npm run build
npm run develop
```

## Usage

### From the Content-Type Builder

1. Open **Content-Type Builder** and pick a content type.
2. Click **Add another field**, open the **Custom** tab and choose **Section Divider**.
3. Give it a name such as `contactSection`, then save.
4. In **Configure the view**, drag the divider above the fields it introduces and set its label.

### In a schema file

```json
{
  "attributes": {
    "contactSection": {
      "type": "customField",
      "customField": "plugin::section-divider.section-divider"
    }
  }
}
```

## Notes

- The divider defaults to full width and cannot be resized. If a divider added with an older version still shows at half width, reset its layout in **Configure the view**.
- The field is a `string` column under the hood, so it shows up as `null` in API responses. Add `"private": true` to the attribute in your schema to hide it from the API.

## Upgrading from 1.x

2.0 requires Strapi 5 and Node 20, and ships a built `dist` instead of raw JSX. Your schemas keep working unchanged: the custom field id is still `plugin::section-divider.section-divider`.

## License

MIT © Tung Le
