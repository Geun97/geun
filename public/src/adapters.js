
const parseLandingUrl = (url) => {
  try {
    const urlObject = new URL(url);
    return {
      hostname: urlObject.hostname,
      pathname: urlObject.pathname,
    };
  } catch (e) {
    return { hostname: '', pathname: '' };
  }
};

const parseMetaUrl = (url) => {
  try {
    const urlObject = new URL(url);
    return {
      id: urlObject.searchParams.get('id'),
    };
  } catch (e) {
    return { id: '' };
  }
};

export { parseLandingUrl, parseMetaUrl };
