import { useState, useCallback } from 'react';
import { addToVectorStore } from '../services/vectorService';

export const useVectorStore = () => {
    const [vectorStore, setVectorStore] = useState([]);

    const addVectors = useCallback((newVectors) => {
        setVectorStore(prev => addToVectorStore(prev, newVectors));
    }, []);

    const clearVectors = useCallback(() => {
        setVectorStore([]);
    }, []);

    return {
        vectorStore,
        addVectors,
        clearVectors
    };
};

export default useVectorStore;
