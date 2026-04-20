# Production RAG System

A production-ready RAG (Retrieval-Augmented Generation) system with a FastAPI backend, React frontend, vector database (Qdrant), and PostgreSQL for metadata storage.

## Features

- **Backend API**: FastAPI with async support, OpenAPI documentation
- **Document Processing**: PDF, DOCX, TXT, MD support with text extraction
- **Intelligent Chunking**: RecursiveCharacterTextSplitter with sentence boundary awareness
- **Vector Search**: Qdrant vector database with hybrid search capabilities
- **Embeddings**: OpenAI text-embedding-3-small for efficient semantic search
- **RAG Pipeline**: Retrieval + Generation with citation support
- **Modern UI**: React frontend with Tailwind CSS
- **Production Ready**: Docker, CI/CD, logging, error handling

## Architecture

```
┌─────────────┐      ┌──────────────┐       ┌─────────────┐
│   React     │─────▶│   FastAPI    │─────▶│  Qdrant     │
│  Frontend   │      │   Backend    │       │  (Vectors)  │
└─────────────┘      └──────────────┘       └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │ PostgreSQL  │
                     │ (Metadata)  │
                     └─────────────┘
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- OpenAI API Key

### Local Development

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd rag-system
   ```

2. **Configure Environment**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your OPENAI_API_KEY
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Start Services**
   ```bash
   docker-compose up
   ```

4. **Access**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Project Structure

```
rag-system/
├── backend/
│   ├── app/
│   │   ├── api/routes/      # API endpoints
│   │   ├── core/            # Configuration, logging
│   │   ├── models/          # Database & Pydantic models
│   │   ├── services/        # Business logic (RAG, embeddings, etc.)
│   │   └── main.py          # FastAPI entry point
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # API client
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml

```

## API Endpoints

- `POST /api/v1/documents/upload` - Upload document for processing
- `GET /api/v1/documents` - List all documents with status
- `DELETE /api/v1/documents/{id}` - Delete document
- `POST /api/v1/search` - Semantic search (returns chunks)
- `POST /api/v1/chat` - RAG query (returns answer + citations)

See full API documentation at `/docs` when running.

## Deployment

### Docker Compose (Recommended for Development)
```bash
docker-compose up -d
```

### Cloud Deployment

**AWS/GCP/Azure:**
1. Build and push images to container registry
2. Deploy using ECS/Cloud Run/Container Instances
3. Set up managed PostgreSQL and Qdrant (or use cloud alternatives)
4. Configure environment variables

**Environment Variables:**
- `OPENAI_API_KEY` - Required for embeddings and LLM
- `QDRANT_URL` - Qdrant connection URL
- `POSTGRES_SERVER`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

## Testing

```bash
# Backend tests
cd backend
pip install pytest pytest-cov
pytest --cov=app

# Frontend tests
cd frontend
npm run test
```

## Performance & Scaling

- **Caching**: Add Redis for query result caching
- **Async Workers**: Use Celery or Arq for background document processing
- **Load Balancing**: Deploy multiple backend instances behind a load balancer
- **Vector DB Scaling**: Qdrant supports clustering and sharding

## Security

- API keys stored in environment variables (never in code)
- CORS configured for production origins
- HTTPS/TLS in production deployments
- Database credentials secured via secrets management

## Monitoring

Add monitoring with:
- Prometheus + Grafana for metrics
- Sentry for error tracking
- Structured logging to CloudWatch/Stackdriver

## License

MIT

