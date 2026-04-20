import React from 'react';
import { Database, Brain } from 'lucide-react';

const ResultsDisplay = ({ relevantChunks, answer }) => {
    if (relevantChunks.length === 0 && !answer) return null;

    return (
        <div className="space-y-6">
            {/* Relevant Chunks */}
            {relevantChunks.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-400" />
                        Retrieved Context
                    </h3>
                    <div className="space-y-3">
                        {relevantChunks.map((chunk, idx) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-purple-400">
                                        📄 {chunk.source}
                                    </span>
                                    <span className="text-sm text-purple-300">
                                        Relevance: {(chunk.similarity * 100).toFixed(1)}%
                                    </span>
                                </div>
                                {chunk.concepts && chunk.concepts.length > 0 && (
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        {chunk.concepts.slice(0, 5).map((concept, i) => (
                                            <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                                                {concept}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-gray-300 text-sm leading-relaxed">{chunk.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Answer */}
            {answer && (
                <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        Generated Answer
                    </h3>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <p className="text-white leading-relaxed whitespace-pre-wrap">{answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsDisplay;
