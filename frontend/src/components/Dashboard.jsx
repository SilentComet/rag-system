import { LogOut, User, FileText } from 'lucide-react';

export default function Dashboard({ user, onLogout, children }) {
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.2)] p-6 mb-6 border border-white/5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-1">
                                RAG System
                            </h1>
                            <p className="text-purple-200">
                                Production-Ready Retrieval-Augmented Generation
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="flex items-center text-purple-200">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{user?.email || 'User'}</span>
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition border border-red-500/50"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white/5 backdrop-blur-lg rounded-lg shadow-2xl p-8 border border-white/10">
                    {children}
                </div>

                {/* Footer Stats */}
                <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-center gap-2 text-purple-200 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>Secure • Scalable • Production-Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
