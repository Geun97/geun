
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
                <pre>${generateAnalysis(state)}</pre>
                <button id="copy-button">Copy Markdown</button>
                <a href="#">Back</a>
            </div>
        `;
        document.getElementById('copy-button').addEventListener('click', () => {
            copyToClipboard(exportToMarkdown(state));
        });
    } else {
        composerView().style.display = 'block';
        resultsView().style.display = 'none';
    }
}

window.addEventListener('hashchange', render);

export { render };
