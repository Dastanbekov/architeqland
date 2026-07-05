import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PromptInput } from './components/chat/PromptInput';
import { AppPreview } from './components/preview/AppPreview';
import { Login } from './components/auth/Login';
import { apiFetch, getAccessToken } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  // Check auth state on mount by attempting a refresh
  useEffect(() => {
    const checkAuth = async () => {
      if (getAccessToken()) {
        setIsAuthenticated(true);
        return;
      }
      
      try {
        const response = await apiFetch('/api/apps/auth/refresh', { method: 'POST' });
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        // Silently fail, user needs to login
      }
    };
    checkAuth();
  }, []);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setStatus('Initializing Django orchestrator...');
    
    try {
      const response = await apiFetch(`/api/apps/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      
      setPreviewUrl(data.url);
      setStatus('Deployed successfully!');
    } catch (error) {
      console.error(error);
      setStatus('Error deploying application.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden font-sans">
      <Sidebar />
      <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
      <AppPreview url={previewUrl} isLoading={isLoading} status={status} />
    </div>
  );
}

export default App;
