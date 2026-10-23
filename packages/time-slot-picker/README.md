# Time Slot Picker

Part of [Strapi Field Kit](https://github.com/finnwasabi/strapi-field-kit).

A Strapi 5 custom field for picking time slots on several dates, grouped into morning and afternoon. It suits booking and availability forms.

[![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-time-slot-picker.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-time-slot-picker)
[![npm downloads](https://img.shields.io/npm/dm/@tunghtml/strapi-plugin-time-slot-picker.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-time-slot-picker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![A date card for THU, OCT 15, 2026 with morning and afternoon slots; 9:00-10:00 and 13:00-14:00 are selected](https://raw.githubusercontent.com/finnwasabi/strapi-field-kit/main/packages/time-slot-picker/docs/edit-view.png)

## Features

- One card per date, with morning and afternoon slots
- Click a slot row or its checkbox, or use Enter and Space
- Select or clear every slot of a date from its header checkbox
- Configurable slot lists
- Optional date picker so editors can add and remove dates
- English and Vietnamese admin translations

## Requirements

- Strapi 5
- Node.js 20 or later

## Installation

```bash
npm install @tunghtml/strapi-plugin-time-slot-picker
```

Strapi picks the plugin up from your dependencies. Rebuild the admin panel and restart:

```bash
npm run build
npm run develop
```

## Usage

1. Open **Content-Type Builder**, click **Add another field**, open the **Custom** tab and choose **Time Slot Picker**.
2. Tick **Editors can add and remove dates** if editors pick the dates themselves. Leave it off when dates come from your API (for example, a customer submits the days they are free and an editor picks the slots).
3. In **Advanced settings**, change **Morning Slots** and **Afternoon Slots** if the defaults (`8:00-9:00` to `12:00-13:00` and `13:00-14:00` to `17:00-18:00`) don't fit.

### In a schema file

```json
{
  "attributes": {
    "availability": {
      "type": "customField",
      "customField": "plugin::time-slot-picker.time-slot-picker",
      "options": {
        "allowDateEditing": true,
        "morningSlots": "8:00-9:00\n9:00-10:00",
        "afternoonSlots": "13:00-14:00\n14:00-15:00"
      }
    }
  }
}
```

## Data

The field is a JSON column:

```json
{
  "days": [
    { "date": "2026-06-18", "slots": ["8:00-9:00", "9:00-10:00"] },
    { "date": "2026-06-19", "slots": ["13:00-14:00"] }
  ]
}
```

To offer dates without the date picker, write `days` with empty `slots` through the API; editors then pick the slots.

## Upgrading from 1.x

2.0 requires Node 20 and ships a built `dist` instead of raw JSX. Schemas and saved data keep working unchanged: the custom field id is still `plugin::time-slot-picker.time-slot-picker`.

The date picker was removed in 1.1.0. It is back in 2.0 behind the **Editors can add and remove dates** option, which is off by default, so existing fields look the same.

## License

MIT © Tung Le
