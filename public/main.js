
import { state, setState } from './src/state.js';
import { render } from './src/ui.js';
import { validate, competitorSchema } from './src/validators.js';

// Initial render
render();

class AdComposer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        /* Add some basic styling */
      </style>
      <div>
        <input type="text" id="my-landing-url" placeholder="My Landing Page URL">
        <button id="analyze-button">Analyze</button>
      </div>
    `;

    this.shadowRoot.getElementById('analyze-button').addEventListener('click', () => {
      const myLandingUrl = this.shadowRoot.getElementById('my-landing-url').value;
      const validationErrors = validate({ myLandingUrl }, { myLandingUrl: 'string' });

      if(validationErrors.length > 0){
          alert(validationErrors.join('\n'));
          return;
      }

      setState({ myLandingUrl });
      window.location.hash = '#results';
    });
  }
}

customElements.define('ad-composer', AdComposer);

function selfCheck(){
    console.log("Running self-check...");
    // Dummy tests for now
    console.assert(true, "Test 1 passed");
    console.log("Self-check complete.");
}

selfCheck();

async function displayBuildInfo() {
  try {
    const response = await fetch('index.html');
    const html = await response.text();
    const buildTimeMatch = html.match(/<!-- BUILD: (.*) -->/);
    const appVersion = "1.0.0";
    let buildInfo = `Version: ${appVersion}`;
    if (buildTimeMatch && buildTimeMatch[1]) {
      const buildTime = buildTimeMatch[1].trim();
      buildInfo += `, Build Time: ${buildTime}`;
    }
    const footerP = document.querySelector('footer p');
    if (footerP) {
      footerP.textContent = buildInfo;
    }
  } catch (error) {
    console.error('Error fetching or parsing build info:', error);
  }
}

displayBuildInfo();
