# Life Dance Timeline

A single-page React application for visualizing the sacred rhythm of your life. Connect directly to an Airtable base and explore its tables on an interactive timeline with optional AI-powered reflections via Google's Gemini API.

## Setup

```bash
npm install
```

Create a `.env` file with your API keys:

```
VITE_GEMINI_API_KEY=your_gemini_key
VITE_AIRTABLE_API_KEY=your_airtable_key
VITE_AIRTABLE_BASE_ID=your_base_id
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Airtable Requirements

Each selected table should include at least the following fields:

- `Phase Name`
- `Start Date`
- `End Date`

Optional fields such as `Strand`, `Description`, `Poetry`, etc., will be displayed in the phase modal.

## Features

- Horizontal, scrollable timeline grouped by strands
- Gantt-style stacking for overlapping phases
- Zoom controls
- Phase modal with details
- AI reflection and poetic title generation
