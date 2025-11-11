# Contributing to @boxpistols/labels-config

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your feature/fix: `git checkout -b feature/your-feature-name`
4. **Install dependencies**: `npm install`

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## Making Changes

### Code Style

- Follow the existing code style
- Use TypeScript for all source files
- 2-space indentation
- Meaningful variable and function names
- JSDoc comments for public APIs

### Testing

- Write tests for new features
- Ensure all tests pass: `npm test`
- Aim for good test coverage

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add new label validation feature
fix: resolve duplicate color detection
docs: update README with examples
test: add tests for label manager
```

## Submitting Changes

1. **Push your branch** to your fork
2. **Create a Pull Request** against the main branch
3. **Describe your changes** clearly in the PR description
4. **Link related issues** (if any)
5. **Wait for review** and address any feedback

## PR Guidelines

- One feature/fix per PR
- Keep PRs focused and reasonably sized
- Include tests for new functionality
- Update documentation as needed
- Ensure CI checks pass

## Reporting Issues

When reporting bugs or suggesting features:

1. Use clear, descriptive titles
2. Provide detailed descriptions
3. Include steps to reproduce (for bugs)
4. Include relevant code snippets or error messages
5. Specify your environment (Node version, OS, etc.)

## Questions?

Feel free to open a discussion issue or reach out to the maintainers.

Thank you for contributing!
