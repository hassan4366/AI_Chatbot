# RAG Chatbot

An AI-powered document assistant built with React, Node.js, Express, and Google's Gemini API. The application uses Retrieval-Augmented Generation (RAG) to retrieve relevant information from uploaded PDF documents and generate context-aware AI responses.

## Overview

RAG Chatbot is a full-stack AI application that allows users to interact with an AI assistant and ask questions about their own documents.

Users can upload PDF files, extract and split their content into smaller text chunks, generate embeddings, and retrieve relevant information through semantic similarity search before generating an answer with Gemini.

The project combines a React-based chat interface with a Node.js backend and a locally stored document knowledge base.

## Features

- Interactive React chatbot interface
- User and AI message rendering
- Loading indicators and error handling
- Google Gemini API integration
- PDF document upload and processing
- PDF text extraction
- Text chunking for document processing
- Local embedding generation using `Xenova/all-MiniLM-L6-v2`
- Persistent storage of text chunks and embeddings in JSON files
- Semantic similarity search using cosine similarity
- Context-aware responses based on retrieved document content
- REST API integration between frontend and backend
- Environment variable support for API credentials

## How It Works

The application follows a Retrieval-Augmented Generation workflow:

1. The user uploads a PDF document.
2. The backend extracts text from the document.
3. The extracted text is divided into smaller chunks.
4. An embedding model converts the chunks into numerical vectors.
5. The chunks and their embeddings are stored locally in JSON files.
6. When the user asks a question, the system generates an embedding for the query.
7. Semantic search compares the query embedding with stored document embeddings using cosine similarity.
8. The most relevant chunks are retrieved and provided as context to Gemini.
9. Gemini generates a response using the retrieved context and the user's question.
10. The response is returned to the React chat interface.

## Architecture

### Document Ingestion

```text
PDF Upload
    |
    v
Express Upload Endpoint
    |
    v
PDF Text Extraction
    |
    v
Text Chunking
    |
    v
Embedding Generation
    |
    v
Local JSON Storage
(chunks.json / embeddings.json)
```

### Question Answering

```text
User Question
    |
    v
React Frontend
    |
    v
Express Chat API
    |
    v
Query Embedding
    |
    v
Cosine Similarity Search
    |
    v
Relevant Document Chunks
    |
    v
Gemini API + Retrieved Context
    |
    v
AI Response
    |
    v
React Chat Interface
```

## Technologies

### Frontend

- React
- JavaScript
- HTML5
- CSS3
- Fetch API

### Backend

- Node.js
- Express.js
- REST APIs
- CORS
- dotenv
- PDF processing libraries

### AI and RAG

- Google Gemini API
- `@google/genai`
- Hugging Face Transformers.js
- `Xenova/all-MiniLM-L6-v2` embedding model
- Cosine similarity search
- JSON-based local document and embedding storage

## Project Structure

```text
rag-chatbot/
|
├── Frontend/
|   ├── public/
|   |   └── Image/
|   |       └── chatbot photo.jpg
|   |
|   ├── src/
|   |   ├── components/
|   |   |   ├── ChatInput.jsx
|   |   |   ├── ChatInput.css
|   |   |   ├── ChatWindow.jsx
|   |   |   ├── ChatWindow.css
|   |   |   ├── Message.jsx
|   |   |   └── DocumentUpload.jsx
|   |   |
|   |   ├── App.js
|   |   ├── App.css
|   |   └── ...
|   |
|   └── package.json
|
├── backend/
|   ├── src/
|   |   ├── routes/
|   |   |   └── chat.routes.js
|   |   └── server.js
|   |
|   ├── data/
|   |   ├── chunks.json
|   |   └── embeddings.json
|   |
|   ├── .env
|   ├── .gitignore
|   └── package.json
|
└── README.md
```

*Note: The structure above summarizes the main project files. Adjust filenames and folders if your current implementation differs.*

## API Endpoints

### 1. Chat

**Method:** `POST`

**Endpoint:**

```text
http://localhost:5000/api/chat
```

**Request body:**

```json
{
  "message": "What does the uploaded document say about refunds?"
}
```

**Response example:**

```json
{
  "reply": "According to the retrieved document context, ..."
}
```

The response format above is illustrative; the actual answer depends on the backend implementation and retrieved content.

### 2. Upload a PDF Document

**Method:** `POST`

**Endpoint:**

```text
http://localhost:5000/api/documents/upload
```

**Request format:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `document` | File | The PDF document to process |

The backend processes the uploaded PDF, generates chunks and embeddings, and stores the processed data for subsequent retrieval.

A successful response includes information such as the processed filename and the number of chunks created.

## Installation

### Prerequisites

- Node.js and npm
- A Google Gemini API key
- Git

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd rag-chatbot
```

### 2. Install Frontend Dependencies

```bash
cd Frontend
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
GEMINI_API_KEY=your_api_key_here
```

Use the environment variable name expected by your backend configuration. Never commit your actual API key to GitHub.

## Running the Application

### Start the Backend

From the `backend/` directory, run:

```bash
npm run dev
```

The backend is expected to run at:

```text
http://localhost:5000
```

### Start the Frontend

From the `Frontend/` directory, run the development command configured in its `package.json`.

For example, if the project uses Create React App:

```bash
npm start
```

If the project uses Vite:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Understanding the RAG Pipeline

### 1. Document Processing

The application extracts text from uploaded PDF files and splits it into smaller chunks. Chunking helps the system retrieve relevant sections instead of sending an entire document to the language model.

### 2. Embedding Generation

The application uses `Xenova/all-MiniLM-L6-v2` through Transformers.js to represent text as numerical vectors.

These embeddings allow the system to compare the meaning of a question with the content of stored document chunks.

### 3. Semantic Search

The backend generates an embedding for the user's question and compares it with stored embeddings using cosine similarity.

The most relevant chunks are selected as context for the AI response.

### 4. Context-Aware Generation

The retrieved chunks are sent to Gemini alongside the user's question. This allows the model to produce answers informed by the uploaded documents rather than relying exclusively on its general pretrained knowledge.

## Why RAG?

Retrieval-Augmented Generation offers several benefits:

- Enables question answering over custom documents.
- Reduces the need to manually provide context with every question.
- Allows knowledge to be updated by processing additional documents.
- Improves the relevance of responses for document-specific questions.
- Can provide traceable source references when document metadata and citations are implemented.

RAG can reduce hallucinations, but it does not eliminate them. Answer quality depends on document quality, retrieval relevance, and how the language model uses the retrieved context.

## Security and Data Storage

- Keep the Gemini API key on the backend.
- Store secrets in environment variables.
- Exclude `.env` and `node_modules` from version control.
- Avoid committing sensitive documents or generated data containing private information.
- Validate uploaded file types and enforce file-size limits on the backend.

The current implementation uses local JSON files for chunk and embedding storage. This is suitable for a learning project, but a database or dedicated vector store may be more appropriate as the knowledge base grows.

## Current Limitations

- Local JSON storage is not designed for large-scale concurrent workloads.
- PDF extraction quality dea may require additional implementation.
- Authentication, access control, and production deplopends on the document format; scanned PDFs may require OCR.
- Retrieval quality depends on chunking, embeddings, and similarity ranking.
- Source citations and document-level metadatyment are future improvements.

## Future Improvements

- Support additional document formats, such as TXT and DOCX.
- Add document management and deletion.
- Add source citations for retrieved passages.
- Improve chunking and retrieval strategies.
- Introduce a dedicated vector database when needed.
- Add chat history and conversation memory.
- Implement streaming responses.
- Add authentication and user-specific knowledge bases.
- Improve upload validation and error handling.
- Deploy the application to a production environment.


## Project Status

**Status: In Development**

The project includes a React chat interface, a Node.js/Express backend, Gemini integration, and a working local RAG workflow for PDF document processing and semantic retrieval.

The next development stage focuses on improving the user experience, document management, retrieval quality, and production readiness.
