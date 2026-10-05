const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

   const response = await ai.models.generateContent({
     model: "gemini-3.5-flash-lite",
     contents: message,
   });

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      error: error.message,
      status: error.status,
    });
  }
});

module.exports = router;
