
# Blueprint: Observer - Meta Ad Analysis Tool

## Overview

Observer is a web-based tool designed to analyze ad campaigns from the Meta Ad Library. Users can input a URL to an ad library, and the tool will provide a breakdown of their own ad materials, a look at the top three competitors, and a document with actionable insights.

## Project Outline

### 1. **Design & Style**
- **Aesthetic:** Modern, clean, and intuitive.
- **Layout:** A single-page application with a clear input section and a structured results display.
- **Color Palette:** A professional palette using blues, greys, and whites, with accent colors to highlight key information.
- **Typography:** Clear, legible fonts to ensure readability of analysis data.
- **Iconography:** Use of icons to improve usability and visual appeal.
- **Components:**
    - Styled input fields and buttons with hover/focus effects.
    - Cards for displaying ad creatives.
    - Visually distinct sections for "My Ads," "Competitors," and "Insights."

### 2. **Features & Functionality**
- **URL Input:** A primary input field for the user to paste a Meta Ad Library URL.
- **Analysis Trigger:** A button to initiate the analysis process.
- **Results Display:**
    - **My Ads:** A section to display the ad creatives (images/videos) associated with the user's brand.
    - **Top 3 Competitors:** A section showcasing the ad creatives from the top three competing brands.
    - **Insights Document:** A formatted section presenting key takeaways, performance metrics, and strategic recommendations.
- **Dark/Light Mode Toggle:** A user-controlled switch to change between a light and dark theme for comfortable viewing in different lighting conditions.
- **Web Components:**
    - `observer-header`: The main application header.
    - `url-input-form`: The URL input form.
    - `results-display`: The container for all analysis results.
    - `ad-card`: A reusable component to display individual ad creatives.
    - `insight-document`: A component to display the final insights.

## Current Plan

### **Phase 2: Dark/Light Mode and Deployment**
1.  **`blueprint.md` Update:** Add the "Dark/Light Mode Toggle" feature.
2.  **CSS (`style.css`):**
    - Define CSS variables for light and dark themes.
    - Apply theme styles based on a `body.dark-mode` class.
3.  **HTML (`index.html`):**
    - Add a toggle switch element to the header area.
4.  **JavaScript (`main.js`):**
    - Implement the logic for the theme toggle.
    - The toggle will add/remove the `dark-mode` class on the `<body>`.
    - User's preference will be saved to `localStorage`.
5.  **Deployment:**
    - Commit all changes to the local Git repository.
    - Push the changes to the remote GitHub repository.
