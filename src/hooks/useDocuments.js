import { useState, useCallback } from 'react';
import { processDocuments } from '../services/documentService';

export const useDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');

    const uploadDocuments = useCallback(async (files) => {
        setIsProcessing(true);
        setStatus('Processing documents...');

        try {
            const { allVectors, allDocs } = await processDocuments(files, setStatus);

            setDocuments(prev => [...prev, ...allDocs]);
            setStatus(`✅ Successfully processed ${files.length} document(s)`);

            return allVectors;
        } catch (error) {
            setStatus(`❌ Error: ${error.message}`);
            return [];
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const clearDocuments = useCallback(() => {
        setDocuments([]);
        setStatus('');
        setIsProcessing(false);
    }, []);

    return {
        documents,
        isProcessing,
        status,
        uploadDocuments,
        clearDocuments
    };
};

export default useDocuments;
