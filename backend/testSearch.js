const { searchDocuments } = require("./src/services/search");

async function testSearch() {
  try {
    const question = "What are the key players in a network?";

    console.log("Question:", question);

    const results = await searchDocuments(question);

    console.log("\nRetrieved chunks:");

    results.forEach((result, index) => {
      console.log(`\nResult ${index + 1}`);
      console.log("Filename:", result.filename);
      console.log("Chunk:", result.chunkIndex);
      console.log("Similarity:", result.score.toFixed(4));
      console.log("Text:", result.text.slice(0, 300));
    });
  } catch (error) {
    console.error("Search Error:", error);
  }
}

testSearch();
