
const generateAnalysis = (state) => {
  // MECE analysis logic will go here. For now, we'll just return a placeholder.
  return `
## 경쟁사 분석: ${state.competitors.map(c => c.name).join(', ')}

* 분석 내용이 여기에 들어갑니다.
`;
};

export { generateAnalysis };
