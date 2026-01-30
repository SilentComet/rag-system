import { useState } from 'react';
import { apiClient } from '../services/apiClient';

export default function useQuery() {
    const [query, setQuery] = useState('');
    const [relevantChunks, setRelevantChunks] = useState([]);
    const [answer, setAnswer] = useState('');
    const [isQuerying, setIsQuerying] = useState(false);
    const [queryStatus, setQueryStatus] = useState('');
    const [conversationId, setConversationId] = useState(null);

    const executeQuery = async () => {
        if (!query.trim()) {
            setQueryStatus('Please enter a query');
            return;
        }

        setIsQuerying(true);
        setQueryStatus('Searching...');
        setRelevantChunks([]);
        setAnswer('');

        try {
            // Call the chat endpoint which does retrieval + generation
            const response = await apiClient.chat(query, 5, conversationId);

            setAnswer(response.answer);
            setRelevantChunks(response.citations.map(citation => ({
                text: citation.text,
                source: citation.source_filename,
                score: citation.score
            })));
            setConversationId(response.conversation_id);
            setQueryStatus('Query completed');
        } catch (error) {
            setQueryStatus(`Query error: ${error.message}`);
            console.error('Query error:', error);
        } finally {
            setIsQuerying(false);
        }
    };

    const clearQuery = () => {
        setQuery('');
        setRelevantChunks([]);
        setAnswer('');
        setQueryStatus('');
        setConversationId(null);
    };

    return {
        query,
        setQuery,
        executeQuery,
        relevantChunks,
        answer,
        isQuerying,
        queryStatus,
        clearQuery
    };
}
