
// Generates a detailed analysis in Markdown format based on the current state.
const generateAnalysis = (state) => {
    if (!state.myLandingUrl && state.competitors.length === 0) {
        return "Please enter your landing page URL and at least one competitor to generate an analysis.";
    }

    let analysis = `# Marketing Analysis & Ad Copy Strategy\n\n`;
    analysis += `## 🚀 My Landing Page: ${state.myLandingUrl || 'Not provided'}\n\n`;

    if (state.competitors.length > 0) {
        analysis += `## 競合分析 (Competitor Analysis)\n\n`;
        state.competitors.forEach(c => {
            analysis += `### ${c.name || 'Unnamed Competitor'}\n`;
            analysis += `**👍 Strengths:**\n- ${c.strengths.split('\n').join('\n- ') || 'N/A'}\n\n`;
            analysis += `**👎 Weaknesses:**\n- ${c.weaknesses.split('\n').join('\n- ') || 'N/A'}\n\n`;
        });
    }

    analysis += generateSWOT(state);
    analysis += generateAdAngles(state);

    return analysis;
};

// --- Helper functions to generate specific sections ---

const generateSWOT = (state) => {
    let swot = `## SWOT 분석\n\n`;
    swot += `### Strengths (강점)
- *(내부적, 긍정적 요인)*

`;
    swot += `### Weaknesses (약점)
- *(내부적, 부정적 요인)*

`;

    // Aggregate competitor strengths to infer market threats
    const threats = state.competitors.map(c => c.strengths).flat().filter(s => s);
    swot += `### Opportunities (기회)
- *(외부적, 긍정적 요인)*

`;

    swot += `### Threats (위협)
`;
    if (threats.length > 0) {
        swot += threats.map(t => `- ${t}`).join('\n') + '\n';
    }
    swot += `
`;

    return swot;
}

const generateAdAngles = (state) => {
    let angles = `## 🎯 광고 문구 전략 (Ad Copy Angles)\n\n`;

    // Angle 1: Highlight our strengths against their weaknesses
    angles += `### Angle 1: 차별점 강조
*우리의 강점을 경쟁사의 약점과 대비시켜 강조합니다.*

`;

    // Angle 2: Address market gaps
    angles += `### Angle 2: 시장의 빈틈 공략
*경쟁사들이 제공하지 못하는 가치를 제공합니다.*

`;

    // Angle 3: General value proposition
    angles += `### Angle 3: 핵심 가치 제안
*우리의 핵심적인 장점을 직접적으로 전달합니다.*

`;

    return angles;
}

export { generateAnalysis };
