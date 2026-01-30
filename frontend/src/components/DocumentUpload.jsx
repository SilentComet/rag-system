import React, { useRef } from 'react';
import { Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { UI_TEXT } from '../constants/config';
import VectorStoreInfo from './VectorStoreInfo';

const DocumentUpload = ({
    documents,
    onUpload,
    onClear,
    isProcessing,
    status,
    vectorStore
}) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        if (e.target.files?.length) {
            const files = Array.from(e.target.files);
            await onUpload(files);
            // Reset input so same files can be selected again if needed
            e.target.value = '';
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-6 h-6 text-purple-400" />
                Upload Documents
            </h2>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/60 transition-colors bg-white/5">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".txt,.md,.html,.pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 transition-all shadow-lg"
                >
                    {isProcessing ? (
                        <span className="flex items-center gap-2">
                            <Loader className="w-5 h-5 animate-spin" />
                            {UI_TEXT.PROCESSING}
                        </span>
                    ) : (
                        UI_TEXT.SELECT_FILES
                    )}
                </button>
                <p className="text-purple-300 mt-3">{UI_TEXT.SUPPORTED_FORMATS}</p>
            </div>

            {/* Status Bar */}
            {status && (
                <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center gap-3 text-purple-200">
                    {isProcessing ? (
                        <Loader className="w-5 h-5 animate-spin flex-shrink-0" />
                    ) : status.includes('Error') ? (
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                    ) : (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span>{status}</span>
                </div>
            )}

            <VectorStoreInfo
                documents={documents}
                vectorStore={vectorStore}
                onClear={onClear}
            />
        </div>
    );
};

export default DocumentUpload;
