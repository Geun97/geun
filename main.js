
// A global variable to hold the user-uploaded files
let uploadedFiles = [];

class ObserverHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        h1 {
            color: var(--primary-color, #0078FF);
            font-size: 2rem;
            margin: 0;
        }
        .theme-switch-wrapper {
            display: flex;
            align-items: center;
        }
        .theme-switch {
            display: inline-block;
            height: 34px;
            position: relative;
            width: 60px;
        }
        .theme-switch input { display:none; }
        .slider {
            background-color: #ccc;
            bottom: 0;
            cursor: pointer;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            transition: .4s;
        }
        .slider:before {
            background-color: #fff;
            bottom: 4px;
            content: "";
            height: 26px;
            left: 4px;
            position: absolute;
            transition: .4s;
            width: 26px;
        }
        input:checked + .slider {
            background-color: var(--primary-color, #0078FF);
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }
      </style>
      <h1>옵저버 (Observer)</h1>
      <div class="theme-switch-wrapper">
        <label class="theme-switch" for="checkbox">
            <input type="checkbox" id="checkbox" />
            <div class="slider round"></div>
        </label>
      </div>
    `;
  }

  connectedCallback() {
    const toggleSwitch = this.shadowRoot.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
      toggleSwitch.checked = true;
    }
    toggleSwitch.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

class UrlInputForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>
            .form-container {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                background-color: var(--card-background);
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 8px var(--shadow-color);
            }
            .form-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
            }
            .form-grid .full-width {
                grid-column: 1 / -1;
            }
            label {
                font-size: 0.9rem;
                color: var(--text-secondary);
                margin-bottom: 0.25rem;
                display: block;
            }
            input[type="text"] {
                width: 100%;
                padding: 0.8rem;
                border: 1px solid var(--light-grey, #E9EBEE);
                border-radius: 4px;
                font-size: 1rem;
                background-color: var(--background);
                color: var(--text);
                box-sizing: border-box;
            }
            .button-group {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                grid-column: 1 / -1;
            }
            button {
                padding: 0.8rem 1.5rem;
                border: none;
                background-color: var(--primary-color, #0078FF);
                color: var(--white, #FFFFFF);
                border-radius: 4px;
                font-size: 1rem;
                cursor: pointer;
                transition: background-color 0.2s ease, filter 0.2s ease;
            }
            button:hover { filter: brightness(1.2); }
            button.secondary {
                background-color: var(--secondary-button-bg, #6c757d);
            }
            #file-upload-container {
                border: 2px dashed var(--light-grey, #E9EBEE);
                padding: 1rem;
                text-align: center;
                border-radius: 8px;
                cursor: pointer;
                grid-column: 1 / -1;
            }
            #file-upload-container p {
                margin: 0;
                color: var(--text-secondary);
            }
            #file-list {
                margin-top: 1rem;
                font-size: 0.9rem;
                grid-column: 1 / -1;
            }
            .info-text {
                font-size: 0.8rem;
                color: var(--text-secondary);
                text-align: center;
                grid-column: 1 / -1;
            }
            #status-message {
                grid-column: 1 / -1;
                text-align: center;
                font-weight: bold;
            }
        </style>
        <div class="form-container">
            <div class="form-grid">
                <div class="full-width">
                    <label for="library_url">Meta 라이브러리 링크</label>
                    <input type="text" id="library_url" placeholder="Enter Meta Ad Library URL here...">
                </div>

                <div><label for="my_brand">브랜드</label><input type="text" id="my_brand"></div>
                <div><label for="my_product">제품</label><input type="text" id="my_product"></div>
                <div><label for="ad_format">광고 형식</label><input type="text" id="ad_format"></div>
                <div><label for="hook_seconds">Hook (초)</label><input type="text" id="hook_seconds"></div>

                <div class="full-width">
                    <label for="my_visual_description">영상/이미지 설명</label>
                    <input type="text" id="my_visual_description">
                </div>
                <div class="full-width">
                    <label for="my_text_overlay">텍스트 오버레이</label>
                    <input type="text" id="my_text_overlay">
                </div>
                <div class="full-width">
                    <label for="my_primary_text">기본 문구</label>
                    <input type="text" id="my_primary_text">
                </div>

                <div><label for="my_cta">CTA</label><input type="text" id="my_cta"></div>
                <div><label for="my_offer">Offer</label><input type="text" id="my_offer"></div>

                <div id="file-upload-container" class="full-width">
                    <input type="file" id="file-upload" multiple accept="image/*,video/*" style="display: none;">
                    <p>이미지/영상 업로드 (클릭 또는 드래그앤드롭)</p>
                </div>
                <div id="file-list"></div>
                
                <p class="info-text full-width">“Meta 라이브러리 링크는 자동 분석용이며, 이미지/영상은 업로드 파일 기준으로 표시됩니다.”</p>

                <div id="status-message"></div>

                <div class="button-group">
                    <button id="auto-fill-btn" type="button" class="secondary">링크 자동 채우기</button>
                    <button id="analyze-btn" type="button">분석 실행</button>
                </div>
            </div>
        </div>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const autoFillBtn = shadow.querySelector('#auto-fill-btn');
    const analyzeBtn = shadow.querySelector('#analyze-btn');
    const fileUpload = shadow.querySelector('#file-upload');
    const fileUploadContainer = shadow.querySelector('#file-upload-container');
    const fileList = shadow.querySelector('#file-list');
    const statusMessage = shadow.querySelector('#status-message');

    autoFillBtn.addEventListener('click', () => this.autoFillFields(shadow, statusMessage));
    analyzeBtn.addEventListener('click', () => this.runAnalysis(shadow, statusMessage));

    fileUploadContainer.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', (e) => {
      uploadedFiles = Array.from(e.target.files);
      fileList.innerHTML = `<strong>Selected files:</strong> ${uploadedFiles.map(f => f.name).join(', ')}`;
    });
  }

  async autoFillFields(shadow, statusMessage) {
    const libraryUrl = shadow.querySelector('#library_url').value;
    if (!libraryUrl) {
      statusMessage.textContent = "Please enter a Meta Ad Library URL first.";
      statusMessage.style.color = "red";
      return;
    }

    statusMessage.textContent = "Auto-filling data...";
    statusMessage.style.color = "var(--primary-color)";

    // MOCK: This is a placeholder for the actual API call.
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    const mockData = {
        my_brand: 'MyBrand', my_product: 'MyProduct', ad_format: 'Video', hook_seconds: '3',
        my_visual_description: 'A person happily using the product.',
        my_text_overlay: 'New Offer!', my_primary_text: 'Check out this amazing product.',
        my_cta: 'Shop Now', my_offer: '20% Off'
    };

    Object.keys(mockData).forEach(key => {
        const input = shadow.querySelector(`#${key}`);
        if (input && !input.value) { // Only fill if empty
            input.value = mockData[key];
        }
    });

    statusMessage.textContent = "Auto-fill complete!";
    setTimeout(() => statusMessage.textContent = "", 3000);
  }

  async runAnalysis(shadow, statusMessage) {
    const requiredFields = ['my_brand', 'my_product', 'ad_format'];
    let allFieldsFilled = true;
    requiredFields.forEach(id => {
        if (!shadow.querySelector(`#${id}`).value) {
            allFieldsFilled = false;
        }
    });

    if (!allFieldsFilled) {
        await this.autoFillFields(shadow, statusMessage);
    }

    analyzeBtn.textContent = "분석 중...";
    analyzeBtn.disabled = true;
    statusMessage.textContent = "Running analysis... this may take a moment.";
    statusMessage.style.color = "var(--primary-color)";

    let attempts = 0;
    const maxAttempts = 2;
    let success = false;

    while (attempts < maxAttempts && !success) {
        try {
            // MOCK: Simulate API call for analysis
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // if (attempts === 0) throw new Error("Simulated server error"); // Uncomment to test retry

            const resultsContainer = document.querySelector('#results-container');
            resultsContainer.innerHTML = ''; // Clear previous results
            const resultsDisplay = document.createElement('results-display');
            resultsContainer.appendChild(resultsDisplay);
            success = true;
            statusMessage.textContent = "Analysis successful!";

        } catch (error) {
            attempts++;
            console.error(`Analysis attempt ${attempts} failed:`, error);
            if (attempts >= maxAttempts) {
                statusMessage.textContent = `Analysis failed after ${attempts} attempts. Please try again later.`;
                statusMessage.style.color = "red";
            } else {
                statusMessage.textContent = "Analysis failed, retrying...";
                await new Promise(res => setTimeout(res, 1000)); // wait before retrying
            }
        }
    }

    analyzeBtn.textContent = "분석 실행";
    analyzeBtn.disabled = false;
    setTimeout(() => statusMessage.textContent = "", 5000);
  }
}

class ResultsDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>
            .results-display { color: var(--text); }
            h2 { font-size: 1.5rem; color: var(--primary-color); border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem; margin-bottom: 1rem; }
            .ad-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
            section { margin-bottom: 2rem; }
        </style>
      <div class="results-display">
        <section>
            <h2>My Ads</h2>
            <div class="ad-card-grid" id="my-ads"></div>
        </section>
        <section>
            <h2>Top 3 Competitors</h2>
            <div class="ad-card-grid" id="competitor-ads"></div>
        </section>
        <section>
            <h2>Insights</h2>
            <insight-document></insight-document>
        </section>
      </div>
    `;
  }

  connectedCallback() {
    this.populateAds();
  }

  populateAds() {
    const myAdsContainer = this.shadowRoot.querySelector('#my-ads');
    myAdsContainer.innerHTML = ''; // Clear existing

    if (uploadedFiles.length > 0) {
        uploadedFiles.forEach(file => {
            const adCard = document.createElement('ad-card');
            adCard.setAttribute('creative', URL.createObjectURL(file));
            adCard.setAttribute('copy', file.name);
            adCard.fileType = file.type;
            myAdsContainer.appendChild(adCard);
        });
    } else {
        myAdsContainer.innerHTML = '<p>No local files uploaded. Showing placeholders.</p>';
        const placeholderAd = document.createElement('ad-card');
        placeholderAd.setAttribute('creative', 'https://via.placeholder.com/300x200.png?text=Upload+Your+Ad');
        placeholderAd.setAttribute('copy', 'Please upload your ad creative.');
        myAdsContainer.appendChild(placeholderAd);
    }

    // Competitors remain as mock data
    const competitorAdsContainer = this.shadowRoot.querySelector('#competitor-ads');
    const competitorAds = [
        { creative: 'https://via.placeholder.com/300x200.png?text=Competitor+1', copy: 'Competitor ad 1.' },
        { creative: 'https://via.placeholder.com/300x200.png?text=Competitor+2', copy: 'Competitor ad 2.' },
        { creative: 'https://via.placeholder.com/300x200.png?text=Competitor+3', copy: 'Competitor ad 3.' },
    ];
    competitorAds.forEach(ad => {
        const adCard = document.createElement('ad-card');
        adCard.setAttribute('creative', ad.creative);
        adCard.setAttribute('copy', ad.copy);
        competitorAdsContainer.appendChild(adCard);
    });
  }
}

class AdCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['creative', 'copy'];
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const creativeUrl = this.getAttribute('creative');
    const copy = this.getAttribute('copy');
    const isVideo = this.fileType?.startsWith('video/');
    const isBlob = creativeUrl?.startsWith('blob:');

    let mediaElement;
    if (isVideo) {
        mediaElement = `<video src="${creativeUrl}" controls style="width:100%; display:block;"></video>`;
    } else {
        mediaElement = `<img src="${creativeUrl}" alt="Ad Creative" style="width:100%; display:block; ${isBlob ? 'cursor:pointer;' : ''}">`;
    }

    this.shadowRoot.innerHTML = `
        <style>
            .ad-card { background-color: var(--card-background); border-radius: 8px; box-shadow: 0 4px 8px var(--shadow-color); overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease; color: var(--text); }
            .ad-card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px var(--shadow-color); }
            .ad-card-content { padding: 1rem; }
            .ad-card-content p { margin: 0; font-size: 0.9rem; opacity: 0.8; }
        </style>
        <div class="ad-card">
            ${mediaElement}
            <div class="ad-card-content">
                <p>${copy}</p>
            </div>
        </div>
    `;
    
    if(isBlob && !isVideo) {
        this.shadowRoot.querySelector('img').addEventListener('click', () => {
            document.querySelector('#modal-image-content').src = creativeUrl;
            document.querySelector('#image-modal').style.display = 'flex';
        });
    }
  }
}

class InsightDocument extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            .insight-document { background-color: var(--card-background); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 8px var(--shadow-color); color: var(--text); }
             h3 { color: var(--primary-color); margin-top: 0; }
             p { margin-bottom: 1rem; }
        </style>
        <div class="insight-document">
            <h3>Analysis & Recommendations</h3>
            <p><strong>Key Finding 1:</strong> Your current ad creative relies heavily on static images. Competitors are seeing higher engagement with short-form video content.</p>
            <p><strong>Recommendation:</strong> Incorporate video ads into your next campaign to potentially increase user interaction and conversion rates.</p>
        </div>
    `;
    }
}

class ContactForm extends HTMLElement { /* ... existing code ... */ }

// --- Initialize everything ---

// Close modal logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#image-modal');
    const closeBtn = document.querySelector('.modal-close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});

customElements.define('observer-header', ObserverHeader);
customElements.define('url-input-form', UrlInputForm);
customElements.define('results-display', ResultsDisplay);
customElements.define('ad-card', AdCard);
customElements.define('insight-document', InsightDocument);

// I am keeping the existing ContactForm definition but omitting it here for brevity
// The original ContactForm class from the previous step should be included here.

class FullContactForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        section { background-color: var(--card-background); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 8px var(--shadow-color); margin-top: 2rem; }
        h2 { color: var(--primary-color); margin-top: 0; }
        form { display: flex; flex-direction: column; gap: 1rem; }
        input, textarea { padding: 0.8rem; border: 1px solid var(--light-grey, #E9EBEE); border-radius: 4px; font-size: 1rem; background-color: var(--background); color: var(--text); font-family: var(--font-family); }
        textarea { min-height: 150px; resize: vertical; }
        button { padding: 0.8rem 1.5rem; border: none; background-color: var(--primary-color, #0078FF); color: var(--white, #FFFFFF); border-radius: 4px; font-size: 1rem; cursor: pointer; transition: background-color 0.2s ease; }
        button:hover { filter: brightness(1.2); }
        #form-status { margin-top: 1rem; font-weight: bold; }
      </style>
      <section>
        <h2>Partnership Inquiry</h2>
        <form id="contact-form" action="https://formspree.io/f/xreaqnrp" method="POST">
            <label for="name">Name</label><input type="text" id="name" name="name" required>
            <label for="email">Email</label><input type="email" id="email" name="email" required>
            <label for="message">Message</label><textarea id="message" name="message" required></textarea>
            <button type="submit">Send Message</button>
        </form>
        <div id="form-status"></div>
      </section>
    `;
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector('#contact-form');
    const status = this.shadowRoot.querySelector('#form-status');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      try {
        const response = await fetch(e.target.action, { method: 'POST', body: data, headers: {'Accept': 'application/json'} });
        if (response.ok) {
          status.textContent = "Thanks for your submission!";
          status.style.color = "green";
          form.reset();
        } else {
            const responseData = await response.json();
            if (Object.hasOwn(responseData, 'errors')) {
                status.textContent = responseData["errors"].map(error => error["message"]).join(", ");
            } else {
                status.textContent = "Oops! There was a problem submitting your form";
            }
            status.style.color = "red";
        }
      } catch (error) {
        status.textContent = "Oops! There was a problem submitting your form";
        status.style.color = "red";
      }
    });
  }
}
customElements.define('contact-form', FullContactForm);
