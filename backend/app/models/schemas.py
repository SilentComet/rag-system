from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Request/Response Models
class DocumentUploadResponse(BaseModel):
    id: str
    filename: str
    status: str
    message: str

class SearchQuery(BaseModel):
    query: str
    top_k: int = 5
    filters: Optional[dict] = None

class ChatQuery(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    top_k: int = 5

class Citation(BaseModel):
    chunk_id: str
    text: str
    source_filename: str
    page_num: Optional[int] = None
    score: float

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    conversation_id: str

class DocumentStatus(BaseModel):
    id: str
    filename: str
    status: str  # PROCESSING, READY, FAILED
    created_at: datetime
    chunk_count: Optional[int] = None
    error: Optional[str] = None

class SearchResult(BaseModel):
    chunk_id: str
    text: str
    source_filename: str
    score: float
    metadata: dict
