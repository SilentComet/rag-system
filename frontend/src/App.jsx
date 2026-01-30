import { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import QueryInterface from './components/QueryInterface';
import ResultsDisplay from './components/ResultsDisplay';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

import useDocuments from './hooks/useDocuments';
import useQuery from './hooks/useQuery';
import useAuth from './hooks/useAuth';

function App() {
    const { user, login, register, logout, isAuthenticated } = useAuth();
    const [showLogin, setShowLogin] = useState(true);

    const {
        documents,
        uploadDocuments,
        clearDocuments,
        refreshDocuments,
        isProcessing,
        status: uploadStatus
    } = useDocuments();

    const {
        query,
        setQuery,
        executeQuery,
        relevantChunks,
        answer,
        isQuerying,
        queryStatus,
        clearQuery
    } = useQuery();

    // Refresh documents periodically
    useEffect(() => {
        if (isAuthenticated) {
            refreshDocuments();
            const interval = setInterval(refreshDocuments, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const handleUpload = async (files) => {
        await uploadDocuments(files);
    };

    const handleClearAll = () => {
        clearDocuments();
        clearQuery();
    };

    if (!isAuthenticated) {
        return (
            <Login
                onLogin={login}
                onRegister={register}
                showLogin={showLogin}
                setShowLogin={setShowLogin}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Dashboard user={user} onLogout={logout}>
                <div className="space-y-6">
                    <DocumentUpload
                        documents={documents}
                        onUpload={handleUpload}
                        onClear={handleClearAll}
                        isProcessing={isProcessing}
                        status={uploadStatus}
                    />

                    <QueryInterface
                        query={query}
                        setQuery={setQuery}
                        onSearch={executeQuery}
                        isQuerying={isQuerying}
                        hasDocuments={documents.length > 0}
                        status={queryStatus}
                    />

                    <ResultsDisplay
                        relevantChunks={relevantChunks}
                        answer={answer}
                    />
                </div>
            </Dashboard>
        </div>
    );
}

export default App;
