const fs = require("fs/promises");
const path = require("path");
const { generateEmbedding } = require("./embedding");

const EMBEDDINGS_FILE = path.join(__dirname, "../../data/embeddings.json");

function cosineSimilarity(vectorA, vectorB) {
  if (
    !Array.isArray(vectorA) ||
    !Array.isArray(vectorB) ||
    vectorA.length === 0 ||
    vectorA.length !== vectorB.length
  ) {
    return -1;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    if (!Number.isFinite(vectorA[i]) || !Number.isFinite(vectorB[i])) {
      return -1;
    }

    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return -1;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

async function searchDocuments(question, topK = 3) {
  let fileContent;

  try {
    fileContent = await fs.readFile(EMBEDDINGS_FILE, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const documents = JSON.parse(fileContent);

  if (!Array.isArray(documents) || documents.length === 0) {
    return [];
  }

  const questionEmbedding = await generateEmbedding(question);

  const results = documents
    .filter(
      (document) =>
        document &&
        typeof document.text === "string" &&
        Array.isArray(document.embedding),
    )
    .map((document) => ({
      ...document,
      score: cosineSimilarity(questionEmbedding, document.embedding),
    }))
    .filter((document) => document.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, topK));

  return results;
}

module.exports = { searchDocuments };
