# RAG Chatbot

An AI-powered chatbot built with React and Node.js, designed to provide intelligent responses using Google's Gemini API, with Retrieval-Augmented Generation (RAG) planned as the next stage.

## Overview

RAG Chatbot is a full-stack AI chatbot application that allows users to communicate with an AI assistant through a modern React interface.

The project is being developed in multiple stages:

1. Build the chatbot frontend.
2. Build a Node.js/Express backend.
3. Connect the backend to Google's Gemini API.
4. Add Retrieval-Augmented Generation (RAG).
5. Connect the chatbot to a custom knowledge base.
6. Retrieve relevant information before generating AI responses.

The goal is to build a chatbot that can answer general questions and, eventually, provide accurate answers based on custom documents and knowledge sources.

---

## Current Architecture

```text
React Frontend
      │
      │ HTTP POST
      ▼
Node.js + Express Backend
      │
      ▼
Gemini API
      │
      ▼
AI Response
      │
      ▼
React Chat Interface
```

### Planned RAG Architecture

```text
                    ┌──────────────────┐
                    │   User Question  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Express Backend  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Query Embedding  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Vector Database │
                    └────────┬─────────┘
                             │
                     Relevant Chunks
                             │
                             ▼
                    ┌──────────────────┐
                    │ Gemini AI Model  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    AI Answer     │
                    └──────────────────┘
```

---

## Features

### Current Features

* Modern React chatbot interface
* User and AI message separation
* Real-time message rendering
* Express.js backend
* REST API for chat requests
* Gemini API integration
* Loading state while waiting for AI response
* Error handling
* Environment variable support
* CORS configuration

### Planned Features

* Retrieval-Augmented Generation (RAG)
* Document upload
* PDF/TXT document processing
* Text chunking
* Embedding generation
* Vector database integration
* Semantic search
* Context-aware AI responses
* Chat history
* Conversation memory
* Source/document references
* Improved streaming responses

---

## Technologies

### Frontend

* React
* JavaScript
* HTML5
* CSS3
* Fetch API

### Backend

* Node.js
* Express.js
* CORS
* dotenv

### AI

* Google Gemini API
* `@google/genai`

### Planned RAG Stack

* Embedding model
* Vector database
* Document processing
* Semantic search

---

## Project Structure

```text
rag-chatbot/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── Message.jsx
│   │   │
│   │   └── ...
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── src/
│   │   ├── routes/
│   │   │   └── chat.routes.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

# Frontend

The frontend is responsible for displaying the chatbot interface and communicating with the backend.

## Main Components

### ChatWindow

Responsible for:

* Managing chat messages
* Sending messages to the backend
* Displaying AI responses
* Handling loading states
* Handling errors

### ChatInput

Responsible for:

* Receiving user input
* Submitting messages
* Clearing the input field

### Message

Responsible for displaying individual user and AI messages.

---

# Backend

The backend is built using Node.js and Express.

Its main responsibility is to act as a secure layer between the React application and the Gemini API.

The frontend never communicates directly with Gemini.

Instead:

```text
React
  ↓
Express API
  ↓
Gemini
```

This approach keeps API credentials on the server side.

---

# API

## Chat Endpoint

### POST

```text
/api/chat
```

### Full URL

```text
http://localhost:5000/api/chat
```

### Request

```json
{
  "message": "Hello"
}
```

### Response

```json
{
  "reply": "Hello! How can I help you today?"
}
```

---

# Gemini Integration

The backend uses Google's Gemini API to generate AI responses.

The Gemini API key is stored in an environment variable.

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=your_api_key_here
```

Never commit the `.env` file to GitHub.

The project uses:

```text
.env
```

inside `.gitignore`.

---

# Installation

## 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

```bash
cd rag-chatbot
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

---

# Running the Project

## Start Backend

Inside the `backend` directory:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

You can also test the server by opening:

```text
http://localhost:5000
```

Expected response:

```json
{
  "message": "Chatbot Backend is running"
}
```

---

## Start Frontend

Inside the `frontend` directory:

```bash
npm run dev
```

Then open the URL provided by Vite in the terminal.

---

# Testing the API

You can test the backend using Thunder Client, Postman, or another API testing tool.

### Request

```text
POST http://localhost:5000/api/chat
```

### Body

```json
{
  "message": "What is artificial intelligence?"
}
```

### Expected Response

```json
{
  "reply": "..."
}
```

---

# RAG Implementation

RAG stands for:

> Retrieval-Augmented Generation

Instead of asking the AI to answer only from its pretrained knowledge, RAG allows the application to retrieve relevant information from an external knowledge base before generating the response.

## RAG Pipeline

```text
Documents
    ↓
Document Loading
    ↓
Text Extraction
    ↓
Text Chunking
    ↓
Embeddings
    ↓
Vector Database
    ↓
Similarity Search
    ↓
Relevant Context
    ↓
Gemini
    ↓
Final Answer
```

### Example

Suppose the knowledge base contains:

```text
refund-policy.pdf
company-info.txt
faq.txt
```

The user asks:

```text
Can I get a refund after 14 days?
```

The RAG system will:

1. Convert the question into an embedding.
2. Search the vector database.
3. Find the most relevant document chunks.
4. Add those chunks to the prompt.
5. Send the context and question to Gemini.
6. Generate an answer based on the retrieved information.

---

# Why RAG?

RAG provides several advantages:

* Uses custom knowledge
* Reduces hallucinations
* Keeps information updatable
* Allows private knowledge bases
* Provides more context-aware answers
* Avoids retraining the entire AI model

---

# Security

The Gemini API key must never be exposed in the frontend.

Do not write:

```js
const apiKey = "YOUR_API_KEY";
```

Instead, store it in:

```env
GEMINI_API_KEY=your_api_key_here
```

and access it from the backend using:

```js
process.env.GEMINI_API_KEY
```

The `.env` file is excluded from Git using:

```gitignore
node_modules
.env
```

---

# Development Roadmap

## Phase 1 — Frontend

* [x] React chatbot interface
* [x] Chat input
* [x] Message component
* [x] Chat window
* [x] User messages
* [x] AI messages
* [x] Responsive UI

## Phase 2 — Backend

* [x] Node.js setup
* [x] Express server
* [x] CORS
* [x] Environment variables
* [x] Chat API
* [x] API testing

## Phase 3 — AI Integration

* [x] Gemini API setup
* [x] Gemini API key
* [x] Gemini SDK
* [x] AI response generation
* [x] Frontend-to-backend integration

## Phase 4 — RAG

* [ ] Document loading
* [ ] PDF processing
* [ ] Text extraction
* [ ] Text chunking
* [ ] Embeddings
* [ ] Vector database
* [ ] Semantic search
* [ ] Context retrieval
* [ ] RAG prompt
* [ ] Source references

## Phase 5 — Advanced Features

* [ ] Chat history
* [ ] Conversation memory
* [ ] Streaming responses
* [ ] User authentication
* [ ] Document management
* [ ] Better error handling
* [ ] Production deployment

---

# Environment

The project is currently developed locally using:

```text
Frontend:
React + Vite

Backend:
Node.js + Express

AI:
Google Gemini API
```

---

# Future Improvements

The project will be extended to support a complete RAG pipeline.

Future improvements include:

* Multiple document formats
* Semantic document retrieval
* Better chunking strategies
* Metadata filtering
* Conversation context
* Streaming AI responses
* Source citations
* Authentication
* Cloud deployment
* Production vector database

---

# Author

**Hassan Hammam**

Computer and Information Student
Software Development & Frontend React

---

# Project Status

🚧 **In Development**

The basic chatbot and Gemini integration are currently completed.

The next major milestone is implementing the **Retrieval-Augmented Generation (RAG)** pipeline.
