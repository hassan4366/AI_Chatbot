const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoutes = require("./ROUTES/chat.routes");
const documentRoutes = require("./ROUTES/document.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Existing chat endpoint.
app.use("/api/chat", chatRoutes);

// New PDF upload endpoint.
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Chatbot Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
