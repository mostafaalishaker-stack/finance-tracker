# Finance Tracker

A personal finance tracking application with data visualization.

## Features

- Income/expense tracking
- Category management
- Monthly summaries
- Data visualization with charts
- JWT authentication
- Dark theme UI

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Recharts, Axios
- **Backend**: Node.js, Express, TypeScript, JWT, bcryptjs

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on port 3004 and proxies API requests to port 5004.
