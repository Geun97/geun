# Blueprint: Observer - AI Ad Composer

## 1. Project Overview

**Purpose:** An interactive web application named **Observer** that allows users to input their information and competitor information to automatically generate compelling ad copy and marketing analysis.

**Core Features:**
-   Input user's landing page URL.
-   Add and remove competitor data fields.
-   Generate marketing analysis using pre-defined templates.
-   Copy the generated results to the clipboard.
-   Responsive, modern, and intuitive user interface with a "VS" comparison layout.

---

## 2. Design and Style Guide

-   **Layout:** A **responsive, two-column "VS" layout** for the main composer.
    -   **Left Column:** Holds the user's ("Our Company") information.
    -   **Right Column:** Holds the competitor's information.
    -   On smaller screens, the layout stacks vertically.
-   **Color Palette:**
    -   Primary Background: A very light, near-white gray with a subtle noise texture.
    -   Primary Accent: A vibrant blue for interactive elements.
    -   Text: Dark gray for readability.
-   **Typography:**
    -   Headings: A modern, bold sans-serif font.
    -   Service Name ("Observer"): Prominently displayed.
-   **Components:**
    -   **Cards:** "Lifted" cards with soft, multi-layered drop shadows.
    -   **Buttons:** Solid background color with a subtle "glow" effect on hover/focus.

---

## 3. Current Task: Implement Two-Column "VS" Layout

**Goal:** Refactor the UI to a two-column layout to create a clear "Us vs. Them" comparison dashboard.

**Step-by-step Plan:**

1.  **[Done] Update `blueprint.md`:** Reflect the new two-column layout and service name.
2.  **Adjust Global Styles (`public/style.css`):**
    *   Increase the `max-width` of the `#composer-view` to accommodate the side-by-side layout on larger screens.
3.  **Refactor `AdComposer` Component (`public/src/ui.js`):**
    *   Update the component's HTML structure to have a main container using Flexbox.
    *   Create a left column for "Our Company" (containing the landing page input) and a right column for "Competitors".
    *   Add a "VS" visual element in the center.
    *   Modify the component's internal styles to be responsive. The columns will stack on screens narrower than a defined breakpoint (e.g., 900px).
    *   Change the main title to "Observer".
