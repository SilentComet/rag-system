export const CONFIG = {
    CHUNK_SIZE: 800,
    CHUNK_OVERLAP: 200,
    TOP_K_RESULTS: 5,
    CLAUDE_MODEL: 'claude-sonnet-4-20250514',
    MAX_TOKENS: 1500,
    VECTOR_DIMENSION: 100,
    SUPPORTED_FILE_TYPES: ['.txt', '.md', '.html', '.pdf', '.docx'],
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

export const API_CONFIG = {
    CLAUDE_API_URL: 'https://api.anthropic.com/v1/messages',
};

export const UI_TEXT = {
    UPLOAD_PROMPT: 'Select Files',
    SEARCH_PLACEHOLDER: 'What would you like to know from your documents?',
    PROCESSING: 'Processing...',
    SELECT_FILES: 'Select Files',
    SUPPORTED_FORMATS: 'Supports TXT, MD, HTML, PDF, DOCX',
    CLEAR_ALL: 'Clear All',
    SEARCH_BUTTON: 'Search',
    SEARCHING: 'Searching',
    NO_DOCS_WARNING: 'Please upload documents to enable search',
    RETRIEVED_CONTEXT: 'Retrieved Context',
    GENERATED_ANSWER: 'Generated Answer',
};
