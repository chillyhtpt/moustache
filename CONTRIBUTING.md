# Contributing to Moustache

Contributions to Moustache are welcome! Whether you are reporting a bug, proposing a feature from the [ROADMAP.md](ROADMAP.md), or submitting an enhancement, thank you for helping improve Moustache.

## Reporting a bug

Open an issue with the bug report form. Include your operating system and version,
Moustache's version (shown on the Help page), what you did, what you expected, and
what happened. For security problems, follow [SECURITY.md](SECURITY.md) instead.

## Pull requests

- Keep a pull request focused on one feature or fix, with tests where practical.
- Run `pnpm check` before opening it: formatting, lint, type check, Vitest, clippy and the
  Rust tests must pass.
- Follow the style of the code around your change. [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
  covers setup, testing and the dev app; [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
  explains how the parts fit together.
- Commit messages use [Conventional Commits](https://www.conventionalcommits.org)
  (`fix: …`, `feat: …`, `docs: …`).

By contributing, you agree that your contribution is licensed under the
[MIT license](LICENSE).
