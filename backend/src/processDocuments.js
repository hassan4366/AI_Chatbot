const fs = require("fs/promises");
const path = require("path");
const { generateEmbedding } = require("./services/embedding");

const DATA_DIR = path.join(__dirname, "../data");
const CHUNKS_FILE = path.join(DATA_DIR, "chunks.json");
const EMBEDDINGS_FILE = path.join(DATA_DIR, "embeddings.json");

async function processDocuments() {
  try {
    const fileContent = await fs.readFile(CHUNKS_FILE, "utf8");
    const chunks = JSON.parse(fileContent);

    if (!Array.isArray(chunks) || chunks.length === 0) {
      throw new Error("No document chunks found.");
    }

    const embeddings = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      console.log(`Processing chunk ${i + 1} of ${chunks.length}...`);

      const vector = await generateEmbedding(chunk.text);

      embeddings.push({
        id: chunk.id,
        filename: chunk.filename,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        embedding: vector,
      });
    }

    await fs.writeFile(EMBEDDINGS_FILE, JSON.stringify(embeddings), "utf8");

    console.log("\nAll embeddings generated successfully!");
    console.log("Chunks processed:", embeddings.length);
    console.log("Vector dimensions:", embeddings[0].embedding.length);
    console.log("Saved to:", EMBEDDINGS_FILE);
  } catch (error) {
    console.error("Document Processing Error:", error.message);
    process.exitCode = 1;
  }
}

processDocuments();
