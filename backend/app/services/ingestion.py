from typing import List, Optional
import uuid
import os
from pathlib import Path
from app.services.document_processor import DocumentProcessor
from app.services.chunking import ChunkingService
from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStoreService
from app.models.database import Document, ProcessingStatus, get_session

class IngestionService:
    """Service for orchestrating document ingestion pipeline"""
    
    def __init__(self):
        self.processor = DocumentProcessor()
        self.chunker = ChunkingService()
        self.embedding_service = EmbeddingService()
        self.vector_store = VectorStoreService()
    
    async def ingest_document(self, file_path: str, filename: str, doc_id: str):
        """Full ingestion pipeline: extract -> chunk -> embed -> index"""
        db = get_session()
        
        try:
            # Extract text
            text = self.processor.extract_text(file_path)
            
            if not text.strip():
                raise ValueError("No text extracted from document")
            
            # Chunk text
            chunks_with_metadata = self.chunker.chunk_with_metadata(text, filename)
            
            # Generate embeddings
            chunk_texts = [chunk["text"] for chunk in chunks_with_metadata]
            embeddings = self.embedding_service.embed_batch(chunk_texts)
            
            # Index in vector store
            num_chunks = self.vector_store.upsert_chunks(
                chunks_with_metadata,
                embeddings,
                doc_id,
                filename
            )
            
            # Update document status
            doc = db.query(Document).filter(Document.id == doc_id).first()
            if doc:
                doc.status = ProcessingStatus.READY
                doc.chunk_count = num_chunks
                db.commit()
            
            return num_chunks
            
        except Exception as e:
            # Mark as failed
            doc = db.query(Document).filter(Document.id == doc_id).first()
            if doc:
                doc.status = ProcessingStatus.FAILED
                doc.error = str(e)
                db.commit()
            raise
        finally:
            db.close()
