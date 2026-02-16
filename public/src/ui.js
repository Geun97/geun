import { state, updateMyData, updateCompetitorData, setDerivedData, resetState } from './state.js';
import { generateAnalysis } from './templates.js';

// Configuration: Change this to your Render Backend URL if deploying frontend separately
// e.g., 'https://observer-scraper.onrender.com'
const SCRAPER_BASE_URL = 'https://geun.onrender.com';

class AdComposer extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    connectedCallback() {
        // No event listeners here, they are attached in render methods
    }

    render() {
        this.innerHTML = ''; // Clear content
        if (state.derived) {
            this.renderDashboard();
        } else {
            this.renderInputForm();
        }
    }

    // --- INPUT VIEW ---
    renderInputForm() {
        this.innerHTML = `
            <div class="input-view">
                <div class="input-grid">
                    <!-- My Card -->
                    <div class="card">
                        <div class="card-header">
                            <h2>우리 서비스 (My Brand)</h2>
                            <span class="badge my">My Brand</span>
                        </div>
                        <div class="form-group">
                            <label>랜딩페이지 URL (필수)</label>
                            <input type="url" id="my-landing-url" value="${state.my.landingUrl || ''}" placeholder="https://my-service.com">
                        </div>
                        <div class="form-group">
                            <label>Meta 광고 라이브러리 URL (필수)</label>
                            <input type="url" id="my-meta-url" value="${state.my.metaAdLibraryUrl || ''}" placeholder="https://facebook.com/ads/library/?id=...">
                        </div>
                        <!-- Validated Status -->
                        <div id="my-status" class="status-box"></div>
                    </div>

                    <!-- Competitor Card -->
                    <div class="card">
                        <div class="card-header">
                            <h2>경쟁사 (Competitor)</h2>
                            <span class="badge comp">Competitor</span>
                        </div>
                        <div class="form-group">
                            <label>랜딩페이지 URL (필수)</label>
                            <input type="url" id="comp-landing-url" value="${state.competitor.landingUrl || ''}" placeholder="https://competitor.com">
                        </div>
                        <div class="form-group">
                            <label>Meta 광고 라이브러리 URL (필수)</label>
                            <input type="url" id="comp-meta-url" value="${state.competitor.metaAdLibraryUrl || ''}" placeholder="https://facebook.com/ads/library/?id=...">
                        </div>
                        <!-- Validated Status -->
                        <div id="comp-status" class="status-box"></div>
                    </div>
                </div>

                <div class="action-bar">
                    <button id="btn-analyze" class="btn-primary">분석 시작하기 🚀</button>
                    <div id="error-msg" style="color:red; margin-top:10px;"></div>
                </div>
                
                <p style="text-align:center; color:#666; font-size:0.8rem; margin-top:20px;">
                    * 분석 시작 시 Meta 광고 라이브러리에서 최신 광고 데이터를 자동으로 수집합니다. (약 10~20초 소요)
                </p>
            </div>
        `;

        // Bind Events
        this.querySelector('#my-landing-url').addEventListener('change', e => {
            updateMyData('landingUrl', e.target.value);
            this.validateInput();
        });
        this.querySelector('#my-meta-url').addEventListener('change', e => {
            updateMyData('metaAdLibraryUrl', e.target.value);
            this.validateInput();
        });

        this.querySelector('#comp-landing-url').addEventListener('change', e => {
            updateCompetitorData('landingUrl', e.target.value);
            this.validateInput();
        });
        this.querySelector('#comp-meta-url').addEventListener('change', e => {
            updateCompetitorData('metaAdLibraryUrl', e.target.value);
            this.validateInput();
        });

        this.querySelector('#btn-analyze').addEventListener('click', () => this.handleAnalyze());
    }

    validateInput() {
        // Optional: Add visual validation logic here
    }

    // --- DASHBOARD VIEW ---
    renderDashboard() {
        const d = state.derived;
        const myAdsCount = d.ads.my ? d.ads.my.count : 0;
        const compAdsCount = d.ads.competitor ? d.ads.competitor.count : 0;
        const matchScore = d.match.messageMatchScore;

        this.innerHTML = `
            <div class="dashboard active">
                <div class="dashboard-header no-print">
                    <button id="btn-reset" style="padding:8px 16px; cursor:pointer;">← 다시 입력</button>
                    <div style="flex:1;"></div>
                    <button id="btn-print" class="btn-primary" style="font-size:0.9rem;">PDF 다운로드 / 인쇄</button>
                </div>

                <!-- Summary Cards -->
                <div class="summary-cards">
                     <div class="summary-card">
                        <div class="value">${myAdsCount} vs ${compAdsCount}</div>
                        <div class="label">수집된 광고 수</div>
                    </div>
                    <div class="summary-card">
                        <div class="value">${matchScore}점</div>
                        <div class="label">광고-랜딩 메시지 일치도</div>
                    </div>
                    <div class="summary-card">
                        <div class="value">${d.actions.length}개</div>
                        <div class="label">제안된 액션 아이템</div>
                    </div>
                    <div class="summary-card">
                        <div class="value">${new Date(d.timestamps.analyzedAtISO).toLocaleDateString()}</div>
                        <div class="label">분석 일자</div>
                    </div>
                </div>

                <!-- Section 1: Source Info -->
                <h3 class="section-title">1. 데이터 출처 및 수집 결과</h3>
                <div class="card">
                     <p><strong>내 랜딩:</strong> <a href="${state.my.landingUrl}" target="_blank">${state.my.landingUrl}</a></p>
                     <p><strong>내 광고 라이브러리:</strong> <a href="${state.my.metaAdLibraryUrl}" target="_blank">링크</a> (${state.my.topAds ? '✅ 수집 성공' : '❌ 수집 실패'})</p>
                     <p style="font-size:0.8rem; color:#666;">${state.my.topAds ? '' : '* 광고를 찾을 수 없거나 접근이 차단되었습니다.'}</p>
                     <hr>
                     <p><strong>경쟁사 랜딩:</strong> <a href="${state.competitor.landingUrl}" target="_blank">${state.competitor.landingUrl}</a></p>
                     <p><strong>경쟁사 광고 라이브러리:</strong> <a href="${state.competitor.metaAdLibraryUrl}" target="_blank">링크</a> (${state.competitor.topAds ? '✅ 수집 성공' : '❌ 수집 실패'})</p>
                     <p style="font-size:0.8rem; color:#666;">${state.competitor.topAds ? '' : '* 광고를 찾을 수 없거나 접근이 차단되었습니다.'}</p>
                </div>

                <!-- Section 2: Ad Analysis -->
                <h3 class="section-title">2. 광고 크리에이티브 패턴 비교 (Top 10)</h3>
                <div class="input-grid">
                    <div class="card">
                        <h4>📢 내 광고 패턴</h4>
                        <p><strong>Hooks:</strong> ${d.ads.my?.hooks.slice(0, 5).join(', ') || '데이터 없음'}</p>
                        <p><strong>Offers:</strong> ${d.ads.my?.offers.slice(0, 3).join(', ') || '-'}</p>
                        <div style="margin-top:15px; max-height:300px; overflow-y:auto;">
                            ${(state.my.topAds || []).map(ad => `
                                <div style="border-bottom:1px solid #eee; padding:8px 0;">
                                    <div style="font-size:0.8rem; color:#888;">${ad.headline || 'No Headline'}</div>
                                    <div style="font-size:0.9rem;">${ad.primary_text?.substring(0, 80)}...</div>
                                    ${ad.media_preview_url ? `<img src="${ad.media_preview_url}" style="height:50px; margin-top:5px; border-radius:4px;">` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="card">
                        <h4>⚔️ 경쟁사 광고 패턴</h4>
                        <p><strong>Hooks:</strong> ${d.ads.competitor?.hooks.slice(0, 5).join(', ') || '데이터 없음'}</p>
                        <p><strong>Offers:</strong> ${d.ads.competitor?.offers.slice(0, 3).join(', ') || '-'}</p>
                        <div style="margin-top:15px; max-height:300px; overflow-y:auto;">
                            ${(state.competitor.topAds || []).map(ad => `
                                <div style="border-bottom:1px solid #eee; padding:8px 0;">
                                    <div style="font-size:0.8rem; color:#888;">${ad.headline || 'No Headline'}</div>
                                    <div style="font-size:0.9rem;">${ad.primary_text?.substring(0, 80)}...</div>
                                    ${ad.media_preview_url ? `<img src="${ad.media_preview_url}" style="height:50px; margin-top:5px; border-radius:4px;">` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Section 3: Landing Analysis -->
                <h3 class="section-title">3. 랜딩 페이지 내러티브 구조</h3>
                <div class="card">
                    <h4>내 랜딩 페이지 구조 (추정)</h4>
                    <ul>
                        ${d.landing.my.sections.map(s => `<li><strong>[${s.type}]</strong> ${s.text}</li>`).join('') || '<li>구조 분석 실패 (HTML data missing)</li>'}
                    </ul>
                </div>

                <!-- Section 4: Gap Analysis -->
                <h3 class="section-title">4. 전략적 갭 (Gap Analysis)</h3>
                <div class="card">
                    <div class="chart-bar"><div class="chart-fill" style="width: ${d.match.messageMatchScore}%"></div></div>
                    <p><strong>메시지 일치도 (${d.match.messageMatchScore}%):</strong> 광고의 훅킹 메시지가 랜딩 상단에 유지되는지 평가</p>
                    
                    <div class="chart-bar"><div class="chart-fill" style="width: ${d.match.offerMatchScore}%"></div></div>
                    <p><strong>오퍼 일치도 (${d.match.offerMatchScore}%):</strong> 광고의 가격/혜택이 랜딩에 명확히 명시되었는지 평가</p>

                    <div style="margin-top:16px;">
                        <strong>🕵️ 분석 노트:</strong>
                        <ul>${d.match.notes.map(n => `<li>${n}</li>`).join('')}</ul>
                    </div>
                </div>

                <!-- Section 5: Action Plan -->
                <h3 class="section-title">5. 우선순위 액션 플랜 (Action Plan)</h3>
                <div class="card">
                    <table class="action-table">
                        <thead>
                            <tr>
                                <th>액션 항목</th>
                                <th>근거 (Why)</th>
                                <th>Impact</th>
                                <th>Effort</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${d.actions.map(act => `
                                <tr>
                                    <td><strong>${act.title}</strong></td>
                                    <td>자동 진단 결과</td>
                                    <td><span class="badge" style="background:#fee2e2; color:#991b1b;">${act.impact}</span></td>
                                    <td>${act.effort}</td>
                                </tr>
                            `).join('')}
                             ${d.actions.length === 0 ? '<tr><td colspan="4">발견된 주요 개선사항이 없습니다. 훌륭합니다!</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>

                <div style="height:50px;"></div>
            </div>
        `;

        this.querySelector('#btn-reset').addEventListener('click', () => {
            if (confirm('입력 내용을 초기화하고 처음으로 돌아가시겠습니까?')) {
                resetState();
                this.render();
            }
        });

        this.querySelector('#btn-print').addEventListener('click', () => {
            window.print();
        });
    }

    async handleAnalyze() {
        const btn = this.querySelector('#btn-analyze');
        const err = this.querySelector('#error-msg');

        // Validation
        const missing = [];
        if (!state.my.landingUrl) missing.push("우리 랜딩 URL");
        if (!state.my.metaAdLibraryUrl) missing.push("우리 Meta URL");
        if (!state.competitor.landingUrl) missing.push("경쟁사 랜딩 URL");
        if (!state.competitor.metaAdLibraryUrl) missing.push("경쟁사 Meta URL");

        if (missing.length > 0) {
            err.innerHTML = `필수 항목을 입력해주세요:<br>- ${missing.join('<br>- ')}`;
            return;
        }

        btn.textContent = '데이터 수집 및 분석중... (약 20초)';
        btn.disabled = true;
        err.textContent = '';

        const scrapeOne = async (url) => {
            try {
                // Call Backend API
                const endpoint = `${SCRAPER_BASE_URL}/api/scrape/meta-ads`;
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ metaAdLibraryUrl: url, limit: 10 })
                });
                const data = await res.json();
                if (!data.ok) throw new Error(data.messageKo || data.errorCode);
                return data.items;
            } catch (e) {
                console.warn(`Scrape failed for ${url}`, e);
                return null; // Return null on failure but don't block everything
            }
        };

        try {
            // Parallel Scraping
            const [myAds, compAds] = await Promise.all([
                scrapeOne(state.my.metaAdLibraryUrl),
                scrapeOne(state.competitor.metaAdLibraryUrl)
            ]);

            // Note: If both fail, we might want to stop, but for now we proceed with partial data
            if (!myAds && !compAds) {
                throw new Error("광고 데이터 수집에 실패했습니다. (메타 라이브러리 접근 불가 등)");
            }

            // Update State with Scraped Data
            if (myAds) updateMyData('topAds', myAds);
            if (compAds) updateCompetitorData('topAds', compAds);

            // Generate Analysis
            // We pass empty strings for HTML source for now
            const derived = generateAnalysis(state, '', '');
            setDerivedData(derived);

            this.render(); // Show Dashboard

        } catch (e) {
            console.error(e);
            err.textContent = e.message || '분석 중 치명적인 오류가 발생했습니다.';
            btn.textContent = '분석 시작하기 🚀';
            btn.disabled = false;
        }
    }
}

customElements.define('ad-composer', AdComposer);

const render = () => {
    // Boilerplate if needed, but the component handles itself
};

export { render };
