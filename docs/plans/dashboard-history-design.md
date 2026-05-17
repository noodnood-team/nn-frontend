# Dashboard & History Implementation Design

## 1. Intent & Scope
*   **Goal**: Fully implement the Dashboard and Scan History pages by connecting them to the backend API and rendering the data in the Neo-Brutalist aesthetic.
*   **Target Users**: Users wanting to track their nutrition over time and review past scans.

## 2. Architecture & Data Fetching
*   **Selected Approach**: Next.js Server Components.
*   **Routing**: We will modify `app/dashboard/page.tsx` and `app/history/page.tsx` to be asynchronous Server Components.
*   **Caching**: API fetches will use `{ cache: 'no-store' }` to ensure real-time data accuracy on load.

## 3. Component Details
### Dashboard (`app/dashboard/page.tsx`)
*   **Role**: Server Component fetching `/api/v1/dashboard/summary`.
*   **UI Design**: Text-heavy brutalist summary cards displaying `total_requests`, `success_count`, and the `nutrition_averages`. No external charting libraries will be used.

### History (`app/history/page.tsx`)
*   **Role**: Server Component fetching `/api/v1/dashboard/predictions?limit=20&offset=0`.
*   **UI Design**: 
    *   Renders a Client Component: `components/HistoryList.tsx`.
    *   The list will display minimalist rows showing only Time and Calories.
    *   Clicking a row opens a Neo-Brutalist **Modal** (matching the scanner's success result screen) to show the full macro breakdown (Protein, Carbs, Fat) and messages.

## 4. Edge Cases & Error Handling
*   **Empty States**: If no scans exist, display massive styled messages (e.g., "NO FUEL LOGGED YET").
*   **Error Boundaries**: Implement `error.tsx` in both route folders to gracefully catch backend fetch failures.
*   **Loading States**: Implement `loading.tsx` in both route folders to display brutalist skeletons while the server fetches data.
