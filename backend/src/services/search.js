const fs = require("fs/promises");
const path = require("path");
const { generateEmbedding } = require("./embedding");

const EMBEDDINGS_FILE = path.join(__dirname, "../../data/embeddings.json");

function cosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

async function searchDocuments(question, topK = 3) {
  const fileContent = await fs.readFile(EMBEDDINGS_FILE, "utf8");
  const documents = JSON.parse(fileContent);

  if (!documents.length) {
    return [];
  }

  const questionEmbedding = await generateEmbedding(question);

  const results = documents
    .map((document) => ({
      ...document,
      score: cosineSimilarity(questionEmbedding, document.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return results;
}

module.exports = { searchDocuments };
