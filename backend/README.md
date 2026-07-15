# TaskFlow Backend

This is the TaskFlow backend application built with Node.js, Express, and TypeScript.

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

Server runs on `http://localhost:5000`.

## Environment

Use `backend/.env` with:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_key_change_in_production_min_32_chars_long
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## Scripts

- `npm run dev` — start development server
- `npm run build` — compile TypeScript
- `npm start` — start production server
- `npm run seed` — seed demo data

## Notes

- Ensure MongoDB is running locally or update `MONGODB_URI` to use Atlas.
- This backend exposes API routes under `/api`.
