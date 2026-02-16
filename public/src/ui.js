
import { state, setState, addCompetitor, removeCompetitor, updateCompetitor, setMyLandingUrl } from './state.js';
import { generateAnalysis } from './templates.js';
import { exportToMarkdown, copyToClipboard } from './exporters.js';

// A simple utility to generate unique IDs
const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

class AdComposer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.addEventListeners();
        this.renderCompetitors(); // Initial render of competitors
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: var(--font-sans);
                }
                #composer-view {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .vs-layout {
                    display: flex;
                    gap: 32px;
                    align-items: flex-start;
                }
                .col {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .vs-badge {
                    font-size: 36px;
                    font-weight: bold;
                    color: var(--accent-color);
                    align-self: center;
                    margin-top: 90px; 
                }
                .card {
                    background: var(--card-background);
                    border-radius: var(--card-border-radius);
                    padding: 24px;
                    box-shadow: var(--card-shadow);
                }
                h2, h3 {
                    margin-top: 0;
                    color: var(--primary-text);
                    font-size: 24px;
                }
                .form-group {
                    margin-bottom: 16px;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: var(--secondary-text);
                }
                input, textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    box-sizing: border-box;
                    background-color: #f8f9fa;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                input:focus, textarea:focus {
                    outline: none;
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
                }
                button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 14px 22px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: background-color 0.2s, transform 0.2s, box-shadow 0.3s;
                }
                button:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                }
                .competitor-card {
                    position: relative;
                    padding-top: 20px;
                }
                .remove-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #dc3545;
                    font-size: 12px;
                    padding: 6px 10px;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                h1 {
                    text-align: center;
                    font-size: 48px;
                    color: var(--primary-text);
                    margin-bottom: 24px;
                }
                .placeholder {
                    border: 2px dashed var(--border-color);
                    border-radius: var(--card-border-radius);
                    padding: 24px;
                    text-align: center;
                    color: var(--secondary-text);
                    min-height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                 .error-message {
                    color: #dc3545;
                    background-color: #f8d7da;
                    border: 1px solid #f5c6cb;
                    border-radius: 8px;
                    padding: 16px;
                    margin-top: 16px;
                }
                .error-message ul {
                    margin: 0;
                    padding-left: 20px;
                }

                @media (max-width: 900px) {
                    .vs-layout {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .vs-badge {
                        align-self: center;
                        margin: 16px 0;
                    }
                }

            </style>

            <div id="composer-view">
                <h1>Observer</h1>
                 <div id="error-container"></div>
                <div class="vs-layout">
                    <section class="col ours">
                        <div class="card">
                            <h2>Our Company</h2>
                            <div class="form-group">
                                <label for="my-landing-url">My Landing Page URL</label>
                                <input type="url" id="my-landing-url" value="${state.myLandingUrl}" placeholder="https://example.com">
                            </div>
                        </div>
                        <div class="card">
                           <div class="placeholder">
                                Placeholder for future features.
                           </div>
                        </div>
                    </section>

                    <div class="vs-badge">VS</div>

                    <section class="col them">
                        <div class="card">
                            <h3>Competitors</h3>
                            <div id="competitors-list"></div>
                            <button id="add-competitor-btn">+ Add Competitor</button>
                        </div>
                    </section>
                </div>
                 <button id="generate-btn">분석 시작</button>
            </div>
        `;
    }

    addEventListeners() {
        const myLandingUrlInput = this.shadowRoot.getElementById('my-landing-url');
        myLandingUrlInput.addEventListener('change', (e) => {
            setMyLandingUrl(e.target.value);
        });

        const addCompetitorBtn = this.shadowRoot.getElementById('add-competitor-btn');
        addCompetitorBtn.addEventListener('click', () => {
            const newCompetitor = { id: generateId(), competitorLandingUrl: '', facebookHandle: '', instagramHandle: '', metaAdLibraryUrl: '' };
            addCompetitor(newCompetitor);
            this.renderCompetitors();
        });

        const generateBtn = this.shadowRoot.getElementById('generate-btn');
        generateBtn.addEventListener('click', () => {
            const errors = this.validateInputs();
            if (errors.length > 0) {
                this.displayErrors(errors);
                return;
            }
            this.clearErrors();

            const resultsView = document.getElementById('results-view');
            const composerView = document.getElementById('composer-view');

            const analysisHTML = generateAnalysis(state); // Removed .replace(/\n/g, '<br>') because <pre> preserves newlines

            resultsView.innerHTML = `
                <div class="results-card">
                  <div class="results-header">
                    <h2>결과</h2>
                    <button id="copy-results">복사</button>
                    <button id="back-to-edit">수정으로</button>
                  </div>
                  <pre id="results-text">${analysisHTML}</pre>
                </div>
            `;

            resultsView.querySelector('#copy-results').addEventListener('click', () => {
                copyToClipboard(exportToMarkdown(state));
                alert('Copied to clipboard!');
            });

            resultsView.querySelector('#back-to-edit').addEventListener('click', () => {
                resultsView.style.display = 'none';
                composerView.style.display = 'block';
            });

            composerView.style.display = 'none';
            resultsView.style.display = 'block';
        });

        this.shadowRoot.getElementById('competitors-list').addEventListener('change', (e) => {
            const id = e.target.closest('.competitor-card').dataset.id;
            const key = e.target.name;
            const value = e.target.value;
            updateCompetitor(id, key, value);
        });
    }

    validateInputs() {
        const errors = [];
        if (!state.myLandingUrl) {
            errors.push('내 서비스: 랜딩페이지 URL이 비어있음');
        }

        if (state.competitors.length === 0) {
            errors.push('경쟁사: 최소 1개 이상의 경쟁사를 추가해야 합니다.');
        } else {
            state.competitors.forEach((c, index) => {
                if (!c.competitorLandingUrl) {
                    errors.push(`경쟁사 ${index + 1}: 랜딩페이지 URL이 비어있음`);
                }
            });
        }

        return errors;
    }

    displayErrors(errors) {
        const errorContainer = this.shadowRoot.getElementById('error-container');
        const errorList = errors.map(e => `<li>${e}</li>`).join('');
        errorContainer.innerHTML = `
            <div class="error-message">
                <ul>${errorList}</ul>
            </div>
        `;
    }

    clearErrors() {
        const errorContainer = this.shadowRoot.getElementById('error-container');
        errorContainer.innerHTML = '';
    }

    renderCompetitors() {
        const competitorsList = this.shadowRoot.getElementById('competitors-list');
        competitorsList.innerHTML = ''; // Clear existing
        state.competitors.forEach(c => {
            const competitorEl = document.createElement('div');
            competitorEl.classList.add('card', 'competitor-card');
            competitorEl.dataset.id = c.id;
            competitorEl.innerHTML = `
                <button class="remove-btn">X</button>
                <div class="form-group">
                    <label>Competitor Landing Page URL</label>
                    <input type="url" name="competitorLandingUrl" value="${c.competitorLandingUrl}" placeholder="https://competitor.com">
                </div>
                <div class="form-group">
                    <label>Facebook Handle</label>
                    <input type="text" name="facebookHandle" value="${c.facebookHandle}" placeholder="@competitor">
                </div>
                <div class="form-group">
                    <label>Instagram Handle</label>
                    <input type="text" name="instagramHandle" value="${c.instagramHandle}" placeholder="@competitor">
                </div>
                 <div class="form-group">
                    <label>Meta Ad Library URL (Optional)</label>
                    <input type="url" name="metaAdLibraryUrl" value="${c.metaAdLibraryUrl}" placeholder="https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=competitor&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped">
                </div>
            `;
            competitorEl.querySelector('.remove-btn').addEventListener('click', () => {
                removeCompetitor(c.id);
                this.renderCompetitors();
            });
            competitorsList.appendChild(competitorEl);
        });
    }
}

customElements.define('ad-composer', AdComposer);

// Initial render logic
const render = () => {
    const composerView = document.getElementById('composer-view');
    const resultsView = document.getElementById('results-view');

    if (!document.querySelector('ad-composer')) {
        composerView.innerHTML = '<ad-composer></ad-composer>';
    }

    composerView.style.display = 'block';
    resultsView.style.display = 'none';
};

export { render };
