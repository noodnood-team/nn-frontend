# Hamburger Navigation Menu & Portal Design

## 1. Intent & Scope
*   **Goal**: Add a hamburger menu to the top right of the application to serve as a navigation portal.
*   **Content**: The portal will link to three main areas:
    1.  Scan Food (Camera view)
    2.  Dashboard (Analytics and macro averages)
    3.  History (Past predictions list)
*   **Style**: The menu will appear as a Dropdown card adhering strictly to the Neo-Brutalist design system (thick borders, flat shadows, high contrast colors).

## 2. Architecture & Approach
*   **Selected Approach**: Next.js App Router Navigation (Standard Multi-Page).
*   **Routing**: The application will use distinct Next.js pages (`/`, `/dashboard`, `/history`). 

## 3. Component Details
### `components/Navbar.tsx` (New)
*   **Type**: Client Component (`"use client"`).
*   **State**: `isOpen` (boolean) to manage the dropdown visibility.
*   **Content**: 
    *   Left side: Brand logo and Name.
    *   Right side: Hamburger button (`Menu` / `X` icons from `lucide-react`).
    *   Dropdown Card: Absolute positioned below the hamburger button containing Next.js `<Link>` elements.
*   **Styling**: 
    *   Dropdown: `bg-[#f2ead6] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] z-[60]`.
    *   Text: `font-black uppercase tracking-wider`.

### `app/layout.tsx` (Modification)
*   Import and render `<Navbar />` inside the `<MobileFrame>` component, placing it directly above `{children}`.

### `app/page.tsx` (Modification)
*   Remove the hardcoded absolute Navbar Section (lines 144-157).

### New Route Stubs
*   Create `app/dashboard/page.tsx` as a placeholder.
*   Create `app/history/page.tsx` as a placeholder.

## 4. Edge Cases & Handling
*   **Click-Outside**: Implement a `useRef` and `useEffect` listener to close the dropdown if the user clicks outside the menu card.
*   **Close on Navigation**: Use `usePathname` from `next/navigation` to reset `isOpen` to `false` whenever the route changes.
*   **Z-Index**: Ensure the Navbar and Dropdown use `z-[60]` so they are not obscured by the scanner interface or result bottom sheets.
