
import { state, setState } from './state.js';
import { generateAnalysis } from './templates.js';
import { exportToMarkdown, copyToClipboard } from './exporters.js';

const composerView = () => document.getElementById('composer-view');
const resultsView = () => document.getElementById('results-view');

const render = () => {
    const currentView = window.location.hash;
    if (currentView === '#results') {
        composerView().style.display = 'none';
        resultsView().style.display = 'block';
        resultsView().innerHTML = `
            <div>
                <button id="back-to-composer">Back to Composer</button>
                <pre>${generateAnalysis(state)}</pre>
                <button id="copy-button">Copy Markdown</button>
            </div>
        `;
        document.getElementById('copy-button').addEventListener('click', () => {
            copyToClipboard(exportToMarkdown(state));
        });
        document.getElementById('back-to-composer').addEventListener('click', () => {
            window.location.hash = '#';
        });
    } else {
        composerView().style.display = 'block';
        resultsView().style.display = 'none';

        // Add a "View Last Results" button if results exist
        if (state.myLandingUrl) {
            let viewResultsButton = document.getElementById('view-results-button');
            if (!viewResultsButton) {
                viewResultsButton = document.createElement('button');
                viewResultsButton.id = 'view-results-button';
                viewResultsButton.textContent = 'View Last Results';
                composerView().appendChild(viewResultsButton);

                viewResultsButton.addEventListener('click', () => {
                    window.location.hash = '#results';
                });
            }
        }
    }
}

window.addEventListener('hashchange', render);

export { render };
