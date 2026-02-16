const defaultState = {
  my: {
    landingUrl: '',
    metaAdLibraryUrl: '',
    topAdsJsonRaw: '',
    topAds: null,
  },
  competitor: {
    landingUrl: '',
    metaAdLibraryUrl: '',
    topAdsJsonRaw: '',
    topAds: null,
  },
  derived: null // extracted analysis data
};

let state = { ...defaultState };

// Load from localStorage
const loadState = () => {
  try {
    const saved = localStorage.getItem('adComposerState_v2');
    if (saved) {
      return { ...defaultState, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
  return { ...defaultState };
};

// Save to localStorage
const saveState = () => {
  localStorage.setItem('adComposerState_v2', JSON.stringify(state));
};

// Initialize
state = loadState();

const updateMyData = (key, value) => {
  state.my = { ...state.my, [key]: value };
  saveState();
};

const updateCompetitorData = (key, value) => {
  state.competitor = { ...state.competitor, [key]: value };
  saveState();
};

const setDerivedData = (data) => {
  state.derived = data;
  saveState();
};

const resetState = () => {
  state = { ...defaultState };
  saveState();
};

export { state, updateMyData, updateCompetitorData, setDerivedData, resetState };

