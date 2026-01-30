/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vec1 
 * @param {number[]} vec2 
 * @returns {number} Cosine similarity (-1 to 1)
 */
export const cosineSimilarity = (vec1, vec2) => {
    let dotProduct = 0;
    for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
    }
    return dotProduct;
};

/**
 * Calculate the magnitude of a vector
 * @param {number[]} vector 
 * @returns {number} Magnitude
 */
export const vectorMagnitude = (vector) => {
    return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
};

/**
 * Normalize a vector to unit length
 * @param {number[]} vector 
 * @returns {number[]} Normalized vector
 */
export const normalizeVector = (vector) => {
    const magnitude = vectorMagnitude(vector);
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
};

/**
 * Generate a basic vector from text (character frequency based)
 * @param {string} text 
 * @returns {number[]} Vector
 */
export const generateBasicVector = (text) => {
    const vector = new Array(100).fill(0);
    const normalized = text.toLowerCase();

    for (let i = 0; i < Math.min(normalized.length, 1000); i++) {
        const charCode = normalized.charCodeAt(i) % 100;
        vector[charCode] += 1;
    }

    return normalizeVector(vector);
};
