import { useState } from 'react';
import { apiFetch, setAccessToken } from '../../services/api';
import { Lock, User } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiFetch('/api/apps/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      setAccessToken(data.access);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 font-sans text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-[#2a2a35] bg-[#1a1a24] p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
            <Lock className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
            ArchiteqLand
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access the orchestrator
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                required
                className="block w-full rounded-lg border border-[#2a2a35] bg-[#0a0a0f] py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                className="block w-full rounded-lg border border-[#2a2a35] bg-[#0a0a0f] py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a24] disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
