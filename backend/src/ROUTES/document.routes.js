const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const fs = require("fs/promises");
const path = require("path");

const { generateEmbedding } = require("../services/embedding");
const chunkText = require("../utils/chunkText");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF files are allowed."));
    }

    callback(null, true);
  },
});

const DATA_DIR = path.join(__dirname, "../../data");
const CHUNKS_FILE = path.join(DATA_DIR, "chunks.json");
const EMBEDDINGS_FILE = path.join(DATA_DIR, "embeddings.json");

// Read existing chunks from local storage.
async function readChunks() {
  try {
    const data = await fs.readFile(CHUNKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

// Read existing embeddings from local storage.
async function readEmbeddings() {
  try {
    const data = await fs.readFile(EMBEDDINGS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

// POST /api/documents/upload
router.post("/upload", upload.single("document"), async (req, res) => {
  let parser;

  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a PDF file.",
      });
    }

    // Extract text from the uploaded PDF.
    parser = new PDFParse({
      data: req.file.buffer,
    });

    const result = await parser.getText();
    const extractedText = result.text.trim();

    if (!extractedText) {
      return res.status(422).json({
        error: "No readable text found in this PDF.",
      });
    }

    // Split the extracted text into chunks.
    const chunks = chunkText(extractedText);

    if (chunks.length === 0) {
      return res.status(422).json({
        error: "No text chunks could be created from this PDF.",
      });
    }

    await fs.mkdir(DATA_DIR, {
      recursive: true,
    });

    // Load existing data.
    const existingChunks = await readChunks();
    const existingEmbeddings = await readEmbeddings();

    // Remove previous data for the same filename.
    const remainingChunks = existingChunks.filter(
      (chunk) => chunk.filename !== req.file.originalname,
    );

    const remainingEmbeddings = existingEmbeddings.filter(
      (item) => item.filename !== req.file.originalname,
    );

    // Create new chunks with unique IDs.
    const documentId = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const newChunks = chunks.map((text, index) => ({
      id: `${documentId}-${index}`,
      filename: req.file.originalname,
      chunkIndex: index,
      text,
    }));

    // Generate embeddings for the new chunks.
    const newEmbeddings = [];

    for (let index = 0; index < newChunks.length; index++) {
      const chunk = newChunks[index];

      console.log(
        `Generating embedding ${index + 1} of ${newChunks.length}...`,
      );

      const embedding = await generateEmbedding(chunk.text);

      newEmbeddings.push({
        ...chunk,
        embedding,
      });
    }

    // Save chunks and embeddings locally.
    await fs.writeFile(
      CHUNKS_FILE,
      JSON.stringify([...remainingChunks, ...newChunks], null, 2),
      "utf8",
    );

    await fs.writeFile(
      EMBEDDINGS_FILE,
      JSON.stringify([...remainingEmbeddings, ...newEmbeddings]),
      "utf8",
    );

    return res.status(200).json({
      message: "PDF processed and indexed successfully.",
      filename: req.file.originalname,
      pages: result.total,
      characters: extractedText.length,
      chunksCreated: newChunks.length,
      embeddingsCreated: newEmbeddings.length,
      vectorDimensions: newEmbeddings[0].embedding.length,
      sampleChunk: newChunks[0].text.slice(0, 300),
    });
  } catch (error) {
    console.error("PDF Processing Error:", error);

    return res.status(500).json({
      error: "Failed to process the PDF.",
    });
  } finally {
    if (parser) {
      await parser.destroy().catch(() => {});
    }
  }
});

module.exports = router;
