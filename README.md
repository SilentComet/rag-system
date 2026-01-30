# React RAG System

A modular, production-ready RAG (Retrieval-Augmented Generation) system built with React, Vite, and using Claude (Anthropic API) for semantic understanding and generation.

## Features

- **Document Processing**: Supports TXT, MD, HTML, PDF, and DOCX.
- **Intelligent Chunking**: text chunking with sentence boundary awareness.
- **Semantic Search**: Uses Claude to extract concepts and generate embeddings (simulated).
- **Interactive UI**: Modern, responsive interface built with Tailwind CSS.
- **Production Guide**: Includes architecture recommendations for moving to production.

## Project Structure

```
rag-system/
├── src/
│   ├── components/  # reusable UI components
│   ├── hooks/       # custom React hooks for logic
│   ├── services/    # API and business logic services
│   ├── utils/       # helper functions
│   └── constants/   # configuration and constants
└── ...
```

## Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` and add your Anthropic API key:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and set `VITE_ANTHROPIC_API_KEY`.

    > **⚠️ Security Warning**: In a real production app, never expose your API keys in the frontend. Use a backend proxy. This project is a demonstration of the RAG architecture.

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Architecture

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Concept Extraction**: Claude 3.5 Sonnet (via API)
- **Vector Store**: In-memory (simulated)
- **Embeddings**: Concept-boosted character frequency (simulated hybrid approach)

## Moving to Production

See the "Production Architecture Recommendations" section in the app for a detailed guide on how to scale this system using:
- Dedicated Vector DB (Pinecone/Weaviate)
- Real Embeddings (OpenAI/Cohere)
- Backend API (Python/Node.js)
