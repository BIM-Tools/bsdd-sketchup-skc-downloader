# SketchUp Classification Downloader

A web application for downloading SketchUp Classification (SKC) files from the buildingSMART Data Dictionary (bSDD).

## Overview

This tool allows you to easily download classification files for SketchUp from all available dictionaries in the buildingSMART Data Dictionary. Simply browse, search, and download the .skc files you need for your SketchUp projects.

## Features

- **Browse bSDD Dictionaries** - View all available classification dictionaries
- **Search & Filter** - Find dictionaries by name, code, or organization
- **One-Click Download** - Download .skc files ready for SketchUp import
- **Secure Authentication** - Login via buildingSMART Azure AD B2C
- **Modern Interface** - Clean, responsive design for all devices

## Quick Start

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Start development server:**

   ```bash
   yarn dev
   ```

3. **Build for production:**
   ```bash
   yarn build
   ```

## About SketchUp Classifications

SketchUp Classifications allow you to add semantic meaning to your 3D models by assigning standardized building industry classifications to objects. Learn more:

- [SketchUp Classifications Guide](https://help.sketchup.com/en/sketchup/classifying-objects)
- [Creating SKC Files](https://help.sketchup.com/en/sketchup/creating-skc-file)

## About bSDD

The buildingSMART Data Dictionary (bSDD) is an open, neutral, and standardized library of building objects with their properties. Learn more at [buildingsmart.org](https://www.buildingsmart.org/users/services/buildingsmart-data-dictionary/)

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and builds
- **Mantine** UI components
- **MSAL** for Azure AD B2C authentication
- **OpenAPI Generator** for type-safe API client

## API Integration

This application uses the official bSDD API with:

- Rate-limited requests (max 6/second) for compliance
- Generated TypeScript client from OpenAPI specification
- Cached dictionary loading for optimal performance

## Deployment

Built for Azure Static Web Apps with automatic CI/CD deployment.

## License

MIT License
