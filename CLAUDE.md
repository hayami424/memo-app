# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A memo (note-taking) app built with React 18 + Vite 5, plain JavaScript (JSX, no TypeScript). It is currently a fresh scaffold: `src/App.jsx` only renders a heading, so the app's features are still to be built.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint over the whole project

There is no test runner configured yet. If tests are added, Vitest fits the existing Vite setup.

## Architecture

- `index.html` is the Vite entry; it loads `src/main.jsx`, which mounts `<App />` inside `StrictMode` (expect effects to run twice in dev).
- `src/index.css` holds global styles (border-box reset, system font stack with Japanese fallbacks: Hiragino Sans, Meiryo).
- No router, state library, or backend. Memos persist to `localStorage` under the key `memo-app:memos` (loaded via a lazy `useState` initializer, saved by a `useEffect` on `memos`). `createdAt` is stored as an ISO string and revived to a `Date` on load.

## Conventions

- The UI language is Japanese (`<html lang="ja">`, Japanese UI strings); keep user-facing text in Japanese.
- ESLint uses flat config (`eslint.config.js`) with React, react-hooks, and react-refresh rules. The new JSX transform is in use, so components don't import React. `react-refresh/only-export-components` warns when a component file exports non-components.
- Code style: ES modules, no semicolons, single quotes, 2-space indent.
