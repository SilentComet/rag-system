import React from 'react';
import { Database, Trash2, FileText } from 'lucide-react';

const VectorStoreInfo = ({ documents, vectorStore, onClear }) => {
    if (documents.length === 0) return null;

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-300 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Vector Store ({vectorStore.length} chunks from {documents.length} documents)
                </h3>
                <button
                    onClick={onClear}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                </button>
            </div>
            <div className="space-y-2">
                {documents.map((doc, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
                        <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{doc.name}</p>
                            <p className="text-sm text-purple-300">
                                {(doc.size / 1024).toFixed(2)} KB • {doc.chunks} chunks • {new Date(doc.processedAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VectorStoreInfo;
