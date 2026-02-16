# **Project Blueprint: The Observer**

## **1. Application Overview**

**The Observer** is a web-based application designed for marketers, growth engineers, and creative strategists. It allows users to input their landing page and competitor advertising materials (from the Meta Ad Library) to generate a comprehensive, MECE-structured analysis.

The application deconstructs competitor ads, compares landing pages, identifies strategic gaps, and automatically generates creative strategies and A/B testing templates to accelerate growth.

---

## **2. Core Features & Architecture**

The application is a single-page application (SPA) built with modern, framework-less web technologies (Web Components, ES Modules). The workflow is divided into two main parts: **The Composer** (input) and **The Results** (output).

### **2.1. The Composer (Input Stage)**

A comprehensive form interface for gathering all necessary data for the analysis.

*   **My Service:**
    *   [Required] Landing Page URL.
    *   [Optional] Core Offer, Pricing, Social Proof, Constraints, FAQ.
*   **Competitors (1-3):**
    *   [Required] Landing Page URL.
    *   [Required] Meta Ad Library URL.
    *   [Optional] Ad Details: Primary Text, Headline, Description, CTA.
    *   [Optional] Ad Format: Feed, Reels, Stories, Carousel.
    *   [Optional] Media: File Upload or Media URL.
*   **Key Functionality:**
    *   **Dynamic Competitor Forms:** Users can add or remove competitor sections.
    *   **Input Validation:** Ensures all required fields and correct URL formats are provided.
    *   **State Management:** All input values are automatically saved to `localStorage` and restored on page load. A "Reset" button is available.

### **2.2. The Results (Output Stage)**

A structured, multi-section report generated from the user's input.

*   **Ad Preview (`AdCard` Component):**
    *   Visually reconstructs ads to mimic the Meta Ad Library UI.
    *   Supports various formats (Image, Video, Carousel) and layouts (1:1, 4:5, 9:16).
    *   Includes all key elements: Advertiser, text, media, CTA, etc.
*   **Frame Gallery:**
    *   Displays the user's and competitors' ads within different standard creative frames (e.g., Reels with safe zones).
*   **Landing Page Comparison:**
    *   Side-by-side comparison of "My Service" vs. "Competitors".
    *   Pulls `og:image`, `title`, and `description` from URLs via a server-side function.
    *   Displays key elements like Core Value, CTA, and Trust Elements.
*   **MECE Analysis & Strategy:**
    *   A multi-part, auto-generated report containing:
        1.  **Market Context:** Customer problems, resistance, and competitive landscape.
        2.  **My Service Diagnosis:** Analysis of the user's own landing page funnel.
        3.  **Competitor Deep-Dive:** Funnel analysis for each competitor.
        4.  **MECE Comparison Matrix:** A structured comparison of hooks, messaging, offers, and proof.
        5.  **Creative Strategy:** Actionable A/B test ideas and format recommendations.
        6.  **Growth Landing Page Template:** A ready-to-use A/B test plan with hypothesis, metrics, and sample copy.
    *   **Exportable:** The entire analysis can be copied to the clipboard as Markdown.

### **2.3. Technical Implementation**

*   **Frontend:** HTML5, CSS3, JavaScript (ESM).
    *   **Web Components:** For creating encapsulated, reusable UI elements (`AdCard`, `LandingCompare`, etc.).
    *   **Shadow DOM:** To prevent style conflicts.
*   **Backend (Serverless):**
    *   **Cloudflare Pages Functions:** A serverless function (`/api/og`) will be used to fetch Open Graph metadata from URLs, bypassing browser CORS restrictions.
*   **Styling:**
    *   Modern CSS features (Container Queries, Cascade Layers, `:has()`).
    *   CSS Variables for robust theming (Light/Dark mode).
*   **Data Persistence:** Browser `localStorage` for form state.

---

## **3. Current Development Plan: Phase 1 - The Composer**

This phase focuses on completely rebuilding the input form to match the new, detailed requirements.

1.  **Blueprint Finalization:** The existing `blueprint.md` will be replaced with this document.
2.  **HTML Refactoring (`index.html`):**
    *   The existing `<url-input-form>` will be removed.
    *   A new, highly-structured form will be created.
    *   A `<template>` for the repeatable competitor section will be defined.
    *   Sections for "My Service" and "Competitors" will be clearly laid out with all the new required and optional fields.
3.  **JavaScript Logic (`main.js`):**
    *   The `UrlInputForm` custom element will be entirely rewritten.
    *   It will manage the state of all new input fields.
    *   Functions will be implemented to dynamically add and remove competitor form sections based on the template.
    *   A robust `saveState` and `loadState` method will be created to interact with `localStorage`.
    *   Input validation logic will be added to the "Analyze" button's event listener.
4.  **CSS Styling (`style.css`):**
    *   New styles will be added to make the complex form intuitive and visually appealing.
    *   Styles for input groups, labels, and buttons will be refined.

