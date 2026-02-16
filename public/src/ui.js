import { state, updateMyData, updateCompetitorData, setDerivedData, resetState } from './state.js';
import { generateAnalysis } from './templates.js';

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
                            <h2>우리 서비스</h2>
                            <span class="badge my">My Brand</span>
                        </div>
                        <div class="form-group">
                            <label>랜딩페이지 URL (필수)</label>
                            <input type="url" id="my-landing-url" value="${state.my.landingUrl || ''}" placeholder="https://my-service.com">
                        </div>
                        <div class="form-group">
                            <label>Meta 광고 라이브러리 URL (선택)</label>
                            <input type="url" id="my-meta-url" value="${state.my.metaAdLibraryUrl || ''}" placeholder="https://facebook.com/ads/library/...">
                        </div>
                        <div class="form-group">
                            <label>Top Ads Data (JSON) - 선택 <small style="color:#666; font-weight:normal;">(Meta Ad Library 콘솔 추출)</small></label>
                            <textarea id="my-json" rows="5" placeholder='[{"primary_text": "..."}]'>${state.my.topAdsJsonRaw || ''}</textarea>
                        </div>
                    </div>

                    <!-- Competitor Card -->
                    <div class="card">
                        <div class="card-header">
                            <h2>경쟁사</h2>
                            <span class="badge comp">Competitor</span>
                        </div>
                        <div class="form-group">
                            <label>랜딩페이지 URL (필수)</label>
                            <input type="url" id="comp-landing-url" value="${state.competitor.landingUrl || ''}" placeholder="https://competitor.com">
                        </div>
                        <div class="form-group">
                            <label>Meta 광고 라이브러리 URL (선택)</label>
                            <input type="url" id="comp-meta-url" value="${state.competitor.metaAdLibraryUrl || ''}" placeholder="https://facebook.com/ads/library/...">
                        </div>
                        <div class="form-group">
                            <label>Top Ads Data (JSON) - 선택</label>
                            <textarea id="comp-json" rows="5" placeholder='[{"primary_text": "..."}]'>${state.competitor.topAdsJsonRaw || ''}</textarea>
                        </div>
                    </div>
                </div>

                <div class="action-bar">
                    <button id="btn-analyze" class="btn-primary">분석 시작하기 🚀</button>
                    <div id="error-msg" style="color:red; margin-top:10px;"></div>
                </div>
            </div>
        `;

        // Bind Events
        this.querySelector('#my-landing-url').addEventListener('change', e => updateMyData('landingUrl', e.target.value));
        this.querySelector('#my-meta-url').addEventListener('change', e => updateMyData('metaAdLibraryUrl', e.target.value));
        this.querySelector('#my-json').addEventListener('change', e => updateMyData('topAdsJsonRaw', e.target.value));

        this.querySelector('#comp-landing-url').addEventListener('change', e => updateCompetitorData('landingUrl', e.target.value));
        this.querySelector('#comp-meta-url').addEventListener('change', e => updateCompetitorData('metaAdLibraryUrl', e.target.value));
        this.querySelector('#comp-json').addEventListener('change', e => updateCompetitorData('topAdsJsonRaw', e.target.value));

        this.querySelector('#btn-analyze').addEventListener('click', () => this.handleAnalyze());
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
                        <div class="label">광고 수 (내꺼 vs 경쟁사)</div>
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
                <h3 class="section-title">1. 데이터 출처 및 수집 상태</h3>
                <div class="card">
                     <p><strong>내 랜딩:</strong> <a href="${state.my.landingUrl}" target="_blank">${state.my.landingUrl}</a></p>
                     <p><strong>경쟁사 랜딩:</strong> <a href="${state.competitor.landingUrl}" target="_blank">${state.competitor.landingUrl}</a></p>
                     <p style="font-size:0.9rem; color:#666;">* Meta 광고 라이브러리와 HTML 소스 코드를 기반으로 분석되었습니다.</p>
                </div>

                <!-- Section 2: Ad Analysis -->
                <h3 class="section-title">2. 광고 크리에이티브 패턴 비교</h3>
                <div class="input-grid">
                    <div class="card">
                        <h4>📢 내 광고 패턴</h4>
                        <p><strong>Hooks:</strong> ${d.ads.my?.hooks.join(', ') || '데이터 없음'}</p>
                        <p><strong>Offers:</strong> ${d.ads.my?.offers.join(', ') || '-'}</p>
                    </div>
                    <div class="card">
                        <h4>⚔️ 경쟁사 광고 패턴</h4>
                        <p><strong>Hooks:</strong> ${d.ads.competitor?.hooks.join(', ') || '데이터 없음'}</p>
                        <p><strong>Offers:</strong> ${d.ads.competitor?.offers.join(', ') || '-'}</p>
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

        if (!state.my.landingUrl || !state.competitor.landingUrl) {
            err.textContent = '랜딩 페이지 URL은 필수 입력 항목입니다.';
            return;
        }

        btn.textContent = '분석중...';
        btn.disabled = true;
        err.textContent = '';

        // Simulate fetching or use pasted HTML
        // const myPasted = this.querySelector('#my-html-paste')?.value; // REMOVED
        // const compPasted = this.querySelector('#comp-html-paste')?.value; // REMOVED

        // In a real app we would fetch here. For static, we rely on paste or just pass empty strings if CORS fails.
        // We'll pass the pasted content as the "HTML Source".

        // Wait a bit to simulate processing
        setTimeout(() => {
            try {
                const derived = generateAnalysis(state, '', ''); // Removed HTML pasted content
                setDerivedData(derived);
                this.render(); // Re-render to dashboard
            } catch (e) {
                console.error(e);
                err.textContent = '분석 중 오류가 발생했습니다. 데이터 형식을 확인해주세요.';
                btn.textContent = '분석 시작하기 🚀';
                btn.disabled = false;
            }
        }, 800);
    }
}

customElements.define('ad-composer', AdComposer);

const render = () => {
    // Boilerplate if needed, but the component handles itself
};

export { render };
