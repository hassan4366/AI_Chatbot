const { generateEmbedding } = require("./src/services/embedding");

async function test() {
  try {
    const text = "A server provides services over a network.";

    console.log("Generating embedding...");

    const embedding = await generateEmbedding(text);

    console.log("Embedding generated successfully!");
    console.log("Vector dimensions:", embedding.length);
    console.log("First 10 values:", embedding.slice(0, 10));
  } catch (error) {
    console.error("Embedding Error:", error);
  }
}

test();
