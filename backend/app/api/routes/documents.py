from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import List
import uuid
import os
from pathlib import Path
from app.models.schemas import (
    DocumentUploadResponse,
    SearchQuery,
    ChatQuery,
    ChatResponse,
    DocumentStatus,
    SearchResult
)
from app.services.ingestion import IngestionService
from app.services.rag import RAGService
from app.models.database import Document, ProcessingStatus, get_session

router = APIRouter(prefix="/api/v1", tags=["documents"])

# Ensure upload directory exists
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """Upload a document for processing"""
    # Validate file type
    allowed_extensions = {'.pdf', '.docx', '.txt', '.md'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not supported. Allowed: {allowed_extensions}"
        )
    
    # Generate unique ID and save file
    doc_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{doc_id}_{file.filename}"
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create database record
    db = get_session()
    doc = Document(
        id=doc_id,
        filename=file.filename,
        file_path=str(file_path),
        status=ProcessingStatus.PROCESSING
    )
    db.add(doc)
    db.commit()
    db.close()
    
    # Trigger async processing
    ingestion_service = IngestionService()
    background_tasks.add_task(
        ingestion_service.ingest_document,
        str(file_path),
        file.filename,
        doc_id
    )
    
    return DocumentUploadResponse(
        id=doc_id,
        filename=file.filename,
        status="PROCESSING",
        message="Document uploaded and processing started"
    )

@router.get("/documents", response_model=List[DocumentStatus])
async def list_documents():
    """List all documents with their status"""
    db = get_session()
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    db.close()
    
    return [
        DocumentStatus(
            id=doc.id,
            filename=doc.filename,
            status=doc.status.value,
            created_at=doc.created_at,
            chunk_count=doc.chunk_count,
            error=doc.error
        )
        for doc in docs
    ]

@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document and its vectors"""
    db = get_session()
    doc = db.query(Document).filter(Document.id == doc_id).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete from vector store
    from app.services.vector_store import VectorStoreService
    vector_store = VectorStoreService()
    vector_store.delete_by_doc_id(doc_id)
    
    # Delete file
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    
    # Delete from database
    db.delete(doc)
    db.commit()
    db.close()
    
    return {"message": "Document deleted successfully"}

@router.post("/search", response_model=List[SearchResult])
async def search(query: SearchQuery):
    """Search for relevant chunks"""
    rag_service = RAGService()
    results = rag_service.search(query.query, query.top_k, query.filters)
    
    return [
        SearchResult(
            chunk_id=r['id'],
            text=r['text'],
            source_filename=r['filename'],
            score=r['score'],
            metadata=r['metadata']
        )
        for r in results
    ]

@router.post("/chat", response_model=ChatResponse)
async def chat(query: ChatQuery):
    """Ask a question and get an AI-generated answer with citations"""
    rag_service = RAGService()
    answer, citations = rag_service.generate_answer(query.query, query.top_k)
    
    # Generate conversation ID if not provided
    conversation_id = query.conversation_id or str(uuid.uuid4())
    
    return ChatResponse(
        answer=answer,
        citations=citations,
        conversation_id=conversation_id
    )
