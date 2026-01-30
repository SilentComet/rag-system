import { cosineSimilarity } from '../utils/vectorMath';
import { CONFIG } from '../constants/config';

/**
 * Search the vector store for similar chunks
 * @param {object} queryEmbedding - The embedding of the query {vector, concepts}
 * @param {Array} vectorStore - The store of document chunks
 * @param {number} topK - Number of results to return
 * @returns {Array} Top K similar chunks
 */
export const searchVectorStore = (queryEmbedding, vectorStore, topK = CONFIG.TOP_K_RESULTS) => {
    if (!vectorStore || vectorStore.length === 0) return [];

    const similarities = vectorStore.map(item => ({
        ...item,
        similarity: cosineSimilarity(queryEmbedding.vector, item.embedding)
    }));

    return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
};

/**
 * Add chunks to the vector store (helper, mostly logic lives in hooks or components for state)
 * This is arguably more of a data structure helper.
 * @param {Array} currentStore 
 * @param {Array} newItems 
 * @returns {Array} New store
 */
export const addToVectorStore = (currentStore, newItems) => {
    return [...currentStore, ...newItems];
};
