# CLAUDE.md - AI Assistant Guide

This document provides essential context for AI assistants working on the `@asagiri-design/labels-config` project.

## Project Overview

**Terminal-first GitHub label management system** - A CLI tool and npm package for managing GitHub repository labels using the `gh` CLI. No manual token management required.

**Key Features:**
- 5 CLI commands: `init`, `validate`, `sync`, `export`, `batch-sync`
- 9 pre-built label templates (minimal, github, prod-ja, prod-en, react, vue, frontend, agile)
- Dry-run mode for previewing changes
- Batch synchronization across multiple repositories
- Multiple distribution formats: CJS, ESM, UMD

**Package Info:**
- Name: `@asagiri-design/labels-config`
- Version: 0.3.0
- Node.js: >= 18.0.0
- License: MIT

## Directory Structure

```
src/
├── index.ts           # Main entry point, exports public API
├── types.ts           # Type definitions (LabelConfig, LabelRegistry)
├── validation.ts      # Zod-based validation schemas
├── manager.ts         # LabelManager class for label operations
├── cli.ts             # CLI tool implementation (~500 lines)
├── version.ts         # Version string (auto-generated on npm version)
├── config/
│   ├── index.ts       # Config module exports
│   ├── loader.ts      # ConfigLoader for loading from files
│   ├── batch-config.ts # BatchConfigLoader for batch operations
│   └── templates.ts   # Pre-built label templates
├── github/
│   ├── index.ts       # GitHub module exports
│   ├── client.ts      # GitHubClient (wrapper around gh CLI)
│   ├── sync.ts        # GitHubLabelSync for syncing labels
│   └── batch-sync.ts  # BatchLabelSync for multiple repos
└── utils/
    ├── args.ts        # CLI argument parsing
    ├── ui.ts          # Terminal UI (colors, spinners)
    └── color.ts       # Color normalization utilities
```

## Development Commands

```bash
# Install dependencies
npm install

# Build (CJS, ESM, and TypeScript declarations)
npm run build

# Type checking only
npm run type-check

# Linting (auto-fixes where possible)
npm run lint

# Run tests (vitest in watch mode)
npm test

# Run tests with coverage
npm run test:coverage

# Run CLI during development
npm run cli -- <command> [options]
```

## Build System

**Tool:** `tsup` (TypeScript bundler)

**Outputs:**
- `dist/index.js` / `dist/index.mjs` - Main library
- `dist/cli.js` - CLI entry point
- `dist/config/` - Config module
- `dist/github/` - GitHub integration module
- `dist/*.d.ts` - TypeScript type declarations

## Testing

**Framework:** Vitest

**Test files:** Co-located with source files as `*.test.ts`
- `src/manager.test.ts` - LabelManager tests
- `src/validation.test.ts` - Validation schema tests
- `src/utils/ui.test.ts` - UI utility tests
- `src/utils/platform.test.ts` - Cross-platform tests

**Running tests:**
```bash
npm test              # Watch mode
npm run test:coverage # With coverage report
```

## Code Style & Conventions

**TypeScript:**
- Strict mode enabled (`strict: true`)
- Target: ES2020
- 2-space indentation
- No semicolons (inferred from existing code)
- PascalCase for classes/interfaces, camelCase for variables/functions

**Linting:**
- ESLint with `@typescript-eslint` plugin
- `no-explicit-any`: warn
- `no-unused-vars`: error
- `no-console`: warn (except for CLI which uses console.log)

**Testing conventions:**
- Use `describe`/`it`/`expect` pattern
- Mock external dependencies (gh CLI)
- Test edge cases and error conditions

## Key Types

```typescript
// Label configuration
interface LabelConfig {
  name: string       // 1-50 chars
  color: HexColor    // 3 or 6 char hex without #
  description: string // 1-200 chars
}

// Registry with version info
interface LabelRegistry {
  version: string
  labels: LabelConfig[] | LabelCategory[]
  metadata?: Record<string, unknown>
}
```

## Architecture Notes

1. **gh CLI Integration:** Uses `child_process.execSync` to call GitHub CLI. Requires `gh auth login` for authentication.

2. **Validation:** Uses Zod schemas for runtime type checking and validation.

3. **Sync Modes:**
   - `append` (default): Adds/updates labels, keeps existing
   - `replace`: Removes labels not in config

4. **Module Exports:**
   - Main: `@asagiri-design/labels-config`
   - Config: `@asagiri-design/labels-config/config`
   - GitHub: `@asagiri-design/labels-config/github`

## CI/CD Workflows

Located in `.github/workflows/`:

- **test.yml:** Runs on push/PR - type-check, lint, test, build (Node 18.x, 20.x)
- **auto-release.yml:** Auto-bumps patch version on main merge, publishes to npm
- **manual-release.yml:** Manual version bump (patch/minor/major)
- **publish.yml:** npm publish with OIDC (Trusted Publishers)

**Skip auto-release:** Include `[skip ci]` in commit message.

## Common Tasks

### Adding a new template
1. Edit `src/config/templates.ts`
2. Add template to `CONFIG_TEMPLATES` object
3. Update template type in templates.ts
4. Add tests if needed

### Adding a CLI command
1. Edit `src/cli.ts`
2. Add command handler function
3. Update help text
4. Test with `npm run cli -- <command>`

### Modifying validation rules
1. Edit `src/validation.ts`
2. Update Zod schemas
3. Add corresponding tests in `validation.test.ts`

## Important Notes

- **External dependency:** Requires GitHub CLI (`gh`) installed and authenticated
- **Console warnings:** CLI files intentionally use `console.log` (expected lint warnings)
- **Version auto-update:** The `npm version` script auto-updates `src/version.ts`
- **No token required:** Uses `gh` CLI's built-in authentication

## Related Documentation

- `README.md` - User documentation (English)
- `README.ja.md` - User documentation (Japanese)
- `docs/API.md` - Complete API reference
- `docs/GETTING_STARTED.md` - Installation guide
- `docs/BATCH_SYNC.md` - Multi-repo sync guide
- `CONTRIBUTING.md` - Contribution guidelines
