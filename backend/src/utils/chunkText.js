
function chunkText(text, chunkSize = 800, overlap = 150) {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < normalizedText.length) {
    const end = Math.min(start + chunkSize, normalizedText.length);
    const chunk = normalizedText.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === normalizedText.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}

module.exports = chunkText;
