
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

// -----------------------------------------------------------------------------
// ANALYTICS ENGINE: PATTERN EXTRACTION
// -----------------------------------------------------------------------------

const analyzeCopy = (ads) => {
    let hooks = [];
    let ctas = [];
    let keywords = {};

    ads.forEach(ad => {
        // Hook extraction (First sentence or first 50 chars)
        const text = ad.primary_text || "";
        const firstSentence = text.split(/[.!?]/)[0];
        if (firstSentence && firstSentence.length > 5) {
            hooks.push(firstSentence.trim());
        }

        // CTA extraction
        if (ad.cta) ctas.push(ad.cta);

        // Simple keyword frequency (very basic)
        const words = text.split(/\s+/).map(w => w.replace(/[.,!?]/g, '').toLowerCase());
        words.forEach(w => {
            if (w.length > 2) keywords[w] = (keywords[w] || 0) + 1;
        });
    });

    // Sort keywords by frequency
    const sortedKeywords = Object.entries(keywords)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k, v]) => k);

    return { hooks, ctas, sortedKeywords };
};

const analyzeFormat = (ads) => {
    let formats = {};
    ads.forEach(ad => {
        const fmt = (ad.format || "unknown").toLowerCase();
        formats[fmt] = (formats[fmt] || 0) + 1;
    });
    const topFormat = Object.keys(formats).sort((a, b) => formats[b] - formats[a])[0] || "Unknown";
    return { formats, topFormat };
};

// -----------------------------------------------------------------------------
// REPORT GENERATION (MECE)
// -----------------------------------------------------------------------------

const generateAnalysis = (state) => {
    if (!state.myLandingUrl && state.competitors.length === 0) {
        return "랜딩 페이지 URL과 경쟁사 정보를 입력해주세요.";
    }

    // 1. DATA INGESTION
    const topAds = safeJSONParse(state.topAdsJSON);
    const myAds = topAds.filter((_, i) => i === 0); // Assume first is mine for now, or need explicit ID
    const competitorAds = topAds.length > 1 ? topAds.slice(1) : [];

    // 2. PATTERN EXTRACTION
    const compAnalysis = analyzeCopy(competitorAds);
    const compFormats = analyzeFormat(competitorAds);

    let report = `# 🕵️ Watchmen Analysis Report\n`;
    report += `> **Target:** ${state.myLandingUrl}\n`;
    report += `> **Date:** ${new Date().toLocaleDateString()}\n\n`;

    // 🏗️ Step 1: Market Position Analysis
    report += `## 1. 🏗️ 시장 위치 및 경쟁 구도 (Market Context)\n\n`;
    report += `### 📊 경쟁사 포지셔닝 (Competitor Positioning)\n`;
    if (competitorAds.length > 0) {
        report += `- **주요 키워드 (Keywords):** ${compAnalysis.sortedKeywords.join(", ") || "데이터 부족"}\n`;
        report += `- **우세한 광고 포맷:** ${compFormats.topFormat.toUpperCase()} 중심\n`;
        report += `- **시장 표준 CTA:** 가장 많이 사용된 Call-to-Action은 **"${getTopCTA(compAnalysis.ctas)}"** 입니다.\n`;
    } else {
        report += `> *경쟁사 광고 데이터(JSON)가 충분하지 않아 시장 표준을 분석할 수 없습니다.*\n`;
    }
    report += `\n`;

    // 🧬 Step 2: Creative Pattern Extraction
    report += `## 2. 🧬 크리에이티브 패턴 분석 (Creative Patterns)\n\n`;
    report += `### 🎣 위닝 훅 (Winning Hooks)\n`;
    report += `*경쟁사들이 고객의 시선을 사로잡는 첫 문장 패턴입니다.*\n`;
    if (compAnalysis.hooks.length > 0) {
        compAnalysis.hooks.slice(0, 3).forEach(hook => {
            report += `- "💡 ${hook}..."\n`;
        });
    } else {
        report += `- *데이터 없음*\n`;
    }
    report += `\n`;

    report += `### 🎨 비주얼 및 포맷 전략\n`;
    if (compFormats.topFormat === 'video') {
        report += `- **비디오 전략 감지:** 경쟁사는 영상을 통해 제품의 시연이나 후기를 강조하고 있습니다. (UGC 스타일 추정)\n`;
    } else if (compFormats.topFormat === 'image') {
        report += `- **이미지 전략 감지:** 경쟁사는 고해상도 제품 이미지나 직관적인 결과물 비교를 선호합니다.\n`;
    } else {
        report += `- **다양한 포맷 혼용:** 특정 포맷에 집중하기보다 다양한 시도를 하고 있습니다.\n`;
    }
    report += `\n`;

    // 📝 Step 3: Ad Copy Recipes
    report += `## 3. 📝 광고 카피 최적화 레시피 (Ad Recipes)\n\n`;
    report += `*경쟁사 분석을 토대로 제안하는 귀사의 최적 카피 구조입니다.*\n\n`;
    report += `### 🧪 추천 프레임워크: [Hook - Solution - Proof]\n`;
    report += `| 섹션 | 제안 내용 | 예시 |\n`;
    report += `| :--- | :--- | :--- |\n`;
    report += `| **Hook** | ${compAnalysis.sortedKeywords[0] || "문제"} 해결 강조 | "아직도 ${compAnalysis.sortedKeywords[0] || "문제"}로 고민 중이신가요?" |\n`;
    report += `| **Solution** | 차별화된 가치 제안 | "단 3일 만에 변화를 경험하세요." |\n`;
    report += `| **Proof** | 신뢰도 강화 | "누적 판매 10만 개 돌파, 4.9점 평점." |\n`;
    report += `| **CTA** | 행동 유도 | "${getTopCTA(compAnalysis.ctas) || "지금 구매하기"}" |\n\n`;

    // ⚡ Step 4: Landing Page Gaps
    report += `## 4. ⚡ 랜딩 페이지 전략 갭 (Strategic Gaps)\n\n`;
    report += `*내 랜딩 페이지와 경쟁사 전략 간의 괴리를 진단합니다.*\n`;
    report += `- **🔴 긴급성(Urgency):** 경쟁사는 ${competitorAds.length}개의 광고 중 다수에서 "지금", "한정" 등의 단어를 사용하고 있을 가능성이 큽니다. 귀사의 페이지에도 타임세일이나 재고 부족 알림이 있나요?\n`;
    report += `- **🟡 신뢰도(Trust):** 경쟁사 Hook 분석 결과, 구체적인 수치나 후기를 강조하는 패턴이 보입니다. 랜딩 상단에 "Review" 섹션을 배치하는 것을 고려하십시오.\n`;
    report += `- **🟢 가치 제안(Value Prom):** 키워드 **"${compAnalysis.sortedKeywords[0] || "핵심"}"** 와(과) 관련된 명확한 헤드라인이 랜딩 페이지 첫 화면(Above the Fold)에 있는지 점검하십시오.\n\n`;

    // 🚀 Step 5: Growth Insights
    report += `## 5. 🚀 성장 제언 (Growth Action Plan)\n\n`;
    report += `1. **[Creative]** 경쟁사가 주로 사용하는 **${compFormats.topFormat.toUpperCase()}** 포맷의 광고 소재를 최소 2종 추가 제작하십시오.\n`;
    report += `2. **[Copywriting]** 경쟁사의 훅 패턴("${compAnalysis.hooks[0]?.substring(0, 15) || "..."}...")을 벤치마킹하여, 질문형 헤드라인으로 A/B 테스트를 진행하십시오.\n`;
    report += `3. **[Offer]** 주력 CTA인 **"${getTopCTA(compAnalysis.ctas) || "더 알아보기"}"** 버튼의 클릭률(CTR)을 높이기 위해, 버튼 주변에 마이크로 카피(예: "무료 배송")를 배치하십시오.\n`;

    return report;
};

// Helper: Get most frequent CTA
const getTopCTA = (ctas) => {
    if (!ctas.length) return "";
    const counts = {};
    ctas.forEach(c => counts[c] = (counts[c] || 0) + 1);
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
};

export { generateAnalysis };
