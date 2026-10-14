# FoodFenWeb

FoodFen's web client: the restaurant owner portal (profile, menu with nutrition, paid placement) and the admin area (moderation, users, ad packages, dashboard). End users only get the landing page, sign-in, registration, password flows and a basic personal-info page; the nutrition tracker itself is the mobile app (`../FoodFenFE`).

Vite + React 19 + TypeScript, talking to `../FoodFenBE` (FastAPI). The API client in `src/api/generated` is generated from the backend's OpenAPI schema.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run verify     # typecheck + lint + tests
npm run build      # production build into dist/
npm run api:gen    # regenerate src/api/generated from http://localhost:8000/openapi.json (or OPENAPI_URL)
```

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend origin. Defaults to `http://localhost:8000`; set it to the deployed backend for a production build. |
| `VITE_GOOGLE_MAPS_API_KEY` | Location picker on the restaurant form (Maps JavaScript API and Places API (New)). Without it the form shows a plain coordinates field. |
| `VITE_GOOGLE_MAPS_MAP_ID` | Optional map style id. |

The backend's `APP_BASE_URL` must be this site's origin: email links and the ad checkout return page (`/restaurant/ads`) point here.

## More

- `CLAUDE.md`: scope, structure and conventions.
- `../FoodFenBE/docs/marketplace.md`: business rules for restaurants, moderation, admin and paid placement.
