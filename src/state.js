let state = {
  myLandingUrl: '',
  competitors: [],
};

// Function to load state from localStorage
const loadState = () => {
  const savedState = localStorage.getItem('adComposerState');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return state; // Return default state if nothing is saved
};

// Function to save state to localStorage
const saveState = () => {
  localStorage.setItem('adComposerState', JSON.stringify(state));
};

// Initialize state
state = loadState();

const setState = (newState) => {
  state = { ...state, ...newState };
  saveState();
  // Note: In a real app, you'd trigger a re-render here.
  // Our web component will handle re-rendering itself.
};

const setMyLandingUrl = (url) => {
  state.myLandingUrl = url;
  saveState();
};

const addCompetitor = (competitor) => {
  state.competitors.push(competitor);
  saveState();
};

const removeCompetitor = (id) => {
  state.competitors = state.competitors.filter(c => c.id !== id);
  saveState();
};

const updateCompetitor = (id, key, value) => {
  const competitor = state.competitors.find(c => c.id === id);
  if (competitor) {
    competitor[key] = value;
    saveState();
  }
};

export { state, setState, setMyLandingUrl, addCompetitor, removeCompetitor, updateCompetitor };
