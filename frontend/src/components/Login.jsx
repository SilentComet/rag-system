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
        <div className="min-h-screen bg-transparent relative z-10 text-white flex items-center justify-center p-6">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-10 w-full max-w-md border border-white/10 transition-all duration-1000 ease-aristide hover:border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        RAG System
                    </h1>
                    <p className="text-purple-200">Production-Ready AI Search</p>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setShowLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-xl transition-all duration-700 ease-aristide hover:-translate-y-0.5 ${showLogin
                                ? 'bg-white/10 text-white shadow-lg border border-white/20'
                                : 'bg-transparent text-purple-300 hover:text-white'
                            }`}
                    >
                        <LogIn className="inline mr-2 h-4 w-4" />
                        Login
                    </button>
                    <button
                        onClick={() => setShowLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-xl transition-all duration-700 ease-aristide hover:-translate-y-0.5 ${!showLogin
                                ? 'bg-white/10 text-white shadow-lg border border-white/20'
                                : 'bg-transparent text-purple-300 hover:text-white'
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
                            className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all duration-700 ease-aristide"
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
                                className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all duration-700 ease-aristide"
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
                            className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all duration-700 ease-aristide"
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
                        className="w-full py-4 px-4 mt-4 bg-white/5 backdrop-blur-md text-white rounded-xl font-medium tracking-wide border border-white/10 hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-700 ease-aristide disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {loading ? 'Please wait...' : showLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
