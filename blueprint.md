
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
- **Link Auto-fill:** A button that, when clicked, uses the `library_url` to fetch and populate key analysis fields, without overwriting any user-entered data.
- **Analysis Trigger:** A button to initiate the analysis process. This process will automatically perform the auto-fill action if key fields are empty before proceeding. It includes loading/error state handling and a single retry on server failure.
- **Media Upload:** A multi-file input for users to upload their own images and videos (`image/*`, `video/*`). An instruction message clarifies that uploaded media will be used for display in the results.
- **Results Display:**
    - **My Ads:** A section to display the ad creatives. **Crucially, this section will display the user-uploaded images and videos.** Images will be shown as thumbnails with an option to view larger, and videos will be playable.
    - **Top 3 Competitors:** A section showcasing the ad creatives from the top three competing brands, fetched from the library.
    - **Insights Document:** A formatted section presenting key takeaways, performance metrics, and strategic recommendations.
- **Dark/Light Mode Toggle:** A user-controlled switch to change between a light and dark theme.
- **Partnership Inquiry Form:** A simple form to allow users to send partnership inquiries.

- **Web Components:**
    - `observer-header`: The main application header.
    - `url-input-form`: The URL input form, now including auto-fill and media upload capabilities.
    - `results-display`: The container for all analysis results.
    - `ad-card`: A reusable component to display individual ad creatives, now capable of rendering local `Blob` URLs for uploaded media.
    - `insight-document`: A component to display the final insights.
    - `contact-form`: The partnership inquiry form.

## Current Plan

### **Phase 4: Advanced Analysis & Media Upload**
1.  **`blueprint.md` Update:** Document the new features: Link Auto-fill, enhanced Analysis Execution, and Image/Video Uploads.
2.  **HTML (`index.html`):**
    - Add a "링크 자동 채우기" (Auto-fill Link) button next to the "분석 실행" (Execute Analysis) button.
    - Add a file input element (`<input type="file" multiple>`) for media uploads.
    - Include the specified informational text: “Meta 라이브러리 링크는 자동 분석용이며, 이미지/영상은 업로드 파일 기준으로 표시됩니다.”
3.  **JavaScript (`main.js`):**
    - **Auto-fill Logic:** Implement a function `autoFillFields()` that fetches data based on the `library_url`. It will check each target input field and update it only if it's empty.
    - **Analysis Logic Enhancement:**
        - Modify the "분석 실행" event listener to call `autoFillFields()` if essential inputs are missing.
        - Implement loading state UI (e.g., button text change, spinner).
        - Wrap the core analysis `fetch` call in a retry mechanism (e.g., a function that attempts the fetch and retries once on failure).
    - **File Handling:**
        - Create a variable to store the uploaded files.
        - Add an event listener to the file input to update this variable when files are selected.
    - **Results Rendering:**
        - Update the `ad-card` or the logic that creates it.
        - It must now use `URL.createObjectURL()` on the stored file `Blob`s to generate local URLs for the `src` attribute of `<img>` and `<video>` tags.
        - Ensure `<video>` elements have the `controls` attribute.
        - Add a click event to images to show a larger version (e.g., in a simple modal overlay).
4.  **CSS (`style.css`):**
    - Add styles for the new file input and buttons to align with the existing design.
    - Style the image modal/enlarged view.
5.  **Deployment:**
    - Verify all functionalities end-to-end in a local preview.
    - Commit all changes.
