
class ObserverHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        h1 {
            color: var(--primary-color, #0078FF);
            font-size: 2rem;
            margin: 0;
        }
      </style>
      <h1>옵저버 (Observer)</h1>
    `;
  }
}

class UrlInputForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>
            form {
                display: flex;
                gap: 1rem;
            }
            input[type="text"] {
                flex-grow: 1;
                padding: 0.8rem;
                border: 1px solid var(--light-grey, #E9EBEE);
                border-radius: 4px;
                font-size: 1rem;
            }
            button {
                padding: 0.8rem 1.5rem;
                border: none;
                background-color: var(--primary-color, #0078FF);
                color: var(--white, #FFFFFF);
                border-radius: 4px;
                font-size: 1rem;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            button:hover {
                background-color: #0056b3;
            }
        </style>
        <form id="url-form">
            <input type="text" placeholder="Enter Meta Ad Library URL here...">
            <button type="submit">Analyze</button>
        </form>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#url-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const resultsContainer = document.querySelector('#results-container');
      resultsContainer.innerHTML = '<results-display></results-display>';
    });
  }
}

class ResultsDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
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
    const competitorAdsContainer = this.shadowRoot.querySelector('#competitor-ads');

    // Mock Data
    const myAds = [
        { creative: 'https://via.placeholder.com/300x200.png?text=My+Ad+1', copy: 'This is my first ad.' },
        { creative: 'https://via.placeholder.com/300x200.png?text=My+Ad+2', copy: 'This is my second ad.' },
    ];

    const competitorAds = [
        { creative: 'https://via.placeholder.com/300x200.png?text=Competitor+1', copy: 'Competitor ad 1.' },
        { creative: 'https://via.placeholder.com/300x200.png?text=Competitor+2', copy: 'Competitor ad 2.' },
        { creative: 'https://via.placeholder.com/300x200.png?text=Competitor+3', copy: 'Competitor ad 3.' },
    ];

    myAds.forEach(ad => {
        const adCard = document.createElement('ad-card');
        adCard.setAttribute('creative', ad.creative);
        adCard.setAttribute('copy', ad.copy);
        myAdsContainer.appendChild(adCard);
    });

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

  connectedCallback() {
    const creative = this.getAttribute('creative');
    const copy = this.getAttribute('copy');
    this.shadowRoot.innerHTML = `
        <div class="ad-card">
            <img src="${creative}" alt="Ad Creative">
            <div class="ad-card-content">
                <p>${copy}</p>
            </div>
        </div>
    `;
  }
}

class InsightDocument extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <div class="insight-document">
            <h3>Analysis & Recommendations</h3>
            <p><strong>Key Finding 1:</strong> Your current ad creative relies heavily on static images. Competitors are seeing higher engagement with short-form video content.</p>
            <p><strong>Recommendation:</strong> Incorporate video ads into your next campaign to potentially increase user interaction and conversion rates.</p>
            <p><strong>Key Finding 2:</strong> Competitor messaging focuses on emotional benefits, while your copy is more feature-driven.</p>
            <p><strong>Recommendation:</strong> Test new ad copy that highlights the emotional outcomes of using your product.</p>
        </div>
    `;
    }
}

customElements.define('observer-header', ObserverHeader);
customElements.define('url-input-form', UrlInputForm);
customElements.define('results-display', ResultsDisplay);
customElements.define('ad-card', AdCard);
customElements.define('insight-document', InsightDocument);