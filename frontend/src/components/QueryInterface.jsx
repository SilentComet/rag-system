import React from 'react';
import { Search, Loader, Brain, AlertCircle } from 'lucide-react';
import { UI_TEXT } from '../constants/config';

const QueryInterface = ({
    query,
    setQuery,
    onSearch,
    isQuerying,
    hasDocuments,
    status
}) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-6 h-6 text-purple-400" />
                Ask a Question
            </h2>

            <div className="flex gap-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                    placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
                    disabled={!hasDocuments}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300"
                />
                <button
                    onClick={onSearch}
                    disabled={!query.trim() || !hasDocuments || isQuerying}
                    className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/20 disabled:opacity-50 transition-all duration-500 ease-aristide shadow-md flex items-center gap-2"
                >
                    {isQuerying ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            {UI_TEXT.SEARCHING}
                        </>
                    ) : (
                        <>
                            <Brain className="w-5 h-5" />
                            {UI_TEXT.SEARCH_BUTTON}
                        </>
                    )}
                </button>
            </div>

            {!hasDocuments && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-200">{UI_TEXT.NO_DOCS_WARNING}</span>
                </div>
            )}

            {/* Query Status */}
            {isQuerying && status && (
                <div className="mt-2 text-sm text-purple-300">
                    {status}
                </div>
            )}
        </div>
    );
};

export default QueryInterface;
