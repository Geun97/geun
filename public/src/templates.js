// public/src/templates.js (and dist/src/templates.js)

const safeSplit = (v, sep = "\n") =>
    String(v ?? "")
        .split(sep)
        .map(s => s.trim())
        .filter(Boolean);

// Generates a detailed analysis in Markdown format based on the current state.
const generateAnalysis = (state) => {
    if (!state.myLandingUrl && state.competitors.length === 0) {
        return "Please enter your landing page URL and at least one competitor to generate an analysis.";
    }

    let analysis = `# Marketing Analysis & Ad Copy Strategy\n\n`;
    analysis += `## 🚀 My Landing Page: ${state.myLandingUrl || "Not provided"}\n\n`;

    if (state.competitors.length > 0) {
        analysis += `## 경쟁사 분석 (Competitor Analysis)\n\n`;

        state.competitors.forEach((c, idx) => {
            const title = c.competitorLandingUrl ? c.competitorLandingUrl : `Competitor ${idx + 1}`;
            analysis += `### ${title}\n`;
            analysis += `- Landing: ${c.competitorLandingUrl || "N/A"}\n`;
            analysis += `- Facebook: ${c.facebookHandle || "N/A"}\n`;
            analysis += `- Instagram: ${c.instagramHandle || "N/A"}\n`;

            const adUrls = safeSplit(c.metaAdLibraryUrl);
            if (adUrls.length) {
                analysis += `- Meta Ad Library:\n`;
                analysis += adUrls.map(u => `  - ${u}`).join("\n") + "\n";
            } else {
                analysis += `- Meta Ad Library: N/A\n`;
            }

            analysis += `\n`;
        });
    }

    analysis += generateSWOT(state);
    analysis += generateAdAngles(state);

    return analysis;
};

// --- Helper functions to generate specific sections ---

const generateSWOT = (state) => {
    let swot = `## SWOT 분석\n\n`;
    swot += `### Strengths (강점)\n- *(내부적, 긍정적 요인)*\n\n`;
    swot += `### Weaknesses (약점)\n- *(내부적, 부정적 요인)*\n\n`;
    swot += `### Opportunities (기회)\n- *(외부적, 긍정적 요인)*\n\n`;

    // 간단 Threats: 경쟁사 랜딩/핸들 존재 자체를 힌트로만 사용(데이터 없으니 템플릿 유지)
    swot += `### Threats (위협)\n`;
    if (state?.competitors?.length) {
        swot += state.competitors
            .map((c, i) => `- 경쟁사 ${i + 1}: ${c.competitorLandingUrl || "URL 미입력"}`)
            .join("\n") + "\n";
    }
    swot += `\n`;

    return swot;
};

const generateAdAngles = (state) => {
    let angles = `## 🎯 광고 문구 전략 (Ad Copy Angles)\n\n`;
    angles += `### Angle 1: 차별점 강조\n*우리의 강점을 경쟁사의 약점과 대비시켜 강조합니다.*\n\n`;
    angles += `### Angle 2: 시장의 빈틈 공략\n*경쟁사들이 제공하지 못하는 가치를 제공합니다.*\n\n`;
    angles += `### Angle 3: 핵심 가치 제안\n*우리의 핵심적인 장점을 직접적으로 전달합니다.*\n\n`;
    return angles;
};

export { generateAnalysis };
