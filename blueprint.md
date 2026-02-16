# Blueprint: Observer - AI Competitor Analysis Tool

## 1. Project Overview

**Project Name:** Observer (옵저버)

**Definition:** An AI-powered tool that analyzes competitor strategies by simultaneously examining Meta ads and landing pages to reveal "winning strategic structures."

**Positioning:** Not just an ad analysis tool, but an AI that dissects competitor strategies.

---

## 2. Core Features (MVP to Maintain)

- Input for "My Service" landing page URL.
- Input for "Competitor" landing page URL.
- Input for "Competitor" social media account.
- "Analyze Campaign" button to trigger analysis.
- Generation of a results page based on inputs.
- Data persistence on page refresh using `localStorage`.

---

## 3. Deployment Environment

- **Platform:** Cloudflare Pages
- **Project Name:** `geuni`
- **Dashboard URL:** `https://dash.cloudflare.com/93883e3366cc4522c5aed7b69469a391/pages/view/geuni`
- **Production URL:** `https://geuni.pages.dev/` (Assumed standard Cloudflare Pages URL)
- **Connected GitHub Repository:** `https://github.com/Geun97/geun`
- **Deployment Trigger:** Automatic on push to the `main` branch.
- **Build Configuration:**
    - **Build Command:** (None - Static Site)
    - **Output Directory:** `/` (Root)

---

## 4. Current Implementation Plan

### Step 1: Landing Page Revamp (Korean Localization & Narrative)

- **Objective:** Update all UI text to Korean and align with the new "Observer" narrative.
- **File to Modify:** `index.html`, `main.js` (for Web Component templates).

- **Hero Section Text:**
    - **Headline:** "경쟁사의 광고를 보는 순간, 이기는 전략이 보입니다."
    - **Sub-headline:** "옵저버는 Meta 광고와 랜딩페이지를 동시에 분석해 전환되는 메시지와 구조를 자동으로 해부합니다."
    - **CTA Button:** "무료로 경쟁사 분석하기"

- **Input Section Titles:**
    - `My Service` → `내 서비스`
    - `Competitor` → `경쟁사 정보`
    - `Analyze Campaign` → `경쟁사 분석 시작`

### Step 2: Results Page Expansion

- **Objective:** Enhance the results page with detailed, structured, and visually clear analysis sections.
- **Files to Modify:** `new.html` (results template), `style.css` (new component styles).

- **A. Ad Structure Visualization:**
    - **UI:** A "Meta Ad Library" style ad card.
    - **Content (Static placeholders):**
        - Advertiser Name
        - Ad Format Badge (e.g., Feed, Reels)
        - Ad Copy
        - Headline
        - CTA Type
        - Media Placeholder
        - Landing Page Link

- **B. Landing Page Comparison:**
    - **UI:** A side-by-side card layout comparing "My Service" vs. "Competitor."
    - **Content (Auto-generated text):**
        - Core Message
        - Offer Strategy
        - Trust Elements
        - CTA Structure
        - Conversion Friction Points

- **C. Strategic Insights Section:**
    - **UI:** Three distinct content blocks.
    - **Content (Auto-generated text):**
        - **Market Context:** Customer problems, purchase hesitations, competitor strategy.
        - **Competitor Insights:** Message strategy, offer strategy, ad framework patterns.
        - **Actionable Strategy:** Creative recommendations, landing page improvements, testing directions.

- **D. A/B Test Template Table:**
    - **UI:** A table.
    - **Content (3 auto-generated scenarios):**
        - **Columns:** Hypothesis, Element to Change, Expected Outcome, Measurement KPI.

### Step 3: Styling and Final Touches

- **Objective:** Apply a minimal, clean SaaS aesthetic to all new components.
- **File to Modify:** `style.css`.
- **Guidelines:**
    - Use card-based layouts.
    - Ensure clear visual separation between sections.
    - Prioritize readability of analysis results.
    - Maintain responsive design.

---
