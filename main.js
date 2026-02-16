
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
        /* Toggle Switch Styles */
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
        .theme-switch input {
            display:none;
        }
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
        .slider.round {
            border-radius: 34px;
        }
        .slider.round:before {
            border-radius: 50%;
        }
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

    // Apply the saved theme on load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
      toggleSwitch.checked = true;
    }

    // Add event listener for theme switching
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
                background-color: var(--card-background);
                color: var(--text);
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
                filter: brightness(1.2);
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
        <style>
            .results-display {
                color: var(--text);
            }
            .results-display h2 {
                font-size: 1.5rem;
                color: var(--primary-color);
                border-bottom: 2px solid var(--primary-color);
                padding-bottom: 0.5rem;
                margin-bottom: 1rem;
            }
            .ad-card-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1.5rem;
            }
            section {
                margin-bottom: 2rem;
            }
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

  static get observedAttributes() {
    return ['creative', 'copy'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const creative = this.getAttribute('creative');
    const copy = this.getAttribute('copy');
    this.shadowRoot.innerHTML = `
        <style>
            .ad-card {
                background-color: var(--card-background);
                border-radius: 8px;
                box-shadow: 0 4px 8px var(--shadow-color);
                overflow: hidden;
                transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s;
                color: var(--text);
            }
            .ad-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px var(--shadow-color);
            }
            .ad-card img {
                width: 100%;
                display: block;
            }
            .ad-card-content {
                padding: 1rem;
            }
            .ad-card-content p {
                margin: 0;
                font-size: 0.9rem;
                opacity: 0.8;
            }
        </style>
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
        <style>
            .insight-document {
                background-color: var(--card-background);
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 8px var(--shadow-color);
                transition: background-color 0.3s;
                color: var(--text);
            }
             h3 {
                color: var(--primary-color);
                margin-top: 0;
            }
             p {
                margin-bottom: 1rem;
            }
        </style>
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

class ContactForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        section {
            background-color: var(--card-background);
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 8px var(--shadow-color);
            margin-top: 2rem;
        }
        h2 {
            color: var(--primary-color);
            margin-top: 0;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        input, textarea {
            padding: 0.8rem;
            border: 1px solid var(--light-grey, #E9EBEE);
            border-radius: 4px;
            font-size: 1rem;
            background-color: var(--background);
            color: var(--text);
            font-family: var(--font-family);
        }
        textarea {
            min-height: 150px;
            resize: vertical;
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
            filter: brightness(1.2);
        }
        #form-status {
            margin-top: 1rem;
            font-weight: bold;
        }
      </style>
      <section>
        <h2>Partnership Inquiry</h2>
        <form id="contact-form" action="https://formspree.io/f/xreaqnrp" method="POST">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>

            <label for="message">Message</label>
            <textarea id="message" name="message" required></textarea>

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
        const response = await fetch(e.target.action, {
          method: 'POST',
          body: data,
          headers: {
              'Accept': 'application/json'
          }
        });

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

customElements.define('observer-header', ObserverHeader);
customElements.define('url-input-form', UrlInputForm);
customElements.define('results-display', ResultsDisplay);
customElements.define('ad-card', AdCard);
customElements.define('insight-document', InsightDocument);
customElements.define('contact-form', ContactForm);
