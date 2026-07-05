import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PromptInput } from './components/chat/PromptInput';
import { AppPreview } from './components/preview/AppPreview';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setStatus('Initializing Django orchestrator...');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/apps/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

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

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden font-sans">
      <Sidebar />
      <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
      <AppPreview url={previewUrl} isLoading={isLoading} status={status} />
    </div>
  );
}

export default App;
