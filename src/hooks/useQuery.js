import { useState, useCallback } from 'react';
import { generateSemanticEmbedding } from '../services/embeddingService';
import { searchVectorStore } from '../services/vectorService';
import { generateAnswer } from '../services/claudeService';

export const useQuery = (vectorStore) => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [relevantChunks, setRelevantChunks] = useState([]);
    const [isQuerying, setIsQuerying] = useState(false);
    const [queryStatus, setQueryStatus] = useState('');

    const executeQuery = useCallback(async () => {
        if (!query.trim() || vectorStore.length === 0) return;

        setIsQuerying(true);
        setAnswer('');
        setRelevantChunks([]);
        setQueryStatus('Starting query...');

        try {
            setQueryStatus('Generating query embedding...');
            // Generate semantic embedding for query
            const queryEmbedding = await generateSemanticEmbedding(query);

            setQueryStatus('Searching vector store...');
            // Find similar chunks
            const topChunks = searchVectorStore(queryEmbedding, vectorStore);
            setRelevantChunks(topChunks);

            // Create rich context
            const context = topChunks
                .map((chunk, idx) => `[Source ${idx + 1}: ${chunk.source}]\n${chunk.text}`)
                .join('\n\n---\n\n');

            setQueryStatus('Generating answer with Claude...');
            // Generate answer
            const answerText = await generateAnswer(context, query);

            setAnswer(answerText);
            setQueryStatus('✅ Answer generated');
        } catch (error) {
            setAnswer(`❌ Error generating answer: ${error.message}`);
            setQueryStatus('Error occurred');
        } finally {
            setIsQuerying(false);
        }
    }, [query, vectorStore]);

    const clearQuery = useCallback(() => {
        setQuery('');
        setAnswer('');
        setRelevantChunks([]);
        setQueryStatus('');
    }, []);

    return {
        query,
        setQuery,
        answer,
        relevantChunks,
        isQuerying,
        queryStatus,
        executeQuery,
        clearQuery
    };
};

export default useQuery;
