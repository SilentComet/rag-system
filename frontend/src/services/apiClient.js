// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = {
    async uploadDocument(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return response.json();
    },

    async listDocuments() {
        const response = await fetch(`${API_BASE_URL}/api/v1/documents`);

        if (!response.ok) {
            throw new Error(`Failed to fetch documents: ${response.statusText}`);
        }

        return response.json();
    },

    async deleteDocument(docId) {
        const response = await fetch(`${API_BASE_URL}/api/v1/documents/${docId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.statusText}`);
        }

        return response.json();
    },

    async search(query, topK = 5) {
        const response = await fetch(`${API_BASE_URL}/api/v1/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, top_k: topK }),
        });

        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }

        return response.json();
    },

    async chat(query, topK = 5, conversationId = null) {
        const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, top_k: topK, conversation_id: conversationId }),
        });

        if (!response.ok) {
            throw new Error(`Chat failed: ${response.statusText}`);
        }

        return response.json();
    },
};
