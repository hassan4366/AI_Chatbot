const { pipeline, env } = require("@huggingface/transformers");

env.allowLocalModels = true;

let extractor = null;

async function getEmbeddingModel() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  return extractor;
}

async function generateEmbedding(text) {
  const model = await getEmbeddingModel();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}

module.exports = { generateEmbedding };
