# TaskFlow Frontend

This is the TaskFlow frontend application built with Next.js and TypeScript.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your `.env` file if it does not already exist.
3. Run the development server:
   ```bash
   npm run dev
   ```

App runs at `http://localhost:3000`.

## Environment

Use `frontend/.env` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts

- `npm run dev` — start development server
- `npm run build` — build production app
- `npm run start` — start production server
- `npm run lint` — run Next.js lint
- `npm run format` — format files with Prettier

## Notes

- This app uses `tailwindcss` for styling.
- The backend API is expected to run on `http://localhost:5000/api`.
