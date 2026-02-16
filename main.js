class ObserverHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; background-color: #fff; padding: 1rem 2rem; border-bottom: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-size: 1.5rem; font-weight: bold; color: #0078FF; }
            </style>
            The Observer
        `;
    }
}

class ComposerForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                 h1 { font-size: 1.8rem; margin-top: 0; }
                fieldset { border: 1px solid #ccc; border-radius: 6px; padding: 1.5rem; margin-bottom: 1.5rem; }
                legend { font-weight: bold; font-size: 1.2rem; padding: 0 0.5rem; color: #333; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .full-width { grid-column: 1 / -1; }
                label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
                input[type="url"], input[type="text"], textarea, select { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
                input:focus, select:focus, textarea:focus { outline: none; border-color: #0078FF; box-shadow: 0 0 0 2px rgba(0, 120, 255, 0.2); }
                .optional-toggle { color: #0078FF; cursor: pointer; font-weight: 600; margin-bottom: 1rem; }
                .optional-content { display: none; padding-top: 1rem; border-top: 1px dashed #ccc; }
                .optional-content.visible { display: block; }
                .competitor-fieldset { position: relative; border-color: #e0e0e0; }
                .remove-competitor-btn { position: absolute; top: 1.2rem; right: 1.5rem; background: #ff4d4d; color: white; border: none; border-radius: 4px; padding: 0.3rem 0.6rem; cursor: pointer; font-size: 0.8rem; }
                .form-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 2rem; }
                button { padding: 0.8rem 1.5rem; border-radius: 6px; border: none; font-size: 1rem; font-weight: 600; cursor: pointer; }
                #add-competitor-btn { background-color: #e9ecef; color: #333; border: 1px solid #ccc; }
                 #analyze-btn { background-color: #0078FF; color: white; }
                 #analyze-btn[disabled] { background-color: #a0a0a0; cursor: not-allowed; }
                #reset-btn { background: none; border: none; color: #6c757d; text-decoration: underline; }
                 #error-message { color: red; margin-bottom: 1rem; display: none; }
            </style>
            <form id="composer-form">
                <div id="error-message"></div>
                <h1>Analysis Composer</h1>
                <fieldset>
                    <legend>My Service</legend>
                    <div class="form-grid">
                        <div class="full-width">
                            <label for="my-landing-url">Landing Page URL</label>
                            <input type="url" id="my-landing-url" name="my_landing_url" required placeholder="https://myservice.com">
                        </div>
                        <div class="full-width optional-details">
                            <p class="optional-toggle">My Service Details (Optional)</p>
                            <div class="optional-content">
                                <div class="form-grid">
                                     <div class="full-width"><label>Core Offer</label><textarea name="my_offer" rows="2"></textarea></div>
                                     <div><label>Pricing</label><input type="text" name="my_pricing"></div>
                                     <div><label>Social Proof</label><input type="text" name="my_proof"></div>
                                     <div><label>Constraints</label><input type="text" name="my_constraints"></div>
                                     <div><label>FAQ Snippet</label><input type="text" name="my_faq"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div id="competitors-container"></div>
                <div class="form-actions">
                    <button type="button" id="add-competitor-btn">+ Add Competitor</button>
                    <button type="button" id="reset-btn">Clear All Inputs</button>
                    <button type="submit" id="analyze-btn">Analyze</button>
                </div>
            </form>
        `;
    }

    connectedCallback() {
        this.form = this.shadowRoot.querySelector('#composer-form');
        this.competitorsContainer = this.shadowRoot.querySelector('#competitors-container');
        this.errorMessage = this.shadowRoot.querySelector('#error-message');
        this.analyzeBtn = this.shadowRoot.querySelector('#analyze-btn');

        this.shadowRoot.querySelector('#add-competitor-btn').addEventListener('click', () => this.addCompetitor());
        this.shadowRoot.querySelector('#reset-btn').addEventListener('click', () => this.resetForm());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.form.addEventListener('input', () => this.saveState());

        this.loadState();
        this.registerOptionalToggles();
    }

    addCompetitor(data = {}) {
        if (this.competitorsContainer.children.length >= 3) {
            this.showError("Maximum of 3 competitors reached.");
            return;
        }
        const template = document.getElementById('competitor-template');
        const clone = template.content.cloneNode(true);
        for (const key in data) {
            const el = clone.querySelector(`[name="${key}"]`);
            if (el && el.type !== 'file') el.value = data[key];
        }
        clone.querySelector('.remove-competitor-btn').addEventListener('click', (e) => {
            e.target.closest('.competitor-fieldset').remove();
            this.saveState();
        });
        this.competitorsContainer.appendChild(clone);
        this.registerOptionalToggles(this.competitorsContainer.lastElementChild);
    }

    registerOptionalToggles(context = this.shadowRoot) {
        context.querySelectorAll('.optional-toggle').forEach(toggle => {
            if (toggle.dataset.listenerAttached) return;
            toggle.dataset.listenerAttached = true;
            toggle.addEventListener('click', () => {
                const content = toggle.nextElementSibling;
                content.classList.toggle('visible');
            });
        });
    }

    saveState() {
        const data = this.getFormData(false); // don't include file objects in state
        localStorage.setItem('composerState', JSON.stringify(data));
    }

    loadState() {
        const state = JSON.parse(localStorage.getItem('composerState'));
        if (!state) {
            this.addCompetitor();
            return;
        }
        // Restore my service data
        for (const key in state.my_service) {
            const el = this.form.querySelector(`[name="${key}"]`);
            if (el) el.value = state.my_service[key];
        }
        // Restore competitors
        if (state.competitors && state.competitors.length) {
            state.competitors.forEach(compData => this.addCompetitor(compData));
        } else {
            this.addCompetitor();
        }
        // Restore visibility of optional sections
        this.shadowRoot.querySelectorAll('.optional-content').forEach(content => {
            let hasContent = false;
            content.querySelectorAll('input, textarea').forEach(input => {
                if (input.value) hasContent = true;
            });
            if (hasContent) content.classList.add('visible');
        });
    }

    resetForm() {
        if (confirm('Clear all inputs?')) {
            this.form.reset();
            this.competitorsContainer.innerHTML = '';
            localStorage.removeItem('composerState');
            this.addCompetitor();
            this.showError('');
        }
    }

    getFormData(includeFiles = true) {
        const data = { my_service: {}, competitors: [] };

        const myServiceFieldset = this.form.querySelector('fieldset:first-of-type');
        myServiceFieldset.querySelectorAll('input, textarea').forEach(el => {
            data.my_service[el.name] = el.value;
        });

        this.competitorsContainer.querySelectorAll('.competitor-fieldset').forEach(fieldset => {
            const competitorData = {};
            fieldset.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.type === 'file' && includeFiles && el.files.length > 0) {
                    competitorData[el.name] = el.files[0];
                } else if (el.type !== 'file') {
                    competitorData[el.name] = el.value;
                }
            });
            data.competitors.push(competitorData);
        });

        return data;
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.showError('');
        if (!this.form.checkValidity()) {
            this.showError('Please fill out all required URL fields.');
            return;
        }
        this.analyzeBtn.disabled = true;
        this.analyzeBtn.textContent = 'Analyzing...';
        const data = this.getFormData();
        try {
            const ogResults = await Promise.all([
                fetch(`/api/og?url=${encodeURIComponent(data.my_service.my_landing_url)}`).then(res => res.ok ? res.json() : { error: 'Failed to fetch' }),
                ...data.competitors.map(c => fetch(`/api/og?url=${encodeURIComponent(c.competitor_landing_url)}`).then(res => res.ok ? res.json() : { error: 'Failed to fetch' }))
            ]);
            data.my_service.og = ogResults[0];
            data.competitors.forEach((comp, i) => { comp.og = ogResults[i + 1]; });
            
            document.getElementById('composer-container').style.display = 'none';
            document.getElementById('results-container').style.display = 'block';
            renderResults(data);
        } catch (error) {
            this.showError(`Analysis failed: ${error.message}`);
        } finally {
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.textContent = 'Analyze';
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = message ? 'block' : 'none';
    }
}

function renderResults(data) {
    const container = document.getElementById('results-container');
    container.innerHTML = ''; 

    const backButton = document.createElement('button');
    backButton.id = 'back-to-edit-btn';
    backButton.textContent = '← Back to Edit';
    backButton.onclick = () => {
        document.getElementById('results-container').style.display = 'none';
        document.getElementById('composer-container').style.display = 'block';
        window.scrollTo(0, 0);
    };
    container.appendChild(backButton);

    const summarySection = document.createElement('div');
    summarySection.className = 'results-section';
    summarySection.innerHTML = '<h2>Analysis Summary</h2><p>A high-level summary of the competitive landscape will be generated here.</p>';
    container.appendChild(summarySection);

    const landingSection = document.createElement('div');
    landingSection.className = 'results-section';
    landingSection.innerHTML = '<h2>Landing Page Comparison</h2>';
    const landingCompare = document.createElement('landing-page-compare');
    landingCompare.setData(data.my_service, data.competitors);
    landingSection.appendChild(landingCompare);
    container.appendChild(landingSection);
    
    const adSection = document.createElement('div');
    adSection.className = 'results-section';
    adSection.innerHTML = '<h2>Ad Previews</h2>';
    let hasAds = false;
    data.competitors.forEach(competitor => {
        const adDataExists = Object.keys(competitor).some(key => key.startsWith('ad_') && competitor[key]);
        if (adDataExists) {
            const adCard = document.createElement('ad-card');
            adCard.setData(competitor);
            adSection.appendChild(adCard);
            hasAds = true;
        }
    });
    if (hasAds) {
        container.appendChild(adSection);
    }
}

class LandingPageCompare extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    setData(myService, competitors) {
        let competitorCards = competitors.map(c => this.createCard(c.og, c.competitor_landing_url, 'Competitor')).join('');
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .compare-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
                .card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform .2s, box-shadow .2s; }
                .card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
                .card.my-service { border: 2px solid #0078FF; }
                .card-header { font-weight: 600; padding: 0.75rem 1.25rem; background: #f7f7f7; border-bottom: 1px solid #eee; }
                .card-header.my-service-header { background: #0078FF; color: white; }
                .card-body { padding: 1.25rem; }
                .og-image { width: 100%; height: 150px; object-fit: cover; background: #eee; }
                .og-title { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; color: #1c1e21; }
                .og-desc { font-size: 0.9rem; color: #65676b; line-height: 1.4; height: 5.4em; overflow: hidden; }
                .card-link { display: inline-block; margin-top: 1rem; font-size: 0.9rem; color: #0078FF; text-decoration: none; font-weight: 600; }
            </style>
            <div class="compare-grid">
                ${this.createCard(myService.og, myService.my_landing_url, 'My Service', true)}
                ${competitorCards}
            </div>
        `;
    }
    createCard(og, url, title, isMyService = false) {
        return `
            <div class="card ${isMyService ? 'my-service' : ''}">
                <div class="card-header ${isMyService ? 'my-service-header' : ''}">${title}</div>
                <img src="${og?.image || 'https://via.placeholder.com/400x200?text=No+Preview'}" class="og-image" alt="Preview image">
                <div class="card-body">
                    <h4 class="og-title">${og?.title || 'Title not available'}</h4>
                    <p class="og-desc">${og?.description || 'Description not available.'}</p>
                    <a href="${url}" target="_blank" class="card-link">Visit Page &rarr;</a>
                </div>
            </div>
        `;
    }
}

class AdCard extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    setData(ad) {
        const mediaHTML = ad.ad_media_file 
            ? `<img src="${URL.createObjectURL(ad.ad_media_file)}" alt="Ad Media">`
            : (ad.ad_media_url ? `<img src="${ad.ad_media_url}" alt="Ad Media">` : '<div class="media-placeholder"><div>No Media Provided</div></div>');

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; margin-bottom: 2rem; }
                .ad-card { max-width: 500px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                .ad-header { display: flex; align-items: center; padding: 12px; }
                .advertiser-icon { width: 40px; height: 40px; border-radius: 50%; background: #ccc; margin-right: 12px; }
                .advertiser-info { font-weight: 600; font-size: 15px; }
                .primary-text { padding: 0 16px 12px; font-size: 15px; line-height: 1.4; white-space: pre-wrap; word-wrap: break-word; }
                .ad-media { position: relative; width: 100%; padding-top: 52.5%; /* 1.91:1 Aspect Ratio */ background: #f0f2f5; }
                .ad-media img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
                .media-placeholder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #888; }
                .ad-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f0f2f5; text-decoration: none; color: inherit; }
                .footer-text { flex: 1; margin-right: 12px; overflow: hidden; }
                .headline { font-weight: 600; font-size: 15px; text-transform: uppercase; color: #65676b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
                .description { font-size: 15px; color: #65676b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
                .cta-button { background-color: #1b74e4; color: white; font-weight: bold; font-size: 14px; padding: 10px 20px; border-radius: 6px; text-align: center; border: none; white-space: nowrap; }
            </style>
            <div class="ad-card">
                <div class="ad-header">
                    <div class="advertiser-icon"></div>
                    <div class="advertiser-info">${ new URL(ad.competitor_ad_link).hostname }</div>
                </div>
                <p class="primary-text">${ad.ad_primary_text || ''}</p>
                <div class="ad-media">${mediaHTML}</div>
                <a href="${ad.competitor_ad_link || '#'}" target="_blank" class="ad-footer">
                    <div class="footer-text">
                        <div class="headline">${ad.ad_headline || 'HEADLINE'}</div>
                        <div class="description">${ad.ad_description || 'Description text goes here.'}</div>
                    </div>
                    <div class="cta-button">${ad.ad_cta || 'Learn More'}</div>
                </a>
            </div>
        `;
    }
}

customElements.define('observer-header', ObserverHeader);
customElements.define('composer-form', ComposerForm);
customElements.define('landing-page-compare', LandingPageCompare);
customElements.define('ad-card', AdCard);
