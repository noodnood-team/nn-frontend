# Dashboard Admin & Scan Rating Design

## Overview

This design covers three interconnected features for the Noodnood nutrition scanning application:

1. **Dashboard isolation** — The dashboard page (`/dashboard`) is removed from the hamburger navigation menu and is only accessible via direct URL entry. It serves as an admin-only view.
2. **Dashboard 2-column full-screen layout** — The dashboard renders in full-screen (no mobile frame), with a centered 2-column layout showing stats on the left and history on the right. The brand name changes to "ADMIN NOODNOOD".
3. **Like/Unlike scan feedback** — After scanning, users see Like/Unlike buttons on the result sheet. The rating is sent to the backend database when the user closes the result screen. The admin dashboard displays this rating data in the history list.

---

## Architecture Overview

```
User Flow:
  / (Scan Page) → Scan food → See results → Click Like/Unlike → Close result → PATCH /predictions/{id}/rate

Admin Flow:
  /dashboard (URL only) → Full-screen 2-column layout → View stats + history with rating badges
```

### Component Changes

| Component | Change |
|---|---|
| `MobileFrame.tsx` | Detect `/dashboard` pathname → render full-screen instead of mobile frame |
| `Navbar.tsx` | Remove `/dashboard` from hamburger links. Show "ADMIN NOODNOOD" when on `/dashboard` |
| `app/dashboard/page.tsx` | Full rewrite: 2-column grid layout (stats left, history right) with integrated history + pagination |
| `app/page.tsx` | Add Like/Unlike buttons to SUCCESS/NO_FOOD/ERROR result sheets. Fetch prediction ID after scan. Send rating on close. |
| `components/HistoryList.tsx` | Add `isAdminDashboard` prop. When true, display rating badges from API data in both list rows and detail modals |
| `lib/api-types.ts` | Add `rating: 'like' \| 'unlike' \| null` field to `PredictionItem` |

---

## Backend Changes

### Database Schema

Add a nullable `rating` column to the `prediction_records` table:

```python
# app/db/models.py
class PredictionRecord(Base):
    # ... existing columns ...
    rating: Mapped[str | None] = mapped_column(String(16), nullable=True)  # 'like' | 'unlike' | null
```

### Alembic Migration

Create a new migration file:

```python
# alembic/versions/0003_add_rating_column.py
def upgrade():
    op.add_column('prediction_records', sa.Column('rating', sa.String(16), nullable=True))

def downgrade():
    op.drop_column('prediction_records', 'rating')
```

### New API Endpoint

```
PATCH /api/v1/dashboard/predictions/{record_id}/rate
```

**Request Body:**
```json
{ "rating": "like" }   // or "unlike"
```

**Response:** Updated `PredictionRecordItem` with the rating field populated.

**Implementation:**
- Add to `app/api/v1/routes/dashboard.py`
- Validates `rating` is one of `'like'`, `'unlike'`
- Updates the `PredictionRecord.rating` column
- Invalidates relevant dashboard caches

### Schema Updates

```python
# app/schemas/dashboard.py
class RateRequest(BaseModel):
    rating: Literal['like', 'unlike']

# Update PredictionRecordItem to include:
    rating: str | None = None
```

---

## Frontend Changes

### 1. MobileFrame.tsx (Layout Switching)

```tsx
"use client";
import { usePathname } from "next/navigation";

export default function MobileFrame({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (isDashboard) {
    return (
      <div className="w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] overflow-auto">
        {children}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[100dvh] w-screen bg-neutral-950 overflow-hidden">
      <div className="relative w-full h-full max-w-2xl mx-auto bg-neutral-950 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
```

### 2. Navbar.tsx (Link Removal & Dynamic Title)

- Remove `{ href: "/dashboard", ... }` from `navLinks` array
- Dynamically set brand name:
  ```tsx
  const brandName = pathname === "/dashboard" ? "ADMIN NOODNOOD" : NUTRITION_APP.brand.name;
  ```

### 3. app/page.tsx (Scan Feedback Buttons)

**After successful scan:**
1. Background fetch: `GET /api/v1/dashboard/predictions?limit=1` → extract `items[0].id`
2. Store the `latestPredictionId` in component state
3. Render Like/Unlike buttons (ThumbsUp / ThumbsDown icons) in the bottom sheet
4. Track `userRating` state: `null | 'like' | 'unlike'`

**On close (resetApp):**
1. If `userRating !== null && latestPredictionId !== null`:
   - `PATCH /api/v1/dashboard/predictions/{id}/rate` with `{ rating: userRating }`
2. Then proceed with the normal reset logic

### 4. app/dashboard/page.tsx (2-Column Layout)

```
┌─────────────────────────────────────────────────────────┐
│  ADMIN NOODNOOD (Navbar)                           [≡]  │
├─────────────────────────┬───────────────────────────────┤
│                         │                               │
│   TOTAL SCANS           │   SCAN HISTORY                │
│   ┌───────────────┐     │   ┌─────────────────────────┐ │
│   │     42        │     │   │ 10:30 AM  May 18  245cal│ │
│   │  95.24% Rate  │     │   │ 09:15 AM  May 18  No Fd │ │
│   └───────────────┘     │   │ 08:00 AM  May 17  180cal│ │
│                         │   │ ...                     │ │
│   AVERAGE FUEL          │   └─────────────────────────┘ │
│   ┌────┬────┬────┐     │                               │
│   │Cal │Pro │Carb│     │   [Prev]  Page 1 of 3  [Next] │
│   │Fat │    │    │     │                               │
│   └────┴────┴────┘     │                               │
│                         │                               │
├─────────────────────────┴───────────────────────────────┤
└─────────────────────────────────────────────────────────┘
```

- Fetches both `/dashboard/summary` AND `/dashboard/predictions` on mount
- Left column: stats (existing dashboard content)
- Right column: `<HistoryList items={items} isAdminDashboard={true} />`
- Pagination controls below the history list

### 5. components/HistoryList.tsx (Rating Display)

**New prop:**
```tsx
interface HistoryListProps {
  items: PredictionItem[];
  isAdminDashboard?: boolean;
}
```

**List row changes (when isAdminDashboard):**
- Show a small ThumbsUp (green) or ThumbsDown (red) icon badge next to the calories/status text if `item.rating` is not null

**Detail modal changes (when isAdminDashboard):**
- Display a rating badge section showing the user's feedback:
  - `rating === 'like'` → Green ThumbsUp badge with "User Liked" text
  - `rating === 'unlike'` → Red ThumbsDown badge with "User Disliked" text
  - `rating === null` → Gray "No Feedback" text

---

## Edge Cases & Error Handling

### 1. ID Resolution Failure
If `GET /predictions?limit=1` fails after a scan:
- Like/Unlike buttons render in a **disabled state** with reduced opacity
- The scan result itself remains fully visible and functional

### 2. Rating Submission Failure
If `PATCH /predictions/{id}/rate` fails when closing the result screen:
- The failure is silently logged to console
- The user is not blocked from resetting the app
- The rating is simply lost for that scan

### 3. Race Condition: Rapid Scans
- Each scan independently fetches its own latest prediction ID
- Ratings are keyed by unique prediction database ID, preventing collisions

### 4. Re-Rating Behavior
- Clicking the same active button deselects it (rating returns to null, no PATCH is sent on close)
- Clicking the opposite button switches the selection

### 5. Dashboard with No History
- Left column: "No Fuel Logged" empty state card
- Right column: "No History" empty state card
- Both centered vertically within their respective columns

### 6. Non-Success Scans
- Like/Unlike buttons appear on ALL result states (SUCCESS, NO_FOOD, ERROR) since users may want to provide feedback on false negatives or errors
