import PyPDF2
import docx
from pathlib import Path
from typing import Optional

class DocumentProcessor:
    """Service for extracting text from various document formats"""
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """Extract text from a document based on file extension"""
        path = Path(file_path)
        extension = path.suffix.lower()
        
        if extension == '.pdf':
            return DocumentProcessor._extract_from_pdf(file_path)
        elif extension == '.docx':
            return DocumentProcessor._extract_from_docx(file_path)
        elif extension in ['.txt', '.md']:
            return DocumentProcessor._extract_from_text(file_path)
        else:
            raise ValueError(f"Unsupported file format: {extension}")
    
    @staticmethod
    def _extract_from_pdf(file_path: str) -> str:
        """Extract text from PDF"""
        text = []
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text.append(page.extract_text())
        return "\n\n".join(text)
    
    @staticmethod
    def _extract_from_docx(file_path: str) -> str:
        """Extract text from DOCX"""
        doc = docx.Document(file_path)
        return "\n\n".join([paragraph.text for paragraph in doc.paragraphs])
    
    @staticmethod
    def _extract_from_text(file_path: str) -> str:
        """Extract text from plain text files"""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
