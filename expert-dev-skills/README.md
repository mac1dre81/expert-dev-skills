# Expert Dev Skills

A curated, production-grade repository of reusable engineering skills, standards, scripts, and quality gates for modern software teams.

## Contents

- `expert-dev-skills/`
  - Android testing playbooks
  - Telemetry/monitoring guidance
  - Reusable scripts and references
- `.windsurf/rules/`
  - Android architecture rules
  - React/TypeScript rules
  - Security-first rules
- `.github/workflows/`
  - CI quality gates for Android/tooling projects

## Usage

1. Copy `expert-dev-skills/` into your project, or use the bootstrap script:
   - `expert-dev-skills/scripts/bootstrap-new-project.sh`
2. Adopt `.windsurf/rules/*` for architecture/security guardrails.
3. Enable CI workflows in `.github/workflows/`.

## Goal

Help teams ship fast, secure, maintainable software with opinionated expert defaults.
