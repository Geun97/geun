// -----------------------------------------------------------------------------
// LOGIC ENGINE: PARSERS & MATCHERS
// -----------------------------------------------------------------------------

const safeJSONParse = (str) => {
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
};

// --- Landing Page Parser ---
const parseLanding = (html) => {
    if (!html) return { h1: '', h2: [], ctas: [], prices: [], socialProof: { numbers: [], badges: [], reviews: [] }, riskReversal: [], sections: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const h1 = doc.querySelector('h1')?.innerText.trim() || '';
    const h2 = Array.from(doc.querySelectorAll('h2')).map(el => el.innerText.trim()).filter(Boolean);

    // CTAs (Button/A tags with specific keywords)
    const ctaKeywords = ['구매', '신청', '시작', '알아보기', '상담', '가입', '참여', 'Get', 'Buy', 'Shop', 'Sign'];
    const ctas = Array.from(doc.querySelectorAll('a, button'))
        .map(el => el.innerText.trim())
        .filter(text => text.length < 20 && ctaKeywords.some(k => text.includes(k)));

    // Prices (Regex)
    const priceRegex = /[0-9,]+원|[0-9,]+%|월 [0-9,]+원/g;
    const bodyText = doc.body.innerText;
    const prices = [...new Set(bodyText.match(priceRegex) || [])].slice(0, 5);

    // Social Proof
    const proofKeywords = ['후기', '리뷰', '평점', '만족', '누적', '판매', '개', '명', '1위', '인증', '수상', '특허'];
    const proofSentences = bodyText.split('\n').filter(line => proofKeywords.some(k => line.includes(k)) && line.length < 50);

    const socialProof = {
        numbers: proofSentences.filter(s => /[0-9,]+(개|명|건|회|원)/.test(s)).slice(0, 5),
        badges: proofSentences.filter(s => /인증|수상|특허|파트너/.test(s)).slice(0, 5),
        reviews: proofSentences.filter(s => /후기|리뷰|평점|별점/.test(s)).slice(0, 5)
    };

    // Risk Reversal
    const riskKeywords = ['환불', '보장', '무료', '무상', 'AS', '취소', '반품'];
    const riskReversal = bodyText.split('\n').filter(line => riskKeywords.some(k => line.includes(k)) && line.length < 40).slice(0, 5);

    // Section Type Estimation (Heuristic)
    // In a real browser environment, we might use position, but here we use keywords/tags
    const sections = [];
    // Simulating sections based on heading structure
    h2.forEach(text => {
        let type = '기타';
        if (/문제|고민|힘들|어렵/i.test(text)) type = '문제제기';
        else if (/해결|솔루션|비결|방법/i.test(text)) type = '해결책';
        else if (/후기|리뷰|사례|증거/i.test(text)) type = '근거/증거';
        else if (/구성|가격|혜택|포함/i.test(text)) type = '상품/오퍼';
        else if (/질문|FAQ|궁금/i.test(text)) type = 'FAQ';
        sections.push({ type, text });
    });

    return { h1, h2, ctas: [...new Set(ctas)], prices, socialProof, riskReversal, sections };
};

// --- Ad Parser ---
const parseAds = (jsonRaw) => {
    const rawData = safeJSONParse(jsonRaw);
    if (!rawData.length) return null;

    const ads = rawData.map(ad => ({
        ad_id: ad.ad_id,
        platform: 'meta',
        format: ad.format || 'unknown',
        primary_text: ad.primary_text || '',
        headline: ad.headline || '',
        cta: ad.cta || '',
        image_url: ad.image_url
    }));

    const hooks = ads.map(ad => ad.primary_text.split(/[.\n]/)[0].trim()).filter(Boolean);
    const offers = ads.map(ad => {
        const text = ad.primary_text + ' ' + ad.headline;
        return text.match(/([0-9]+%|[0-9,]+원|무료|선착순|오늘만|한정|보장)/g);
    }).flat().filter(Boolean);

    const proofs = ads.map(ad => {
        const text = ad.primary_text + ' ' + ad.headline;
        return text.match(/([0-9,]+(개|명|건|회|위)|후기|리뷰|인증|만족)/g);
    }).flat().filter(Boolean);

    // Triggers
    const triggers = {};
    const triggerMap = {
        '희소성': ['매진', '품절', '소량', '마감', '한정'],
        '긴급성': ['오늘', '지금', '곧', '즉시', 'Time'],
        '손실회피': ['놓치', '후회', '마지막', '손해'],
        '권위': ['전문가', '의사', '박사', '공식', '인증'],
        '사회적증거': ['구매', '판매', '후기', '리뷰', '사람'],
        '편의성': ['간편', '쉬운', '빠른', '바로', '동시에'],
        '가격메리트': ['할인', '특가', '최저', '저렴', '무료']
    };

    ads.forEach(ad => {
        const text = ad.primary_text + ' ' + ad.headline;
        for (const [key, keywords] of Object.entries(triggerMap)) {
            if (keywords.some(k => text.includes(k))) {
                triggers[key] = (triggers[key] || 0) + 1;
            }
        }
    });

    return {
        count: ads.length,
        hooks: [...new Set(hooks)],
        offers: [...new Set(offers)],
        proofs: [...new Set(proofs)],
        triggers
    };
};

// --- Matching Logic ---
const calculateMatches = (myAdsSignals, myLandingSignals) => {
    if (!myAdsSignals || !myLandingSignals) return { messageMatchScore: 0, offerMatchScore: 0, proofMatchScore: 0, ctaMatchScore: 0, notes: [] };

    let notes = [];

    // 1. Message Match (Hooks vs H1/H2)
    const adKeywords = myAdsSignals.hooks.join(' ').split(/\s+/);
    const landingKeywords = (myLandingSignals.h1 + ' ' + myLandingSignals.h2.join(' ')).split(/\s+/);
    const overlap = adKeywords.filter(w => w.length > 2 && landingKeywords.some(lw => lw.includes(w)));
    const messageMatchScore = Math.min(100, Math.round((overlap.length / (adKeywords.length || 1)) * 100));
    if (messageMatchScore < 50) notes.push("🔴 광고의 핵심 키워드가 랜딩페이지 상단(H1/H2)에서 발견되지 않았습니다.");
    else notes.push("🟢 광고와 랜딩페이지의 메시지 일관성이 높습니다.");

    // 2. Offer Match
    const offerMatch = myAdsSignals.offers.filter(o => myLandingSignals.prices.some(p => p.includes(o)) || myLandingSignals.riskReversal.some(r => r.includes(o)));
    const offerMatchScore = myAdsSignals.offers.length ? Math.min(100, Math.round((offerMatch.length / myAdsSignals.offers.length) * 100)) : 0;
    if (myAdsSignals.offers.length > 0 && offerMatchScore < 50) notes.push(`🔴 광고의 오퍼(${myAdsSignals.offers[0]} 등)가 랜딩페이지에서 명확히 확인되지 않습니다.`);

    // 3. CTA Match
    const ctaMatchScore = myLandingSignals.ctas.length > 0 ? 80 : 20; // Simplified

    return { messageMatchScore, offerMatchScore, 0: 0, ctaMatchScore, notes };
};

// --- Application Logic ---
const generateAnalysis = (state, myHtml, compHtml) => {
    // 1. Parse
    const myLanding = parseLanding(myHtml);
    const compLanding = parseLanding(compHtml);

    // 2. Parse Ads (Pre-parsed or parse raw here generally raw is better source of truth)
    const myAds = parseAds(state.my.topAdsJsonRaw);
    const compAds = parseAds(state.competitor.topAdsJsonRaw);

    // 3. Match
    const match = calculateMatches(myAds, myLanding);

    // 4. Actions
    const actions = [];
    if (metaLinkMissing(state.my.metaAdLibraryUrl)) actions.push({ id: 'act_1', title: 'Meta 광고 라이브러리 연동', impact: '상', effort: '하' });
    if (!myAds && state.competitor.topAdsJsonRaw) actions.push({ id: 'act_2', title: '내 광고 데이터 입력 필요', impact: '상', effort: '하' });
    if (match.messageMatchScore < 50) actions.push({ id: 'act_3', title: '메시지 일치도 개선', impact: '상', effort: '중' });

    return {
        timestamps: { analyzedAtISO: new Date().toISOString() },
        landing: { my: myLanding, competitor: compLanding },
        ads: { my: myAds, competitor: compAds },
        match,
        actions
    };
};

const metaLinkMissing = (url) => !url || !url.includes('facebook.com/ads/library');

export { generateAnalysis };
