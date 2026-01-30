import { useState } from 'react';
import { apiClient } from '../services/apiClient';

export default function useDocuments() {
    const [documents, setDocuments] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');

    const uploadDocuments = async (files) => {
        setIsProcessing(true);
        setStatus('Uploading documents...');

        try {
            const uploadPromises = Array.from(files).map(file =>
                apiClient.uploadDocument(file)
            );

            const results = await Promise.all(uploadPromises);

            setStatus(`Successfully uploaded ${results.length} document(s)`);

            // Refresh document list
            await refreshDocuments();

            return results;
        } catch (error) {
            setStatus(`Upload error: ${error.message}`);
            console.error('Upload error:', error);
            return [];
        } finally {
            setIsProcessing(false);
        }
    };

    const refreshDocuments = async () => {
        try {
            const docs = await apiClient.listDocuments();
            setDocuments(docs);
        } catch (error) {
            console.error('Error refreshing documents:', error);
        }
    };

    const clearDocuments = async () => {
        try {
            await Promise.all(
                documents.map(doc => apiClient.deleteDocument(doc.id))
            );
            setDocuments([]);
            setStatus('All documents cleared');
        } catch (error) {
            setStatus(`Error clearing documents: ${error.message}`);
        }
    };

    return {
        documents,
        uploadDocuments,
        clearDocuments,
        refreshDocuments,
        isProcessing,
        status
    };
}
