
const exportToMarkdown = (state) => {
  // Markdown export logic will go here. For now, we'll just return a placeholder.
  return `# 경쟁사 분석

${JSON.stringify(state, null, 2)}
`;
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard');
  }, () => {
    console.error('Failed to copy');
  });
};

export { exportToMarkdown, copyToClipboard };
