import { CONFIG, API_CONFIG } from '../constants/config';

/**
 * Call Claude to generate semantic concepts or answer questions
 * @param {object} payload - The request body
 * @returns {Promise<object>} The API response
 */
const callClaudeAPI = async (payload) => {
    const response = await fetch(API_CONFIG.CLAUDE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Note: In a real app, you would add authentication headers here 
            // or proxy this through your backend
            'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API call failed with status ${response.status}`);
    }

    return await response.json();
};

/**
 * Extract semantic concepts from text using Claude
 * @param {string} text - Text to analyze
 * @returns {Promise<string[]>} Array of concepts
 */
export const extractConcepts = async (text) => {
    try {
        const response = await fetch(API_CONFIG.CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // In production, use a backend proxy!
            },
            body: JSON.stringify({
                model: CONFIG.CLAUDE_MODEL,
                max_tokens: 500,
                messages: [{
                    role: 'user',
                    content: `Extract 10 key semantic concepts from this text as a JSON array of strings. Focus on technical terms, main topics, and important entities. Return ONLY valid JSON with no other text.

Text: ${text.substring(0, 1000)}

Format: ["concept1", "concept2", ...]`
                }]
            })
        });

        const data = await response.json();
        const content = data.content?.find(item => item.type === 'text')?.text || '[]';

        // Clean and parse JSON
        const cleaned = content.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Concept extraction error:', error);
        return [];
    }
};

/**
 * Generate an answer based on context
 * @param {string} context - Retrieved context
 * @param {string} query - User question
 * @returns {Promise<string>} Generated answer
 */
export const generateAnswer = async (context, query) => {
    try {
        const response = await fetch(API_CONFIG.CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: CONFIG.CLAUDE_MODEL,
                max_tokens: CONFIG.MAX_TOKENS,
                messages: [{
                    role: 'user',
                    content: `You are a helpful assistant answering questions based on provided documentation. Use the context below to answer the question. If the answer is not in the context, say so clearly. Cite sources when possible.

Context from documents:
${context}

Question: ${query}

Provide a clear, accurate answer based on the context above.`
                }]
            })
        });

        const data = await response.json();
        return data.content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('');
    } catch (error) {
        console.error('Answer generation error:', error);
        throw new Error('Failed to generate answer from Claude');
    }
};
