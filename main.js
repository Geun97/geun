class ObserverHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #fff;
                    padding: 1rem 2rem;
                    border-bottom: 1px solid #ddd;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #0078FF;
                }
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
                /* Embedding component-specific styles from main CSS for encapsulation */
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
                                     <div class="full-width">
                                        <label>Core Offer / Value Proposition</label>
                                        <textarea name="my_offer" rows="2" placeholder="e.g., The easiest way to design stunning logos in minutes."></textarea>
                                    </div>
                                    <div>
                                        <label>Pricing</label>
                                        <input type="text" name="my_pricing" placeholder="e.g., $15/month Pro Plan">
                                    </div>
                                    <div>
                                        <label>Social Proof</label>
                                        <input type="text" name="my_proof" placeholder="e.g., Trusted by 50,000+ designers">
                                    </div>
                                    <div>
                                        <label>Constraints / Risk</label>
                                        <input type="text" name="my_constraints" placeholder="e.g., 14-day free trial, no credit card needed">
                                    </div>
                                    <div>
                                        <label>FAQ Snippet</label>
                                        <input type="text" name="my_faq" placeholder="e.g., Can I cancel anytime? Yes.">
                                    </div>
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
        
        this.shadowRoot.querySelector('#add-competitor-btn').addEventListener('click', () => this.addCompetitor());
        this.shadowRoot.querySelector('#reset-btn').addEventListener('click', () => this.resetForm());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.form.addEventListener('input', () => this.saveState());

        this.loadState();
        this.registerOptionalToggles();
    }

    addCompetitor(data = {}) {
        if (this.competitorsContainer.children.length >= 3) {
            this.showError("You can add a maximum of 3 competitors.");
            return;
        }

        const competitorTemplate = document.getElementById('competitor-template');
        const newCompetitor = competitorTemplate.content.cloneNode(true);
        
        // Prefill data if provided (from localStorage)
        for (const key in data) {
            const el = newCompetitor.querySelector(`[name="${key}"]`);
            if (el) {
                el.value = data[key];
            }
        }

        newCompetitor.querySelector('.remove-competitor-btn').addEventListener('click', (e) => {
            e.target.closest('.competitor-fieldset').remove();
            this.saveState();
        });

        this.competitorsContainer.appendChild(newCompetitor);
        this.registerOptionalToggles(); // Must be called after appending
    }

    registerOptionalToggles() {
        const toggles = this.shadowRoot.querySelectorAll('.optional-toggle');
        toggles.forEach(toggle => {
            // Avoid attaching duplicate listeners
            if (toggle.dataset.listenerAttached) return;
            toggle.dataset.listenerAttached = true;

            toggle.addEventListener('click', () => {
                const content = toggle.nextElementSibling;
                content.classList.toggle('visible');
                toggle.textContent = content.classList.contains('visible') ? 
                    toggle.textContent.replace('Show', 'Hide') : 
                    toggle.textContent.replace('Hide', 'Show');
            });
        });

        // Also need to handle toggles inside the main document template
        document.querySelectorAll('.optional-toggle').forEach(toggle => {
            if (toggle.dataset.listenerAttached) return;
            toggle.dataset.listenerAttached = true;

             toggle.addEventListener('click', () => {
                const content = toggle.nextElementSibling;
                content.classList.toggle('visible');
            });
        });
    }
    
    saveState() {
        const formData = new FormData(this.form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Special handling for dynamic competitors
        const competitors = [];
        this.shadowRoot.querySelectorAll('.competitor-fieldset').forEach(fieldset => {
            const competitorData = {};
            const inputs = fieldset.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                competitorData[input.name] = input.value;
            });
            competitors.push(competitorData);
        });
        data.competitors = competitors;

        localStorage.setItem('composerState', JSON.stringify(data));
    }

    loadState() {
        const state = JSON.parse(localStorage.getItem('composerState'));
        if (!state) {
             this.addCompetitor(); // Add one by default on first load
             return;
        }

        // Restore fixed fields
        for (const key in state) {
             if (key !== 'competitors') {
                const el = this.form.querySelector(`[name="${key}"]`);
                if (el) {
                    el.value = state[key];
                }
            }
        }
        
        // Restore dynamic competitors
        if (state.competitors && state.competitors.length) {
            state.competitors.forEach(compData => this.addCompetitor(compData));
        } else {
             this.addCompetitor(); // Ensure at least one is present
        }

        // Make sure optional sections are visible if they have content
        this.shadowRoot.querySelectorAll('.optional-content').forEach(content => {
            let hasContent = false;
            content.querySelectorAll('input, textarea').forEach(input => {
                if (input.value) hasContent = true;
            });
            if (hasContent) {
                content.classList.add('visible');
            }
        });
    }

    resetForm() {
        if (confirm('Are you sure you want to clear all inputs?')) {
            this.form.reset();
            this.competitorsContainer.innerHTML = '';
            localStorage.removeItem('composerState');
            this.addCompetitor(); // Add a fresh one back
            this.showError(''); // Clear any previous errors
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.errorMessage.style.display = 'none';

        if (!this.form.checkValidity()) {
            this.showError('Please fill out all required fields.');
            this.form.reportValidity(); // Highlight invalid fields
            return;
        }

        // Additional custom validation
        if (this.competitorsContainer.children.length === 0) {
            this.showError('You must add at least one competitor.');
            return;
        }

        // If validation passes
        console.log('Form submitted successfully!');
        const formData = new FormData(this.form);
        // In a real app, you would now process this data
        // For now, we just log it
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // Hide composer and show results (for Phase 2)
        document.getElementById('composer-container').style.display = 'none';
        document.getElementById('results-container').style.display = 'block';
        
        // Placeholder for Phase 2 - rendering the results
        document.getElementById('results-container').innerHTML = `<h1>Analysis Results</h1><p>Rendering of results will be implemented in the next phase.</p>`;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = message ? 'block' : 'none';
    }
}

customElements.define('observer-header', ObserverHeader);
customElements.define('composer-form', ComposerForm);
