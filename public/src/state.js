
let state = {
  myLandingUrl: '',
  competitors: [],
  ads: [],
};

const saveState = () => {
  localStorage.setItem('appState', JSON.stringify(state));
};

const loadState = () => {
  const savedState = localStorage.getItem('appState');
  if (savedState) {
    state = JSON.parse(savedState);
  }
};

const setState = (patch) => {
  Object.assign(state, patch);
  saveState();
  // We'll need a way to trigger a re-render, which will be handled in ui.js
};

loadState();

export { state, setState };
