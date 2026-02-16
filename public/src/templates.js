
const safeSplit = (v, sep = "\n") =>
    String(v ?? "")
        .split(sep)
        .map(s => s.trim())
        .filter(Boolean);

const safeJSONParse = (str) => {
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
};

// Generates a detailed analysis in Markdown format based on the current state.
const generateAnalysis = (state) => {
    if (!state.myLandingUrl && state.competitors.length === 0) {
        return "Please enter your landing page URL and at least one competitor to generate an analysis.";
    }

    const topAds = safeJSONParse(state.topAdsJSON);
    const myAd = topAds.length > 0 ? topAds[0] : null;
    const competitorAds = topAds.length > 1 ? topAds.slice(1, 4) : [];

    let analysis = `# Marketing Analysis & Ad Copy Strategy\n\n`;
    analysis += `## 🚀 My Landing Page: ${state.myLandingUrl || "Not provided"}\n\n`;

    // 1. My Ad Strategy Card
    analysis += `## 1. My Ad Strategy (Based on Input)\n`;
    if (myAd) {
        analysis += renderAdCard(myAd, "My Ad");
    } else {
        analysis += `> **Note:** No JSON data provided for My Ad. Please input "Top Ads Data" to see this section.\n\n`;
    }

    // 2. Competitor Top 3 Analysis
    analysis += `## 2. Competitor Top Ads Analysis\n`;
    if (competitorAds.length > 0) {
        competitorAds.forEach((ad, idx) => {
            analysis += renderAdCard(ad, `Competitor Ad #${idx + 1}`);
        });
    } else {
        analysis += `> **Note:** Not enough JSON data provided for Competitor Ads.\n\n`;
    }

    // 3. Format Frames
    analysis += generateFormatFrames();

    // 4. MECE Insights
    analysis += generateMECEInsights(state, topAds);

    // 5. Growth A/B Templates
    analysis += generateGrowthTemplates();

    return analysis;
};

const renderAdCard = (ad, title) => {
    let card = `### 🏷️ ${title}\n`;
    card += `| Item | Content |\n`;
    card += `| :--- | :--- |\n`;
    if (ad.media_url) card += `| **Visual** | [Image/Video Link](${ad.media_url}) |\n`;
    card += `| **Primary Text** | ${ad.primary_text || '-'} |\n`;
    card += `| **Headline** | ${ad.headline || '-'} |\n`;
    card += `| **CTA** | ${ad.cta || '-'} |\n`;
    card += `| **Format** | ${ad.format || 'Unknown'} |\n`;
    if (ad.frame_tags) card += `| **Tags** | ${Array.isArray(ad.frame_tags) ? ad.frame_tags.join(', ') : ad.frame_tags} |\n`;
    card += `\n`;
    return card;
};

const generateFormatFrames = () => {
    let section = `## 3. Winning Format Frames (Templates)\n\n`;

    section += `### 🖼️ Image Ad Frame\n`;
    section += `- **Hook (Top 20%):** "Stop [Pain Point] Forever"\n`;
    section += `- **Visual:** High-contrast product shot or "Problem vs Solution" split screen.\n`;
    section += `- **Body:** Short social proof (e.g., "Rated 4.9/5 by 10k users").\n`;
    section += `- **CTA:** "Shop Now for 50% Off"\n\n`;

    section += `### 🎥 Video/Reels Frame (UGC Style)\n`;
    section += `- **0-3s (Hook):** Visual interruption + Question ("Do you still struggle with...?")\n`;
    section += `- **3-15s (Proof):** User testimonial / Unboxing / Before & After.\n`;
    section += `- **15-30s (Offer):** "Get yours today at [Link]."\n\n`;

    section += `### 🎠 Carousel Frame\n`;
    section += `- **Card 1:** The Problem (Agitation)\n`;
    section += `- **Card 2:** The Solution (Product Intro)\n`;
    section += `- **Card 3:** Social Proof (Reviews)\n`;
    section += `- **Card 4:** Offer + CTA\n\n`;

    return section;
};

const generateMECEInsights = (state, topAds) => {
    let section = `## 4. Strategic Insights (MECE)\n\n`;

    section += `### 🏗️ Market Context\n`;
    section += `- **Trend:** What is the current standard in this niche? (Analyze competitors' landing pages)\n`;
    section += `- **Gap:** What are competitors missing? (e.g., Guarantee, Specificity, Speed)\n\n`;

    section += `### ⚔️ Competitor Patterns\n`;
    if (topAds.length > 0) {
        section += `- **Common Hooks:** ${topAds.map(a => `"${(a.primary_text || '').substring(0, 30)}..."`).join(', ')}\n`;
        section += `- **Dominant Format:** ${topAds.map(a => a.format).join(', ')}\n`;
    } else {
        section += `- *Input JSON data to see specific competitor patterns.*\n`;
    }
    section += `\n`;

    section += `### 💎 Opportunity (Our Gap)\n`;
    section += `- [ ] Action: differentiate by stronger offer or better creative quality.\n`;
    section += `- [ ] Action: Address objections that competitors ignore.\n\n`;

    return section;
};

const generateGrowthTemplates = () => {
    let section = `## 5. Growth A/B Landing Page Templates\n\n`;

    const templates = [
        { type: "FOMO", desc: "Urgency-driven. Countdowns, limited stock." },
        { type: "Social Proof", desc: "Review-heavy. 'Join 10,000+ Happy Customers'." },
        { type: "Offer", desc: "Value-first. 'Buy 1 Get 1 Free' or '50% Off'." },
        { type: "Authority", desc: "Expert-backed. 'Recommended by Doctors/Experts'." },
        { type: "UGC", desc: "User-centric. Real people using the product." },
        { type: "Comparison", desc: "Us vs Them table. Logical persuasion." }
    ];

    templates.forEach(t => {
        section += `### 📝 ${t.type} Template\n`;
        section += `> **Focus:** ${t.desc}\n`;
        section += `- **Headline:** [Strong Benefit Statement]\n`;
        section += `- **Sub-headline:** [Support with stats or proof]\n`;
        section += `- **Hero:** [Relevant Visual]\n`;
        section += `- **CTA:** [Direct Action]\n\n`;
    });

    return section;
};

export { generateAnalysis };
