# Changelog

## 2.0.0

### Major Changes

- c896001: Move into the strapi-field-kit monorepo and rewrite in TypeScript.

  - The package now ships a built `dist` (via `@strapi/sdk-plugin`) instead of raw JSX source.
  - The divider defaults to the full width of the edit view and can no longer be shrunk in "Configure the view". If an existing divider still shows at half width, reset its layout in "Configure the view".
  - Adds English and Vietnamese admin translations.
  - Breaking: requires Strapi 5 and Node 20+. Strapi 4 is no longer supported (the v4 admin entry was already removed in 1.0.18).

## [1.0.18] - 2026-10-19

### Fixed

- `exports.*.source` pointed at an unused Strapi v4 entry (importing `@strapi/helper-plugin`) and at a missing `server/src/index.js`; both now point at the files Strapi loads
- Removed the unused v4 admin entry, plugin id and translations

### Changed

- Maintainer email updated to nhattung1511@gmail.com

## [1.0.13] - 2024-12-02

### Fixed

- **Removed debug console.log**: Cleaned up console.log statement that was logging props on every render
  - Improves console cleanliness in production
  - Reduces unnecessary logging overhead

### Performance

- **Optimized rendering**: Wrapped component with React.memo to prevent unnecessary re-renders
  - Component now only re-renders when props actually change
  - Improves form load performance, especially with many section dividers
  - Added displayName for better debugging experience

### Changed

- Added React import for React.memo usage
- Component now uses React.memo for memoization

## [1.0.12] - Previous Release

Initial stable release with section divider functionality.
