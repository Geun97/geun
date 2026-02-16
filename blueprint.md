
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
- **Web Components:**
    - `observer-header`: The main application header.
    - `url-input-form`: The URL input form.
    - `results-display`: The container for all analysis results.
    - `ad-card`: A reusable component to display individual ad creatives.
    - `insight-document`: A component to display the final insights.

## Current Plan

### **Phase 1: UI/UX and Mock Data Implementation**
1. **Structure (`index.html`):**
   - Set up the main HTML document with the title "옵저버 (Observer)".
   - Create the main layout containers for the header, input form, and results.
2. **Styling (`style.css`):**
   - Implement the modern design aesthetic.
   - Style all UI components, including the form, buttons, and result sections/cards.
   - Ensure the layout is responsive and works on different screen sizes.
3. **Logic (`main.js`):**
   - Define all the necessary Web Components (`observer-header`, `url-input-form`, `results-display`, `ad-card`, `insight-document`).
   - Add an event listener to the form to handle submission.
   - On submission, dynamically render the `results-display` component and populate it with **mock data** to simulate the analysis output. This will provide a functional front-end and a clear demonstration of the tool's capabilities.
