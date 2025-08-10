# Life Dance Timeline

A single-page React application for visualizing the sacred rhythm of your life. Upload a CSV of life phases and explore them on an interactive timeline with optional AI-powered reflections via Google's Gemini API.

## Setup

```bash
npm install
```

Create a `.env` file with your Gemini API key:

```
VITE_GEMINI_API_KEY=your_key_here
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The project uses GitHub Pages for hosting. When changes are pushed to `main`,
an automated workflow builds the site and publishes the `dist` folder to the
`gh-pages` branch. Configure GitHub Pages to serve from the `gh-pages` branch
to update [milewska.github.io](https://milewska.github.io).

## CSV Format

The CSV must include the following headers:

- `Phase Name`
- `Start Date`
- `End Date`

Optional headers such as `Strand`, `Description`, `Poetry`, etc., will be displayed in the phase modal.

## Features

- Horizontal, scrollable timeline grouped by strands
- Gantt-style stacking for overlapping phases
- Zoom controls
- Phase modal with details
- AI reflection and poetic title generation
