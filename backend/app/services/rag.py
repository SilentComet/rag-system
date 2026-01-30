from typing import List, Optional
from openai import OpenAI
from app.core.config import settings
from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStoreService
from app.models.schemas import Citation

class RAGService:
    """Service for orchestrating RAG pipeline: retrieval + generation"""
    
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_store = VectorStoreService()
        self.llm_client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def search(self, query: str, top_k: int = 5, filters: Optional[dict] = None) -> List[dict]:
        """Perform semantic search"""
        # Generate query embedding
        query_embedding = self.embedding_service.embed_text(query)
        
        # Search vector store
        results = self.vector_store.search(query_embedding, top_k, filters)
        
        return results
    
    def generate_answer(self, query: str, top_k: int = 5) -> tuple[str, List[Citation]]:
        """Generate answer using RAG: retrieve + generate"""
        # Retrieve relevant chunks
        search_results = self.search(query, top_k)
        
        if not search_results:
            return "I don't have enough information to answer that question.", []
        
        # Build context from retrieved chunks
        context_parts = []
        citations = []
        
        for idx, result in enumerate(search_results, 1):
            context_parts.append(f"[{idx}] {result['text']}")
            citations.append(Citation(
                chunk_id=result['id'],
                text=result['text'],
                source_filename=result['filename'],
                score=result['score']
            ))
        
        context = "\n\n".join(context_parts)
        
        # Generate answer using LLM
        system_prompt = """You are a helpful assistant that answers questions based on the provided context.
Use ONLY the information from the context to answer. If the context doesn't contain enough information, say so.
When referencing information, cite the source using [number] notation."""
        
        user_prompt = f"""Context:
{context}

Question: {query}

Please provide a comprehensive answer based on the context above."""
        
        response = self.llm_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        answer = response.choices[0].message.content
        
        return answer, citations
