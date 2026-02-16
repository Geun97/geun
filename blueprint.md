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
    *   **Dynamic Competitor Forms:** Users can add or remove up to three competitor sections.
    *   **Input Validation:** Ensures all required fields and correct URL formats are provided.
    *   **State Management:** All input values are automatically saved to `localStorage` and restored on page load. A "Clear All" button is available.

### **2.2. The Results (Output Stage)**

A structured, multi-section report generated from the user's input.

*   **Analysis Summary:** A high-level overview of the competitive landscape (placeholder).
*   **Landing Page Comparison (`LandingPageCompare` Component):**
    *   Side-by-side comparison of "My Service" vs. "Competitors".
    *   Pulls `og:image`, `title`, and `description` from URLs via a serverless function (`/api/og`).
    *   Displays cards with a "lifted" feel, clear typography, and a distinct style for the user's service.
*   **Ad Preview (`AdCard` Component):**
    *   Visually reconstructs ads to mimic a standard social media feed ad.
    *   Dynamically handles uploaded images, image URLs, or a placeholder if no media is provided.
    *   Includes all key elements: Advertiser name, primary text, media, headline, description, and CTA.
*   **Navigation:** A "Back to Edit" button allows for a seamless return to the Composer to refine inputs.

### **2.3. Technical Implementation**

*   **Frontend:** HTML5, CSS3, JavaScript (ESM).
    *   **Web Components:** `observer-header`, `composer-form`, `landing-page-compare`, `ad-card` for creating encapsulated, reusable UI.
    *   **Shadow DOM:** To prevent style conflicts and ensure component modularity.
*   **Backend (Serverless):**
    *   **Cloudflare Pages Functions:** A serverless function at `/functions/api/og.js` is used to fetch Open Graph metadata from user-provided URLs, bypassing browser CORS restrictions.
*   **Styling:**
    *   Modern CSS for layout and aesthetics, including Grid, Flexbox, and custom properties.
    *   Component-specific styles are encapsulated within their Shadow DOM.
*   **Data Persistence:** Browser `localStorage` for saving and retrieving form state across sessions.

---

## **4. Development History**

### **Phase 1: The Composer (Complete)**
*   Rebuilt the input form into a stateful, dynamic interface using Web Components.
*   Implemented `localStorage` for seamless state persistence.
*   Added dynamic addition/removal of competitor fields.
*   Established robust form validation.

### **Phase 2: The Results Page (Complete)**
*   Created a serverless function (`/api/og`) to fetch landing page metadata.
*   Implemented the `handleSubmit` function to orchestrate data fetching and rendering.
*   Developed the `LandingPageCompare` and `AdCard` Web Components.
*   Injected premium, modern styling into the result components for a polished UI.
*   Added the "Back to Edit" button and an "Analysis Summary" section to complete the user workflow.
*   Finalized `style.css` for a cohesive application-wide design.
