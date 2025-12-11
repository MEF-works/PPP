# PIP Versioning Strategy

## Overview

PIP uses **semantic versioning** (SemVer) to manage schema evolution and ensure compatibility across the ecosystem.

## Version Format

Versions follow the pattern: `MAJOR.MINOR.PATCH`

- **MAJOR** (X.0.0): Breaking changes that require apps to update their ingestion logic
- **MINOR** (0.X.0): New optional fields or categories that don't break existing ingestion
- **PATCH** (0.0.X): Bug fixes, clarifications, or schema refinements

## Version Location

The version is specified in two places:

1. **Schema Version**: In `schema.json`, the `$schema` and `version` fields
2. **Identity Version**: In each identity JSON file, the `version` field

## Compatibility Rules

### Backward Compatibility

- **MINOR** and **PATCH** versions are backward compatible
- Apps must accept identity files with newer MINOR/PATCH versions
- Unknown fields should be ignored gracefully

### Forward Compatibility

- Apps should support multiple schema versions
- When encountering an older version, apps should:
  - Use provided fields
  - Apply sensible defaults for missing fields
  - Never fail due to version mismatch

### Breaking Changes (MAJOR)

When a MAJOR version change occurs:
- Field names may change
- Field types may change
- Required fields may be added or removed
- Structure may be reorganized

Apps must explicitly support each MAJOR version they handle.

## Version Detection

The ingester should:
1. Read the `version` field from the identity JSON
2. Validate it matches the expected format
3. Route to appropriate validation logic based on MAJOR version
4. Log warnings for unsupported versions

## Migration Strategy

### For Identity Creators

When a new MAJOR version is released:
1. Review the migration guide
2. Update your identity file to the new schema
3. Update the `version` field
4. Test with PIP-enabled apps

### For App Developers

When a new MAJOR version is released:
1. Update your ingester to support the new version
2. Maintain support for previous MAJOR versions (recommended: last 2)
3. Test with identity files from both versions
4. Update your SDK if needed

## Current Version

**v0.1.0** — Initial protocol specification

This is an early version. Breaking changes may occur before v1.0.0.

## Version History

### v0.1.0 (Current)
- Initial schema definition
- Core preference categories
- Basic metadata structure
- Signature placeholder

## Future Considerations

As PIP evolves, versioning will support:
- Multiple concurrent versions in the wild
- Automated migration tools
- Version compatibility matrices
- Deprecation timelines

## Best Practices

1. **Always specify version**: Every identity file must include a `version` field
2. **Validate version**: Apps should validate version format before processing
3. **Support multiple versions**: Apps should support at least the current and previous MAJOR version
4. **Graceful degradation**: Handle unknown versions by falling back to defaults
5. **Version logging**: Log version mismatches for debugging

## Example

```json
{
  "version": "0.1.0",
  "metadata": {
    "created": "2025-01-10T12:00:00Z",
    "updated": "2025-01-10T12:00:00Z"
  },
  "preferences": {
    ...
  }
}
```

The version `0.1.0` indicates:
- MAJOR: 0 (pre-1.0, may have breaking changes)
- MINOR: 1 (first minor version)
- PATCH: 0 (no patches yet)

