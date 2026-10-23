# Filtered Relation

Part of [Strapi Field Kit](https://github.com/finnwasabi/strapi-field-kit).

A Strapi 5 custom field that lists entries related to the current one through another collection, filtered by field values, and lets editors change their status from the list.

[![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-filtered-relation.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-filtered-relation)
[![npm downloads](https://img.shields.io/npm/dm/@tunghtml/strapi-plugin-filtered-relation.svg)](https://www.npmjs.com/package/@tunghtml/strapi-plugin-filtered-relation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![An accepted_people field listing Ann and Bo, each with an "Accepted" status dropdown, under the hint "Filters: participantStatus = Accepted, showcase.documentId = {{current documentId}}"](https://raw.githubusercontent.com/finnwasabi/strapi-field-kit/main/packages/filtered-relation/docs/edit-view.png)

## When to use it

Say an event has participations, and each participation record has a status (`Accepted`, `Rejected`, …), a relation to the event and a list of people. On the event you want to see "who accepted" without opening every participation record. A filtered relation field shows exactly that: the people of participation records where `participantStatus = Accepted` and `event = this event`.

## Features

- Up to two filters, with `{{documentId}}` standing for the current entry
- Filter on a relation's field with a dotted name, e.g. `event.documentId`
- One row per related entry; click a row to open it
- Change status from a dropdown: the entry moves to the record with the new status (which must exist), and every filtered relation field on the page refreshes
- English and Vietnamese admin translations

## Requirements

- Strapi 5
- Node.js 20 or later

## Installation

```bash
npm install @tunghtml/strapi-plugin-filtered-relation
```

Strapi picks the plugin up from your dependencies. Rebuild the admin panel and restart:

```bash
npm run build
npm run develop
```

## Usage

Add the field from the **Custom** tab of the Content-Type Builder and fill in:

| Option | Example | Meaning |
|---|---|---|
| Display Field | `people` | Relation on the target collection whose entries are listed |
| Collection Name (advanced) | `Participation` or `api::participation.participation` | Target collection; a display name is turned into its API id |
| Filter Field 1 / Value 1 | `participantStatus` / `Accepted` | First filter |
| Filter Field 2 / Value 2 | `event.documentId` / `{{documentId}}` | Optional second filter |
| Status Field Name | `participantStatus` | Enum field on the target; leave empty to hide the status dropdown |

### In a schema file

```json
{
  "attributes": {
    "acceptedPeople": {
      "type": "customField",
      "customField": "plugin::filtered-relation.filtered-relation",
      "options": {
        "targetModel": "Participation",
        "displayField": "people",
        "filterField1": "participantStatus",
        "filterValue1": "Accepted",
        "filterField2": "event.documentId",
        "filterValue2": "{{documentId}}",
        "statusField": "participantStatus"
      }
    }
  }
}
```

## Notes

- The list is read live each time the entry opens. Don't rely on the field's stored value in your API.
- The status dropdown and the link target come from the target collection's schema, which needs Content-Type Builder read access. Without it the dropdown is hidden and links fall back to a model guessed from the display field name (`people` → `api::people.people`).
- Avoid naming the status field `status`: Strapi 5 reserves it for draft and publish.

## Upgrading from 1.x

2.0 requires Node 20 and ships a built `dist` instead of raw JSX. Schemas keep working unchanged: the custom field id is still `plugin::filtered-relation.filtered-relation`.

- Status changes write the field named in **Status Field Name**. 1.x always wrote `participantStatus`, so it only worked with that name.
- Error messages no longer mention investors and meetings.
- Rows link to the display field's real target model when the schema can be read, instead of always guessing it from the field name.
- The "Filters: …" hint now actually shows (in 1.x it was passed to a component that ignored it).

## License

MIT © Tung Le
