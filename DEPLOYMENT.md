# Deployment Guide

## Quick Start Guide

### 1. Environment Setup

Create environment files from examples:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration  
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### 2. Start with Docker Compose

```bash
docker-compose up -d
```

This will start:
- **Backend API** on port 8000
- **Frontend** on port 3000
- **PostgreSQL** on port 5432
- **Qdrant** on port 6333

### 3. Verify Services

- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 4. Usage

1. **Upload Documents**: Click "Upload Documents" and select PDF, DOCX, or TXT files
2. **Wait for Processing**: Documents will be processed in the background
3. **Ask Questions**: Type your question in the search box
4. **View Results**: See AI-generated answers with citations

---

## Production Deployment

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Build and Push Images**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
   
   # Build and push backend
   docker build -t rag-backend ./backend
   docker tag rag-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/rag-backend:latest
   docker push <account>.dkr.ecr.us-east-1.amazonaws.com/rag-backend:latest
   
   # Build and push frontend
   docker build -t rag-frontend ./frontend
   docker tag rag-frontend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/rag-frontend:latest
   docker push <account>.dkr.ecr.us-east-1.amazonaws.com/rag-frontend:latest
   ```

2. **Set Up RDS (PostgreSQL)**
   - Create RDS PostgreSQL instance
   - Note connection details

3. **Deploy Qdrant**
   - Use EC2 with Qdrant Docker image, or
   - Use managed Qdrant Cloud

4. **Create ECS Task Definitions**
   - Backend task with environment variables
   - Frontend task with API_URL pointing to backend

5. **Set Up Load Balancer**
   - Application Load Balancer for both services
   - SSL certificate for HTTPS

### Google Cloud Platform

```bash
# Deploy to Cloud Run
gcloud run deploy rag-backend \
  --image gcr.io/<project>/rag-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars OPENAI_API_KEY=<key>

gcloud run deploy rag-frontend \
  --image gcr.io/<project>/rag-frontend \
  --platform managed \
  --region us-central1
```

### Render.com (Easiest)

1. Create Web Services for backend and frontend
2. Link GitHub repository
3. Set environment variables in dashboard
4. Auto-deploys on git push

---

## Environment Variables

### Backend (.env)
```bash
OPENAI_API_KEY=sk-...           # Required
POSTGRES_SERVER=db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<secure-password>
POSTGRES_DB=ragdb
QDRANT_URL=http://qdrant:6333
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000  # Change to production URL in prod
```

---

## Monitoring & Observability

### Logging

Logs are written to `backend/logs/app.log` and stdout.

### Health Checks

- **Backend**: `GET /health` returns `{"status": "healthy"}`
- Use this for load balancer health checks

### Metrics (Optional)

Add Prometheus exporter:
```bash
pip install prometheus-fastapi-instrumentator
```

---

## Scaling Recommendations

| Component | Horizontal Scaling | Vertical Scaling |
|-----------|-------------------|------------------|
| Backend | ✅ Multiple instances behind LB | CPU/Memory as needed |
| Frontend | ✅ CDN + multiple instances | Minimal resources |
| PostgreSQL | Read replicas | Larger instance |
| Qdrant | ✅ Cluster mode | More RAM for vectors |

---

## Security Checklist

- [ ] API keys in secure secrets manager (AWS Secrets Manager, GCP Secret Manager)
- [ ] HTTPS/TLS enabled
- [ ] CORS restricted to production domains
- [ ] Database password rotated regularly
- [ ] Rate limiting enabled (add middleware)
- [ ] Input validation on all endpoints

---

## Troubleshooting

### "Connection refused" errors
- Ensure all services are running: `docker-compose ps`
- Check logs: `docker-compose logs backend`

### Documents stuck in "PROCESSING"
- Check backend logs for errors
- Verify OpenAI API key is valid
- Check Qdrant is running: `curl http://localhost:6333/collections`

### Frontend can't reach backend
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend
- Ensure backend is accessible from frontend network
