from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter

class ChunkingService:
    """Service for splitting documents into chunks"""
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""]
        )
    
    def chunk_text(self, text: str) -> List[str]:
        """Split text into chunks"""
        return self.splitter.split_text(text)
    
    def chunk_with_metadata(self, text: str, source: str) -> List[dict]:
        """Split text and return chunks with metadata"""
        chunks = self.chunk_text(text)
        return [
            {
                "text": chunk,
                "source": source,
                "chunk_index": idx
            }
            for idx, chunk in enumerate(chunks)
        ]
