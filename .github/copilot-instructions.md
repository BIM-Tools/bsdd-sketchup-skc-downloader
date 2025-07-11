# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Vite + React + TypeScript project configured for Azure Static Web Apps deployment.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **SWC** - Fast Rust-based compiler for faster builds
- **ESLint** - Code linting with TypeScript support

## Development Guidelines

- Use TypeScript for all new files
- Follow React 19 best practices
- Use functional components with hooks
- Implement proper error boundaries
- Use proper TypeScript types instead of `any`
- Follow ESLint rules for consistent code style

## Static Web Apps Configuration

- Build output goes to `dist/` directory
- API routes can be added in `api/` directory
- Environment variables should be prefixed with `VITE_`
