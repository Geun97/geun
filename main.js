
// =================================================================================
// Component: AdComposer - Handles all user input
// =================================================================================
class AdComposer extends HTMLElement { /* ... existing AdComposer code from previous step ... */ 
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--surface-color);
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-deep);
                }
                h2 { 
                    font-size: 1.8rem; 
                    margin-top: 0; 
                    margin-bottom: 2rem; 
                    color: var(--dark-text); 
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 1rem;
                }
                fieldset { 
                    border: 1px solid var(--border-color);
                    border-radius: 8px; 
                    padding: 1.5rem; 
                    margin-bottom: 2rem; 
                }
                legend { 
                    font-weight: 700; 
                    font-size: 1.3rem; 
                    padding: 0 0.5rem; 
                    color: var(--dark-text);
                }
                .form-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 1.5rem; 
                }
                .full-width { grid-column: 1 / -1; }
                label { 
                    display: block; 
                    font-weight: 600; 
                    margin-bottom: 0.5rem; 
                    font-size: 0.9rem; 
                    color: var(--light-text);
                }
                input[type="url"], input[type="text"], textarea, select { 
                    width: 100%; 
                    padding: 0.8rem 1rem; 
                    border: 1px solid var(--border-color); 
                    border-radius: 6px; 
                    font-size: 1rem; 
                    box-sizing: border-box; 
                    transition: all 0.2s ease-in-out;
                }
                input:focus, select:focus, textarea:focus { 
                    outline: none; 
                    border-color: var(--primary-color); 
                    box-shadow: 0 0 0 3px var(--primary-glow); 
                }
                textarea { resize: vertical; }

                .optional-toggle { 
                    color: var(--primary-color);
                    cursor: pointer; 
                    font-weight: 600; 
                    margin: 1rem 0; 
                    display: inline-block;
                    border: 1px solid var(--border-color);
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    transition: background-color 0.2s;
                }
                .optional-toggle:hover { background-color: #f0f8ff; }
                .optional-toggle span { 
                    display: inline-block; 
                    transition: transform 0.2s; 
                    margin-right: 0.5rem; 
                }
                .optional-content { display: none; padding-top: 1.5rem; border-top: 1px dashed var(--border-color); margin-top: 1rem; }
                .optional-content.visible { display: block; }
                .optional-toggle.open span { transform: rotate(45deg); }

                .competitor-fieldset { 
                    position: relative; 
                    border-color: #e0e0e0;
                    background-color: #fcfcfc;
                }
                .remove-competitor-btn { 
                    position: absolute; 
                    top: 1rem; 
                    right: 1rem; 
                    background: #f1f1f1;
                    color: var(--light-text);
                    border: 1px solid var(--border-color);
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    cursor: pointer; 
                    font-size: 1.2rem; 
                    line-height: 26px;
                    text-align: center;
                    transition: all 0.2s;
                }
                .remove-competitor-btn:hover { background: var(--error-color); color: white; border-color: var(--error-color); transform: rotate(90deg); }

                .form-actions { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-top: 2rem; 
                    border-top: 1px solid var(--border-color); 
                    padding-top: 2rem; 
                }
                button { 
                    padding: 0.9rem 1.8rem;
                    border-radius: 8px; 
                    border: none; 
                    font-size: 1rem; 
                    font-weight: 700; 
                    cursor: pointer; 
                    transition: all 0.2s;
                    box-shadow: var(--shadow-soft);
                }
                #add-competitor-btn { 
                    background-color: var(--surface-color);
                    color: var(--dark-text); 
                    border: 1px solid var(--border-color); 
                }
                #add-competitor-btn:hover { background-color: #f8f9fa; transform: translateY(-2px); }
                #analyze-btn { 
                    background: linear-gradient(45deg, #0078FF, #0056b3);
                    color: white; 
                    position: relative;
                    overflow: hidden;
                }
                 #analyze-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-medium); }
                 #analyze-btn[disabled] { background: #a0a0a0; cursor: not-allowed; transform: none; box-shadow: none; }
                #reset-btn { 
                    background: none; 
                    border: none; 
                    color: var(--light-text); 
                    text-decoration: underline; 
                    box-shadow: none;
                }
                 #error-message { 
                    color: var(--error-color); 
                    margin-bottom: 1.5rem; 
                    display: none; 
                    background-color: rgba(231, 76, 60, 0.1);
                    padding: 1rem;
                    border-radius: 6px;
                    border: 1px solid var(--error-color);
                }
            </style>

            <form id="composer-form">
                <div id="error-message"></div>
                <h2>Analysis Composer</h2>
                <fieldset>
                    <legend>My Service</legend>
                    <div class="form-grid">
                        <div class="full-width">
                            <label for="my-landing-url">Landing Page URL</label>
                            <input type="url" id="my-landing-url" name="my_landing_url" required placeholder="https://myservice.com">
                        </div>
                         <div class="full-width optional-details">
                            <p class="optional-toggle"><span>+</span> My Service Details (Optional)</p>
                            <div class="optional-content">
                                <div class="form-grid">
                                     <div class="full-width"><label>Core Offer</label><textarea name="my_offer" rows="2" placeholder="e.g., Get a personalized AI-powered financial plan in 5 minutes."></textarea></div>
                                     <div><label>Pricing</label><input type="text" name="my_pricing" placeholder="e.g., $29/month"></div>
                                     <div><label>Social Proof</label><input type="text" name="my_proof" placeholder="e.g., Trusted by 10,000+ users"></div>
                                     <div><label>Constraints</label><input type="text" name="my_constraints" placeholder="e.g., For US residents only"></div>
                                     <div><label>FAQ Snippet</label><input type="text" name="my_faq" placeholder="e.g., Can I cancel anytime?"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <div id="competitors-container"></div>

                <div class="form-actions">
                    <button type="button" id="add-competitor-btn">+ Add Competitor</button>
                    <button type="button" id="reset-btn">Clear All</button>
                    <button type="submit" id="analyze-btn">Analyze Campaign</button>
                </div>
            </form>
        `;
    }
    connectedCallback(){this.form=this.shadowRoot.querySelector('#composer-form');this.competitorsContainer=this.shadowRoot.querySelector('#competitors-container');this.errorMessage=this.shadowRoot.querySelector('#error-message');this.analyzeBtn=this.shadowRoot.querySelector('#analyze-btn');this.shadowRoot.querySelector('#add-competitor-btn').addEventListener('click',()=>this.addCompetitor());this.shadowRoot.querySelector('#reset-btn').addEventListener('click',()=>this.resetForm());this.form.addEventListener('submit',(e)=>this.handleSubmit(e));this.form.addEventListener('input',()=>this.saveState());this.loadState();this.registerOptionalToggles()}addCompetitor(a={}){if(this.competitorsContainer.children.length>=3)return void this.showError("You can analyze a maximum of 3 competitors at a time.");const b=document.getElementById('competitor-template'),c=b.content.cloneNode(!0);for(const d in a){const e=c.querySelector(`[name="${d}"]`);e&&"file"!==e.type&&(e.value=a[d])}c.querySelector(".remove-competitor-btn").addEventListener("click",a=>{a.target.closest(".competitor-fieldset").remove(),this.saveState()}),this.competitorsContainer.appendChild(c),this.registerOptionalToggles(this.competitorsContainer.lastElementChild)}registerOptionalToggles(a=this.shadowRoot){a.querySelectorAll(".optional-toggle").forEach(a=>{a.dataset.listenerAttached||(a.dataset.listenerAttached=!0,a.addEventListener("click",()=>{const b=a.nextElementSibling,c=b.classList.toggle("visible");a.classList.toggle("open",c)}))})}saveState(){const a=this.getFormData(!1);localStorage.setItem("composerState",JSON.stringify(a))}loadState(){const a=JSON.parse(localStorage.getItem("composerState"));if(!a)return void this.addCompetitor();for(const b in a.my_service){const c=this.form.querySelector(`[name="${b}"]`);c&&(c.value=a.my_service[b])}a.competitors&&a.competitors.length?a.competitors.forEach(a=>this.addCompetitor(a)):this.addCompetitor(),this.shadowRoot.querySelectorAll(".optional-details").forEach(a=>{const b=a.querySelector(".optional-content");let c=!1;b.querySelectorAll("input, textarea, select").forEach(a=>{a.value&&(c=!0)}),c&&a.querySelector(".optional-toggle").classList.add("open"),c&&b.classList.add("visible")})}resetForm(){confirm("Are you sure you want to clear all inputs? This cannot be undone.")&&(this.form.reset(),this.competitorsContainer.innerHTML="",localStorage.removeItem("composerState"),this.addCompetitor(),this.showError(""),this.shadowRoot.querySelectorAll(".optional-content").forEach(a=>a.classList.remove("visible")),this.shadowRoot.querySelectorAll(".optional-toggle").forEach(a=>a.classList.remove("open")))}getFormData(a=!0){const b={my_service:{},competitors:[]};this.form.querySelector("fieldset").querySelectorAll("input, textarea").forEach(a=>{b.my_service[a.name]=a.value.trim()}),this.competitorsContainer.querySelectorAll(".competitor-fieldset").forEach(c=>{const d={};c.querySelectorAll("input, textarea, select").forEach(b=>{if("file"===b.type&&a&&b.files.length>0)d[b.name]=b.files[0];else if("file"!==b.type)d[b.name]=b.value.trim()}),b.competitors.push(d)});return b}handleSubmit(a){a.preventDefault(),this.showError("");if(!this.form.checkValidity())return this.showError("Please fill out all required URL fields."),void this.form.querySelector(":invalid")?.focus();const b=this.getFormData();this.dispatchEvent(new CustomEvent("analyze",{detail:b,bubbles:!0,composed:!0}))}showError(a){this.errorMessage.textContent=a,this.errorMessage.style.display=a?"block":"none"}}

// =================================================================================
// Component: AdCard - Renders a single ad preview
// =================================================================================
class AdCard extends HTMLElement { /* ... existing AdCard code ... */
    constructor(){super();this.attachShadow({mode:"open"})}setData(a){const{competitor_ad_link:b,ad_primary_text:c,ad_headline:d,ad_description:e,ad_cta:f,ad_media_url:g,ad_media_file:h}=a;let i="Advertiser Name";try{i=(new URL(b)).hostname.replace("www.","")}catch(j){}let k='<div class="media-placeholder"><div>No Media Provided</div></div>';h&&h instanceof File?k=`<img src="${URL.createObjectURL(h)}" alt="Ad Media">`:g&&(k=`<img src="${g}" alt="Ad Media" onerror="this.parentElement.innerHTML = '<div class=\"media-placeholder\"><div>Media Failed to Load</div></div>'">`);this.shadowRoot.innerHTML=`
            <style>
                :host { display: block; margin-bottom: 2rem; }
                .ad-card {
                    max-width: 500px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: var(--shadow-medium);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    border: 1px solid var(--border-color);
                }
                .ad-header {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                }
                .advertiser-icon { 
                    width: 40px; height: 40px; border-radius: 50%; 
                    background: #ccc; margin-right: 12px; 
                    background-image: url(https://logo.clearbit.com/${i});
                    background-size: cover;
                    background-position: center;
                }
                .advertiser-info { font-weight: 600; font-size: 15px; }
                .primary-text { 
                    padding: 0 16px 12px; font-size: 15px; line-height: 1.5; 
                    white-space: pre-wrap; word-wrap: break-word; color: var(--dark-text);
                }
                .ad-media { 
                    position: relative; width: 100%;
                    padding-top: 100%; /* 1:1 Aspect Ratio by default */
                    background: #f0f2f5;
                }
                .ad-media img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
                .media-placeholder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #888; font-size: 0.9rem; }
                .ad-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 12px; background: #f9f9f9; text-decoration: none; color: inherit; 
                    border-top: 1px solid #eee;
                }
                .footer-text { flex: 1; margin-right: 12px; overflow: hidden; }
                .headline { 
                    font-weight: 700; font-size: 16px; color: var(--dark-text);
                    white-space: nowrap; text-overflow: ellipsis; overflow: hidden;
                }
                .description { font-size: 14px; color: var(--light-text); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
                .cta-button { 
                    background-color: var(--primary-color); color: white; font-weight: bold; 
                    font-size: 14px; padding: 10px 24px; border-radius: 6px; text-align: center; 
                    border: none; white-space: nowrap; transition: background-color 0.2s;
                }
                .cta-button:hover { background-color: #0056b3; }
            </style>
            <div class="ad-card">
                <div class="ad-header">
                    <div class="advertiser-icon"></div>
                    <div class="advertiser-info">${i}</div>
                </div>
                <p class="primary-text">${c||"This is the primary text of the ad. It can be multiple lines long and contains the main message."}</p>
                <div class="ad-media">${k}</div>
                <a href="${b||"#"}" target="_blank" class="ad-footer">
                    <div class="footer-text">
                        <div class="headline">${d||"Catchy Headline"}</div>
                        <div class="description">${i}</div>
                    </div>
                    <div class="cta-button">${f||"Learn More"}</div>
                </a>
            </div>
        `}}

// =================================================================================
// Component: FrameGallery - Shows ad creative in different format frames
// =================================================================================
class FrameGallery extends HTMLElement { /* ... existing FrameGallery code ... */ 
    constructor(){super();this.attachShadow({mode:"open"})}setData(a){let b="https://via.placeholder.com/800x800?text=No+Media";a.ad_media_file&&a.ad_media_file instanceof File?b=URL.createObjectURL(a.ad_media_file):a.ad_media_url&&(b=a.ad_media_url);this.shadowRoot.innerHTML=`
            <style>
                :host { display: block; }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                    justify-items: center;
                    align-items: center;
                }
                .frame {
                    border: 2px dashed var(--border-color);
                    padding: 8px;
                    border-radius: 8px;
                    background: #f9f9f9;
                    box-shadow: var(--shadow-soft);
                }
                .frame-title { font-weight: 600; font-size: 0.9rem; text-align: center; margin-bottom: 0.5rem; color: var(--light-text); }
                .frame-body {
                    background-color: #000;
                    position: relative;
                    overflow: hidden;
                }
                .frame-body img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .text-overlay {
                    position: absolute;
                    bottom: 10%;
                    left: 5%; right: 5%;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    padding: 8px;
                    border-radius: 6px;
                    font-size: 0.8em;
                    text-align: center;
                }
                /* Aspect Ratios */
                .feed-1-1 { width: 200px; height: 200px; }
                .feed-4-5 { width: 200px; height: 250px; }
                .stories-9-16 { width: 150px; height: 266px; }

            </style>
            <div class="gallery-grid">
                ${this.createFrame("Feed (1:1)","feed-1-1",b,a.ad_headline)}
                ${this.createFrame("Feed (4:5)","feed-4-5",b,a.ad_headline)}
                ${this.createFrame("Stories/Reels (9:16)","stories-9-16",b,a.ad_headline)}
            </div>
        `}createFrame(a,b,c,d){return`
            <div class="frame">
                <p class="frame-title">${a}</p>
                <div class="frame-body ${b}">
                    <img src="${c}" alt="${a} preview">
                    ${b.includes("stories")?`<div class="text-overlay">${d||"Headline"}</div>`:""}
                </div>
            </div>
        `}}


// =================================================================================
// Component: LandingCompare - Renders cards for landing page comparison
// =================================================================================
class LandingCompare extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setData(myService, competitors) {
        const competitorCards = competitors.map((c, i) => this.createCard(c.og, c.competitor_landing_url, `Competitor ${i + 1}`)).join('');
        
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .compare-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                    gap: 1.5rem; 
                }
                .card { 
                    background: var(--surface-color); 
                    border-radius: 12px; 
                    overflow: hidden; 
                    box-shadow: var(--shadow-medium); 
                    transition: transform .2s, box-shadow .2s; 
                    display: flex;
                    flex-direction: column;
                }
                .card:hover { transform: translateY(-5px); box-shadow: var(--shadow-deep); }
                .card.my-service { border: 2px solid var(--primary-color); }
                .card-header { 
                    font-weight: 700; 
                    padding: 0.75rem 1.25rem; 
                    background: #f7f7f7; 
                    border-bottom: 1px solid #eee; 
                }
                .card-header.my-service-header { background: var(--primary-color); color: white; }
                .og-image { 
                    width: 100%; 
                    height: 160px; 
                    object-fit: cover; 
                    background-color: var(--bg-color);
                    border-bottom: 1px solid #eee;
                }
                .card-body { padding: 1.25rem; flex-grow: 1; }
                .og-title { 
                    font-size: 1.1rem; 
                    font-weight: 700; 
                    margin: 0 0 0.5rem; 
                    color: var(--dark-text);
                    line-height: 1.3;
                }
                .og-desc { 
                    font-size: 0.9rem; 
                    color: var(--light-text); 
                    line-height: 1.5; 
                    height: 4.5em; /* approx 3 lines */
                    overflow: hidden; 
                }
                 .og-error { font-style: italic; color: var(--light-text);}
                .card-footer { 
                    padding: 1rem 1.25rem; 
                    background: #fcfcfc;
                    border-top: 1px solid #eee;
                }
                .card-link { 
                    font-size: 0.9rem; 
                    color: var(--primary-color); 
                    text-decoration: none; 
                    font-weight: 600; 
                }
                .card-link:hover { text-decoration: underline; }
            </style>
            <div class="compare-grid">
                ${this.createCard(myService.og, myService.my_landing_url, 'My Service', true)}
                ${competitorCards}
            </div>
        `;
    }

    createCard(og, url, title, isMyService = false) {
        const hasOg = og && !og.error;
        return `
            <div class="card ${isMyService ? 'my-service' : ''}">
                <div class="card-header ${isMyService ? 'my-service-header' : ''}">${title}</div>
                <img src="${hasOg ? og.image : 'https://via.placeholder.com/400x210?text=Preview+Not+Available'}" class="og-image" alt="Landing page preview">
                <div class="card-body">
                    <h4 class="og-title">${hasOg ? (og.title || 'No Title Found') : 'Title Not Available'}</h4>
                    ${hasOg 
                        ? `<p class="og-desc">${og.description || 'No description meta tag found on this page.'}</p>`
                        : `<p class="og-error">Could not fetch Open Graph preview. The URL might be invalid, private, or missing meta tags.</p>`
                    }
                </div>
                <div class="card-footer">
                     <a href="${url}" target="_blank" rel="noopener noreferrer" class="card-link">Visit Page &rarr;</a>
                </div>
            </div>
        `;
    }
}


// =================================================================================
// Component: AdResults - The main container for the results page
// =================================================================================
class AdResults extends HTMLElement { /* ... existing AdResults code, with additions ... */
    constructor(){super();this.attachShadow({mode:"open"})}setData(a){this.shadowRoot.innerHTML=`
            <style>
                :host { display: block; }
                .results-header {
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 2rem; 
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }
                h2 { font-size: 2rem; color: var(--dark-text); margin: 0; }
                #back-to-edit-btn {
                    background: var(--surface-color); border: 1px solid var(--border-color); 
                    color: var(--dark-text); padding: 0.7rem 1.2rem; border-radius: 8px; 
                    cursor: pointer; font-size: 0.9rem; font-weight: 600;
                    transition: all 0.2s;
                }
                #back-to-edit-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-medium); }
                .section {
                    background: var(--surface-color);
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-deep);
                    margin-bottom: 2.5rem;
                }
                .section-title {
                    font-size: 1.6rem; font-weight: 700; color: var(--dark-text);
                    margin-top: 0; margin-bottom: 2rem; padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .ad-previews-container { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 2rem;
                 }
                 .competitor-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1.5rem; text-align: center; color: var(--light-text); }
            </style>

            <div class="results-header">
                <h2>Analysis Results</h2>
                <button id="back-to-edit-btn">&larr; Back to Edit</button>
            </div>

            <div class="section">
                <h3 class="section-title">Landing Page Comparison</h3>
                <landing-compare></landing-compare>
            </div>

            <div id="ad-previews" class="section">
                <h3 class="section-title">Competitor Ad Previews</h3>
                <div class="ad-previews-container">
                    <!-- Ad Cards will be injected here -->
                </div>
            </div>
            
            <div id="frame-galleries" class="section">
                <h3 class="section-title">Creative Frame Gallery</h3>
                 <!-- Frame Galleries will be injected here -->
            </div>
        `;this.shadowRoot.querySelector("#back-to-edit-btn").addEventListener("click",()=>{window.location.hash=""});const b=this.shadowRoot.querySelector(".ad-previews-container"),c=this.shadowRoot.querySelector("#frame-galleries"),d=this.shadowRoot.querySelector("landing-compare");d.setData(a.my_service,a.competitors),a.competitors.forEach((d,e)=>{if(Object.keys(d).some(a=>a.startsWith("ad_")&&d[a])){const f=document.createElement("div");let g=`Competitor ${e+1}`;try{g=(new URL(d.competitor_ad_link)).hostname.replace("www.","")}catch(h){}f.innerHTML=`<h4 class="competitor-title">${g}</h4>`;const i=document.createElement("ad-card");i.setData(d),f.appendChild(i),b.appendChild(f);const j=document.createElement("frame-gallery");j.setData(d);const k=document.createElement("h4");k.className="competitor-title",k.textContent=`Formats for ${g}`,c.appendChild(k),c.appendChild(j)}})}

// =================================================================================
// AppRouter - Handles routing and orchestrates component rendering
// =================================================================================
class AppRouter { 
    constructor() {
        this.composerView = document.getElementById('composer-view');
        this.resultsView = document.getElementById('results-view');
        this.adComposer = document.querySelector('ad-composer');
        
        this.adComposer.addEventListener('analyze', async (e) => {
            this.showLoading(true);
            const formData = e.detail;

            // --- Fetch OG data --- 
            try {
                const urlsToFetch = [
                    formData.my_service.my_landing_url,
                    ...formData.competitors.map(c => c.competitor_landing_url)
                ].filter(Boolean); // Filter out any empty URLs

                const ogResults = await Promise.all(
                    urlsToFetch.map(url => 
                        fetch(`/api/og?url=${encodeURIComponent(url)}`)
                            .then(res => res.ok ? res.json() : { error: 'Failed to fetch', status: res.status })
                            .catch(err => ({ error: 'Network error', message: err.message }))
                    )
                );

                // Assign OG data back to the form data object
                formData.my_service.og = ogResults.shift(); // First result is for my_service
                formData.competitors.forEach((comp, index) => {
                    if (comp.competitor_landing_url) {
                        comp.og = ogResults.shift();
                    }
                });

            } catch (error) {
                console.error('Error fetching OG data:', error);
                // You could show an error to the user here
            }
            // --- End of OG data fetching ---

            const serializableData = this.makeDataSerializable(formData);
            sessionStorage.setItem('analysisResults', JSON.stringify(serializableData));
            window.location.hash = 'results';
            this.showLoading(false);
        });

        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // Initial route handling
    }

    handleRoute() {
        const hash = window.location.hash;
        if (hash === '#results') {
            this.composerView.style.display = 'none';
            this.resultsView.style.display = 'block';
            window.scrollTo(0, 0);
            this.renderResults();
        } else {
            this.composerView.style.display = 'block';
            this.resultsView.style.display = 'none';
        }
    }

    renderResults() {
        const resultsDataString = sessionStorage.getItem('analysisResults');
        if (!resultsDataString) {
            this.resultsView.innerHTML = '<p>No analysis data found. <a href="#">Go back to the composer</a> to start.</p>';
            return;
        }
        const resultsData = JSON.parse(resultsDataString);
        this.resultsView.innerHTML = ''; // Clear previous results
        const adResultsEl = document.createElement('ad-results');
        adResultsEl.setData(resultsData);
        this.resultsView.appendChild(adResultsEl);
    }

    makeDataSerializable(formData) {
        // This approach is simplified. For production, uploaded files would need a more robust
        // handling mechanism like uploading to a server or using IndexedDB.
        const data = JSON.parse(JSON.stringify(formData)); 
        formData.competitors.forEach((comp, index) => {
            if (comp.ad_media_file) {
                data.competitors[index].ad_media_file_name = comp.ad_media_file.name;
                data.competitors[index].ad_media_file_type = comp.ad_media_file.type;
                // The actual file object is lost, but we have its name.
            }
        });
        return data;
    }

    showLoading(isLoading) {
        const analyzeBtn = this.adComposer.shadowRoot.querySelector('#analyze-btn');
        if (isLoading) {
            analyzeBtn.disabled = true;
            analyzeBtn.textContent = 'Fetching & Analyzing...';
        } else {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze Campaign';
        }
    }
}

// =================================================================================
// Custom Element Definitions and App Initialization
// =================================================================================
customElements.define('ad-composer', AdComposer);
customElements.define('ad-card', AdCard);
customElements.define('frame-gallery', FrameGallery);
customElements.define('landing-compare', LandingCompare);
customElements.define('ad-results', AdResults);

// Initialize the router once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AppRouter();
});
