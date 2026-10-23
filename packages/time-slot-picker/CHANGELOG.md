# Changelog

All notable changes to this project will be documented in this file.

## [1.1.4] - 2026-10-19

### Fixed

- Clicking a slot checkbox no longer submits the Content Manager form: the wrapping `<button>` is now `type="button"`
- Selected slots follow the stored value when it changes from outside (another entry loaded, form reset)

### Changed

- Maintainer contact updated to Tung Le <nhattung1511@gmail.com>

## [1.1.0] - 2025-01-05

### Added

- Responsive grid layout: 2 columns on desktop, 1 column on mobile
- Click-to-select functionality for time slot labels
- Keyboard accessibility support (Enter/Space keys)
- ARIA attributes for better screen reader support

### Changed

- **BREAKING UI CHANGE**: Time slots now display in single column per date (Morning stacked above Afternoon) instead of side-by-side
- Improved label handling using react-intl formatMessage
- Enhanced user experience with clickable slot areas
- Removed timezone display text for cleaner UI
- Removed instructional text for simpler interface
- Removed placeholder text from date picker

### Fixed

- Fixed infinite loop issue when clicking on slot labels
- Fixed label display showing "undefined" instead of configured field label
- Fixed event bubbling between slot labels and checkboxes
- Improved accessibility compliance

### Technical

- Added `useIntl` for proper internationalization
- Added keyboard event handlers for accessibility
- Added proper ARIA roles and states
- Improved styled components with focus states

## [1.0.1] - Previous Release

- Initial stable release
