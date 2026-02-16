import { render } from './src/ui.js';

// This is the main entry point of the application.
// It imports the initial render function from ui.js and executes it.

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the DOM is fully loaded before rendering.
    render();

    // You can add other app-wide initializations here if needed.
    console.log("Ad Composer application started.");
});
