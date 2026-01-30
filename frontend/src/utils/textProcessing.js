import { CONFIG } from '../constants/config';

/**
 * Intelligent text chunking with sentence boundary awareness
 * @param {string} text - The text to chunk
 * @param {number} chunkSize - Maximum size of each chunk
 * @param {number} overlap - Overlap size between chunks
 * @returns {string[]} Array of text chunks
 */
export const chunkText = (text, chunkSize = CONFIG.CHUNK_SIZE, overlap = CONFIG.CHUNK_OVERLAP) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            // Keep overlap for context
            const words = currentChunk.split(' ');
            currentChunk = words.slice(-Math.floor(overlap / 5)).join(' ') + ' ' + sentence;
        } else {
            currentChunk += ' ' + sentence;
        }
    }

    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks;
};

/**
 * Cleans text by removing extra whitespace and special characters
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export const cleanText = (text) => {
    return text
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.,!?;:()\-'"]/g, '')
        .trim();
};
