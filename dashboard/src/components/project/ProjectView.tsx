import { useEffect, useRef, useState } from 'react';
import { Send, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import type { Project } from '../../services/projectsApi';
import { getProjectMessages, connectProjectWebSocket } from '../../services/projectsApi';

interface ProjectViewProps {
  project: Project;
  initialPrompt?: string;
  onBack: () => void;
}

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isThinking?: boolean;
}

export function ProjectView({ project, initialPrompt, onBack }: ProjectViewProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(project.status);
  const [previewUrl, setPreviewUrl] = useState(project.url);
  const [previewKey, setPreviewKey] = useState(0);
  const [isAgentWorking, setIsAgentWorking] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load history and connect WebSocket
  useEffect(() => {
    // Show initial prompt immediately as first message
    if (initialPrompt) {
      setMessages([{ id: 'init-user', role: 'user', content: initialPrompt }]);
      setIsAgentWorking(true);
    } else {
      getProjectMessages(project.id).then((msgs) => {
        setMessages(msgs.map((m) => ({ id: m.id, role: m.role, content: m.content })));
      });
    }

    const ws = connectProjectWebSocket(project.id, handleWsMessage);
    wsRef.current = ws;

    return () => { ws.close(); };
  }, [project.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleWsMessage(data: any) {
    if (data.type === 'project_status') {
      setStatus(data.status);
      if (data.url) setPreviewUrl(data.url);
    }

    if (data.type === 'agent_thinking') {
      setIsAgentWorking(true);
      setMessages((prev) => [
        ...prev.filter((m) => !m.isThinking),
        { id: 'thinking', role: 'system', content: data.message, isThinking: true },
      ]);
    }

    if (data.type === 'agent_update') {
      if (data.event === 'done') {
        setIsAgentWorking(false);
        setMessages((prev) => [
          ...prev.filter((m) => !m.isThinking),
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.message,
          },
        ]);
      } else if (data.event === 'reload_preview') {
        setPreviewKey((k) => k + 1);
        if (data.url) setPreviewUrl(data.url);
      } else if (data.event === 'error') {
        setIsAgentWorking(false);
        setMessages((prev) => [
          ...prev.filter((m) => !m.isThinking),
          { id: `err-${Date.now()}`, role: 'system', content: data.message },
        ]);
      } else {
        // Progress update — update the thinking bubble
        setMessages((prev) => [
          ...prev.filter((m) => !m.isThinking),
          { id: 'thinking', role: 'system', content: data.message, isThinking: true },
        ]);
      }
    }
  }

  function sendMessage() {
    const content = input.trim();
    if (!content || isAgentWorking || !wsRef.current) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content }]);
    setInput('');

    wsRef.current.send(JSON.stringify({ type: 'chat_message', content }));
  }

  const isBuilding = status === 'creating' || status === 'building';

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* ── Left: Chat Panel ── */}
      <div className="w-[420px] flex-shrink-0 border-r border-white/5 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <button
            onClick={onBack}
            className="text-white/40 hover:text-white transition-colors text-sm"
          >
            ← Apps
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{project.display_name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status === 'live' ? 'bg-emerald-500' :
                  status === 'error' ? 'bg-red-500' : 'bg-amber-400 animate-pulse'
                }`}
              />
              <span className="text-[11px] text-white/40 capitalize">{status}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isAgentWorking && (
            <div className="text-center py-12 text-white/30 text-sm">
              Напиши что хочешь изменить в приложении
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white/10 text-white rounded-br-sm'
                    : msg.role === 'assistant'
                    ? 'bg-[#1a1a1a] border border-white/5 text-white/90 rounded-bl-sm'
                    : 'bg-transparent text-white/40 italic text-xs'
                } ${msg.isThinking ? 'animate-pulse' : ''}`}
              >
                {msg.isThinking && (
                  <Loader2 className="w-3 h-3 inline mr-1.5 animate-spin opacity-60" />
                )}
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Что изменить?"
              disabled={isAgentWorking}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none disabled:opacity-40 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isAgentWorking}
              className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 transition-colors flex-shrink-0"
            >
              {isAgentWorking
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: Preview Panel ── */}
      <div className="flex-1 flex flex-col bg-[#111111]">
        {/* Preview toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
          <div className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/40 font-mono truncate">
            {previewUrl || `https://${project.subdomain}`}
          </div>
          <button
            onClick={() => setPreviewKey((k) => k + 1)}
            className="p-1.5 text-white/40 hover:text-white transition-colors"
            title="Обновить"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-white/40 hover:text-white transition-colors"
            title="Открыть в новой вкладке"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Preview */}
        <div className="flex-1 relative">
          {isBuilding ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111111] gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-white/30" />
              <p className="text-white/40 text-sm">В процессе...</p>
              <p className="text-white/20 text-xs">Поднимаем контейнер и настраиваем SSL</p>
            </div>
          ) : (
            <iframe
              key={previewKey}
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title="Preview"
              allow="same-origin"
            />
          )}
        </div>
      </div>
    </div>
  );
}
