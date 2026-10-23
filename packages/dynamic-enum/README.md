# Dynamic Enum

Part of [Strapi Field Kit](https://github.com/finnwasabi/strapi-field-kit).

A Strapi 5 custom field that works like a single-select enum, except editors can add a value that is not in the list by typing it.

[![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-dynamic-enum.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-dynamic-enum)
[![npm downloads](https://img.shields.io/npm/dm/@tunghtml/strapi-plugin-dynamic-enum.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-dynamic-enum)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Typing "Tutorial" into the category field offers a Create "Tutorial" option](https://raw.githubusercontent.com/finnwasabi/strapi-field-kit/main/packages/dynamic-enum/docs/create-option.png)

## Features

- Dropdown of initial options, filtered as you type
- Type a value that is not listed and pick **Create "…"** to use it
- A saved value stays selectable even after it is removed from the initial options
- Stored as a plain string, like a standard enum
- English and Vietnamese admin translations

## Requirements

- Strapi 5.33.4 or later
- Node.js 20 or later

## Installation

```bash
npm install @tunghtml/strapi-plugin-dynamic-enum
```

Strapi picks the plugin up from your dependencies. Rebuild the admin panel and restart:

```bash
npm run build
npm run develop
```

## Usage

### From the Content-Type Builder

1. Open **Content-Type Builder** and pick a content type.
2. Click **Add another field**, open the **Custom** tab and choose **Dynamic Enum**.
3. Under **Initial Options**, enter one value per line.
4. Save.

### In a schema file

```json
{
  "attributes": {
    "category": {
      "type": "customField",
      "customField": "plugin::dynamic-enum.dynamic-enum",
      "options": "News\nGuide\nRelease"
    }
  }
}
```

`options` also accepts a JSON array string such as `"[\"News\", \"Guide\"]"`.

## How it works

The value is saved as a string on the entry. A value created while editing one entry is not added to the field's initial options, so other entries won't list it. To offer it everywhere, add it to **Initial Options** in the Content-Type Builder.

## Upgrading from 1.x

2.0 requires Node 20 and ships a built `dist` instead of raw JSX. Schemas and saved data keep working unchanged: the custom field id is still `plugin::dynamic-enum.dynamic-enum` and options are read the same way.

## License

MIT © Tung Le
