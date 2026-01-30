import { extractConcepts } from './claudeService';
import { generateBasicVector, normalizeVector } from '../utils/vectorMath';

/**
 * Generate a vector from semantic concepts
 * @param {string[]} concepts 
 * @param {string} text 
 * @returns {number[]} Vector
 */
export const generateVectorFromConcepts = (concepts, text) => {
    const vector = new Array(100).fill(0);

    // Character frequency (base layer)
    const normalized = text.toLowerCase();
    for (let i = 0; i < Math.min(normalized.length, 1000); i++) {
        const charCode = normalized.charCodeAt(i) % 100;
        vector[charCode] += 1;
    }

    // Concept boost
    if (concepts && Array.isArray(concepts)) {
        concepts.forEach((concept, idx) => {
            if (typeof concept === 'string') {
                const position = (concept.toLowerCase().charCodeAt(0) + idx) % 100;
                vector[position] += 5;
            }
        });
    }

    return normalizeVector(vector);
};

/**
 * Generate a semantic embedding (simulated)
 * @param {string} text 
 * @returns {Promise<{vector: number[], concepts: string[]}>}
 */
export const generateSemanticEmbedding = async (text) => {
    try {
        const concepts = await extractConcepts(text);
        return {
            concepts,
            vector: generateVectorFromConcepts(concepts, text)
        };
    } catch (error) {
        console.error('Embedding error:', error);
        // Fallback to basic vector
        return {
            concepts: [],
            vector: generateBasicVector(text)
        };
    }
};
