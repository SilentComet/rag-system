import DocumentUpload from './components/DocumentUpload';
import QueryInterface from './components/QueryInterface';
import ResultsDisplay from './components/ResultsDisplay';

import useDocuments from './hooks/useDocuments';
import useVectorStore from './hooks/useVectorStore';
import useQuery from './hooks/useQuery';

function App() {
    const {
        documents,
        uploadDocuments,
        clearDocuments,
        isProcessing,
        status: uploadStatus
    } = useDocuments();

    const {
        vectorStore,
        addVectors,
        clearVectors
    } = useVectorStore();

    const {
        query,
        setQuery,
        executeQuery,
        relevantChunks,
        answer,
        isQuerying,
        queryStatus,
        clearQuery
    } = useQuery(vectorStore);

    // Handle document upload and vector store update
    const handleUpload = async (files) => {
        const processedVectors = await uploadDocuments(files);
        if (processedVectors.length > 0) {
            addVectors(processedVectors);
        }
    };

    const handleClearAll = () => {
        clearDocuments();
        clearVectors();
        clearQuery();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-lg shadow-2xl p-8 mb-6 border border-purple-500/20">
                    <h1 className="text-5xl font-bold text-white mb-2">RAG System</h1>
                    <p className="text-purple-200">Production-Ready Retrieval-Augmented Generation</p>
                </div>

                {/* Main Content */}
                <div className="bg-white/5 backdrop-blur-lg rounded-lg shadow-2xl p-8 border border-white/10">

                    <DocumentUpload
                        documents={documents}
                        onUpload={handleUpload}
                        onClear={handleClearAll}
                        isProcessing={isProcessing}
                        status={uploadStatus}
                        vectorStore={vectorStore}
                    />

                    <QueryInterface
                        query={query}
                        setQuery={setQuery}
                        onSearch={executeQuery}
                        isQuerying={isQuerying}
                        hasDocuments={vectorStore.length > 0}
                        status={queryStatus}
                    />

                    <ResultsDisplay
                        relevantChunks={relevantChunks}
                        answer={answer}
                    />
                </div>

                {/* Production Architecture Guide */}
            </div>
        </div>
    );
}

export default App;
