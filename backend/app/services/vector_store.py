from typing import List, Dict, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
import uuid
from app.core.config import settings

class VectorStoreService:
    """Service for managing vector storage in Qdrant"""
    
    def __init__(self):
        self.client = QdrantClient(url=settings.QDRANT_URL)
        self.collection_name = "documents"
        self._ensure_collection()
    
    def _ensure_collection(self):
        """Create collection if it doesn't exist"""
        collections = self.client.get_collections().collections
        if not any(col.name == self.collection_name for col in collections):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
            )
    
    def upsert_chunks(self, chunks: List[Dict], embeddings: List[List[float]], doc_id: str, filename: str):
        """Insert or update chunks with their embeddings"""
        points = []
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point_id = str(uuid.uuid4())
            points.append(
                PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload={
                        "text": chunk["text"],
                        "doc_id": doc_id,
                        "filename": filename,
                        "chunk_index": chunk.get("chunk_index", idx)
                    }
                )
            )
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        
        return len(points)
    
    def search(self, query_vector: List[float], top_k: int = 5, filters: Optional[Dict] = None) -> List[Dict]:
        """Search for similar vectors"""
        search_params = {
            "collection_name": self.collection_name,
            "query_vector": query_vector,
            "limit": top_k
        }
        
        if filters:
            # Build Qdrant filters if needed
            if "doc_id" in filters:
                search_params["query_filter"] = Filter(
                    must=[FieldCondition(key="doc_id", match=MatchValue(value=filters["doc_id"]))]
                )
        
        results = self.client.search(**search_params)
        
        return [
            {
                "id": str(result.id),
                "text": result.payload["text"],
                "filename": result.payload["filename"],
                "score": result.score,
                "metadata": result.payload
            }
            for result in results
        ]
    
    def delete_by_doc_id(self, doc_id: str):
        """Delete all chunks for a document"""
        self.client.delete(
            collection_name=self.collection_name,
            points_selector=Filter(
                must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
            )
        )
