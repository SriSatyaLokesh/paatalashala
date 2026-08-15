# Contributing to Paatalashala

First off, thank you for taking the time to contribute to Paatalashala! 🎉

This document guides you through our development workflow, coding standards, and repository practices to help you get your contribution merged quickly.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to **srisatyalokesh@gmail.com**.

---

## How Can I Contribute?

### 1. Reporting Bugs
* Search existing issues to ensure the bug hasn't already been reported.
* Use the **Bug Report Template** to submit a new issue.
* Provide a clear description, steps to reproduce, and screenshots/videos if applicable.

### 2. Suggesting Enhancements
* Use the **Feature Request Template** to propose improvements or new audio spaces.
* Explain the user story and why this feature adds value to Paatalashala.

### 3. Submitting Pull Requests (PRs)
* Fork the repository and create your feature branch from `main`.
* Keep PRs focused on a single issue/feature.
* Reference relevant issues (e.g. `Closes #123`) in the PR description.
* Ensure code compiles successfully before opening a PR.

---

## Local Development Setup

Paatalashala is built using **Next.js** (App Router), styled with **Vanilla CSS**, and integrates the **YouTube IFrame Player API** and **Supabase Presence**.

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)

### Setup Steps
1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/paatalashala.git
   cd paatalashala
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## Editing Songs

Song data lives in `src/data/songs.json` (edited directly or via `scripts/parse_playlist.py`). The app itself never reads that file — each space page imports its own pre-split file from `src/data/songs/<place>.json` so visitors only download the songs for the space they open, instead of the entire catalog.

After changing `src/data/songs.json`, regenerate the per-space files and commit them:
```bash
npm run split-songs
```

---

## Development & Git Conventions

### Branch Naming
Use descriptive, lower-case names prefixed by the type of change:
* `feature/your-feature-name` (new features/pages)
* `fix/bug-fix-description` (bug fixes)
* `refactor/clean-up-description` (clean-ups and styling updates)
* `docs/documentation-changes` (documentation updates)

### Coding Standards
* We use **ESLint** for code linting. You can run checks with:
   ```bash
   npm run lint
   ```
* Keep pages clean and modularize logic into reusable components inside `src/components/`.
* Optimize assets before adding them. Use **WebP** instead of heavy PNGs/JPGs for background images.

### Commits
* Write clear, descriptive commit messages.
* Use the conventional commits format if possible (e.g. `feat: add shuffle hint tooltip`, `fix: correct play/pause states`).

### Verification before committing
Always run a production build local test to ensure code optimization is clean:
```bash
npm run build
```

Thank you for helping make Paatalashala a better place! 🎧
