import { extractText } from '../utils/fileExtraction';
import { cleanText, chunkText } from '../utils/textProcessing';
import { generateSemanticEmbedding } from './embeddingService';

/**
 * Process a single file: extract, clean, chunk, and embed.
 * @param {File} file 
 * @param {function} onProgress - Callback for progress updates
 * @returns {Promise<{vectors: Array, documentInfo: object}>}
 */
export const processDocument = async (file, onProgress = () => { }) => {
    try {
        // Extract
        onProgress(`Processing ${file.name}...`);
        const text = await extractText(file);

        // Clean
        const cleanedText = cleanText(text);

        if (cleanedText.length < 50) {
            throw new Error(`${file.name} contains insufficient text`);
        }

        // Chunk
        const chunks = chunkText(cleanedText);

        // Embed
        onProgress(`Generating embeddings for ${file.name}...`);
        const newVectors = [];

        for (let idx = 0; idx < chunks.length; idx++) {
            const embedding = await generateSemanticEmbedding(chunks[idx]);
            newVectors.push({
                id: `${file.name}-${idx}-${Date.now()}`,
                text: chunks[idx],
                embedding: embedding.vector,
                concepts: embedding.concepts,
                source: file.name
            });

            // Update progress periodically
            if ((idx + 1) % 3 === 0) {
                onProgress(`Processing ${file.name}: ${idx + 1}/${chunks.length} chunks...`);
            }
        }

        return {
            vectors: newVectors,
            documentInfo: {
                name: file.name,
                size: file.size,
                chunks: chunks.length,
                processedAt: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        throw error;
    }
};

/**
 * Process multiple files
 * @param {File[]} files 
 * @param {function} setStatus 
 * @returns {Promise<{allVectors: Array, allDocs: Array}>}
 */
export const processDocuments = async (files, setStatus) => {
    const allVectors = [];
    const allDocs = [];

    for (const file of files) {
        try {
            const { vectors, documentInfo } = await processDocument(file, setStatus);
            allVectors.push(...vectors);
            allDocs.push(documentInfo);
        } catch (error) {
            // We might want to continue processing other files even if one fails
            setStatus(`❌ Error processing ${file.name}: ${error.message}`);
            // Re-throw if we want to stop strictly? Or just log.
            // For now let's let the caller decide or just continue.
            console.error(error);
        }
    }

    return { allVectors, allDocs };
};
