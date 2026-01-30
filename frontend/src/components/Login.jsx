import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

export default function Login({ onLogin, onRegister, showLogin, setShowLogin }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = showLogin
            ? await onLogin(email, password)
            : await onRegister(email, username, password);

        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        RAG System
                    </h1>
                    <p className="text-purple-200">Production-Ready AI Search</p>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setShowLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-lg transition ${showLogin
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-purple-200 hover:bg-white/10'
                            }`}
                    >
                        <LogIn className="inline mr-2 h-4 w-4" />
                        Login
                    </button>
                    <button
                        onClick={() => setShowLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-lg transition ${!showLogin
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-purple-200 hover:bg-white/10'
                            }`}
                    >
                        <UserPlus className="inline mr-2 h-4 w-4" />
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-purple-200 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {!showLogin && (
                        <div>
                            <label className="block text-purple-200 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-purple-200 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : showLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
