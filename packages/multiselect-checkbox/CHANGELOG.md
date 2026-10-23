# Changelog

All notable changes to this project will be documented in this file.

## [1.1.5] - 2026-10-19

### Changed

- Unreadable stored values are handled without an unused exception variable
- Support contact updated to nhattung1511@gmail.com

## [1.0.2] - 2026-01-05

### Fixed

- Fixed data format to be 100% compatible with `strapi-plugin-multi-select`
- Changed storage from nested object format to direct JSON array format
- Now stores as `["Option 1", "Option 2"]` instead of `{"values": ["Option 1", "Option 2"]}`
- Added support for default values in schema (e.g., `"default": "[]"` or `"default": "[\"Day 1\"]"`)
- Fixed icon to match original multi-select plugin style

### Changed

- Updated component logic to match `strapi-plugin-multi-select` exactly
- Only UI difference: checkboxes instead of dropdown
- Maintains same data structure for seamless migration

## [1.0.1] - 2026-01-05

### Fixed

- Minor bug fixes and improvements

## [1.0.0] - 2026-01-05

### Added

- Initial release
- Checkbox UI for multiselect field
- Array storage (JSON type) instead of comma-separated strings
- Strapi v5 compatibility
- TypeScript support
- Configurable options through Content-Type Builder

### Changed

- Forked from [strapi-plugin-multiselect-field](https://github.com/fxm90/strapi-plugin-multiselect-field)
- Changed data type from `string` to `json`
- Removed delimiter option (no longer needed with array storage)
- Updated component logic to work with arrays
- Renamed plugin from `multiselect-field` to `multiselect-checkbox`

### Technical Details

- Data format: `["Option 1", "Option 2"]` instead of `"Option 1,Option 2"`
- Field type: `json` instead of `string`
- Better API responses with native array support
- Easier database queries with array fields
