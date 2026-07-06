import { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Loader2, ExternalLink, RefreshCw, Wifi, WifiOff, Zap } from 'lucide-react';
import type { Project } from '../../services/projectsApi';
import { getProjectMessages } from '../../services/projectsApi';
import { getAccessToken } from '../../services/api';

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

type WsConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

// Step labels shown in the agent overlay
const AGENT_STEP_LABELS: Record<string, string> = {
  planning:  '🧠 Планирую задачи...',
  building:  '⚙️ Реализую изменения...',
  progress:  '📝 Вношу правки в код...',
  done:      '✅ Готово!',
  error:     '❌ Ошибка выполнения',
};

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.architeq.tech';
const WS_BASE = API_BASE.replace('https://', 'wss://').replace('http://', 'ws://');

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 15000]; // ms, exponential back-off

export function ProjectView({ project, initialPrompt, onBack }: ProjectViewProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(project.status);
  const [previewUrl, setPreviewUrl] = useState(project.url || `https://${project.subdomain}`);
  const [previewKey, setPreviewKey] = useState(0);
  const [isAgentWorking, setIsAgentWorking] = useState(false);
  const [agentStep, setAgentStep] = useState('');
  const [wsState, setWsState] = useState<WsConnectionState>('connecting');

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(true);
  const initialPromptSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── Message handler (stable ref) ───────────────────────────────────────────
  const handleWsMessage = useCallback((data: any) => {
    if (data.type === 'project_status') {
      setStatus(data.status);
      if (data.url) setPreviewUrl(data.url);
    }

    if (data.type === 'agent_thinking') {
      setIsAgentWorking(true);
      setAgentStep(data.message ?? AGENT_STEP_LABELS.planning);
      setMessages((prev) => [
        ...prev.filter((m) => !m.isThinking),
        { id: 'thinking', role: 'system', content: data.message, isThinking: true },
      ]);
    }

    if (data.type === 'agent_update') {
      const label = AGENT_STEP_LABELS[data.event] ?? data.message;
      setAgentStep(label);

      if (data.event === 'done') {
        setIsAgentWorking(false);
        setAgentStep('');
        setMessages((prev) => [
          ...prev.filter((m) => !m.isThinking),
          { id: `ai-${Date.now()}`, role: 'assistant', content: data.message },
        ]);
      } else if (data.event === 'reload_preview') {
        setPreviewKey((k) => k + 1);
        if (data.url) setPreviewUrl(data.url);
      } else if (data.event === 'error') {
        setIsAgentWorking(false);
        setAgentStep('');
        setMessages((prev) => [
          ...prev.filter((m) => !m.isThinking),
          { id: `err-${Date.now()}`, role: 'system', content: data.message },
        ]);
      } else {
        // planning / building / progress updates — animate the thinking bubble
        setMessages((prev) => [
          ...prev.filter((m) => !m.isThinking),
          { id: 'thinking', role: 'system', content: data.message, isThinking: true },
        ]);
      }
    }
  }, []);

  // ─── WebSocket connect with auto-reconnect ───────────────────────────────────
  const connect = useCallback(() => {
    if (!shouldReconnectRef.current) return;

    const token = getAccessToken();
    if (!token) {
      // No token — we'll retry after a short delay
      reconnectTimerRef.current = setTimeout(connect, 2000);
      return;
    }

    setWsState(reconnectAttemptRef.current === 0 ? 'connecting' : 'reconnecting');

    const ws = new WebSocket(`${WS_BASE}/ws/projects/${project.id}/?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsState('connected');
      reconnectAttemptRef.current = 0;

      // Send initial prompt exactly once after the first successful connection
      if (initialPrompt && !initialPromptSentRef.current) {
        initialPromptSentRef.current = true;
        ws.send(JSON.stringify({ type: 'chat_message', content: initialPrompt }));
        setIsAgentWorking(true);
        setAgentStep(AGENT_STEP_LABELS.planning);
      }
    };

    ws.onmessage = (e) => {
      try { handleWsMessage(JSON.parse(e.data)); } catch { /* ignore */ }
    };

    ws.onerror = () => {
      // onclose will fire right after; nothing to do here
    };

    ws.onclose = (e) => {
      wsRef.current = null;
      if (!shouldReconnectRef.current) return;

      // 4001 = unauthorized, 4004 = project not found — don't reconnect
      if (e.code === 4001 || e.code === 4004) {
        setWsState('disconnected');
        return;
      }

      setWsState('reconnecting');
      const delay = RECONNECT_DELAYS[Math.min(reconnectAttemptRef.current, RECONNECT_DELAYS.length - 1)];
      reconnectAttemptRef.current += 1;
      reconnectTimerRef.current = setTimeout(connect, delay);
    };
  }, [project.id, initialPrompt, handleWsMessage]);

  // ─── Boot ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    shouldReconnectRef.current = true;

    // Load chat history if not a fresh project
    if (initialPrompt) {
      setMessages([{ id: 'init-user', role: 'user', content: initialPrompt }]);
    } else {
      getProjectMessages(project.id).then((msgs) => {
        setMessages(msgs.map((m) => ({ id: m.id, role: m.role, content: m.content })));
      });
    }

    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [project.id]);

  // ─── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Send message ─────────────────────────────────────────────────────────────
  function sendMessage() {
    const content = input.trim();
    if (!content || isAgentWorking) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content }]);
    setInput('');
    wsRef.current.send(JSON.stringify({ type: 'chat_message', content }));
    setIsAgentWorking(true);
    setAgentStep(AGENT_STEP_LABELS.planning);
  }

  const isBuilding = status === 'creating' || status === 'building';
  const canSend = input.trim().length > 0 && !isAgentWorking && wsState === 'connected';

  // ─── Connection badge ─────────────────────────────────────────────────────────
  function ConnectionBadge() {
    if (wsState === 'connected') return null;
    const label =
      wsState === 'connecting'   ? 'Подключение...' :
      wsState === 'reconnecting' ? 'Переподключение...' : 'Нет соединения';
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-amber-400/80">
        {wsState === 'disconnected'
          ? <WifiOff className="w-3 h-3" />
          : <Loader2 className="w-3 h-3 animate-spin" />}
        {label}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* ── Left: Chat Panel ─────────────────────────────────────────────────── */}
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
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  status === 'live'  ? 'bg-emerald-500' :
                  status === 'error' ? 'bg-red-500' : 'bg-amber-400 animate-pulse'
                }`} />
                <span className="text-[11px] text-white/40 capitalize">{status}</span>
              </div>
              <ConnectionBadge />
            </div>
          </div>

          {/* WS indicator dot */}
          <div className="flex-shrink-0">
            {wsState === 'connected'
              ? <Wifi className="w-3.5 h-3.5 text-emerald-500/60" />
              : <WifiOff className="w-3.5 h-3.5 text-amber-400/60 animate-pulse" />}
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
              <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white/10 text-white rounded-br-sm'
                  : msg.role === 'assistant'
                  ? 'bg-[#1a1a1a] border border-white/5 text-white/90 rounded-bl-sm'
                  : 'bg-transparent text-white/40 italic text-xs'
              } ${msg.isThinking ? 'animate-pulse' : ''}`}>
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
              placeholder={isAgentWorking ? 'Агент работает, подожди...' : 'Что изменить?'}
              disabled={isAgentWorking || wsState !== 'connected'}
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
              disabled={!canSend}
              className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 transition-colors flex-shrink-0"
            >
              {isAgentWorking
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: Preview Panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#111111]">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
          <div className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/40 font-mono truncate">
            {previewUrl}
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

        {/* Preview + overlays */}
        <div className="flex-1 relative">

          {/* Initial build state */}
          {isBuilding && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#111111] gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-white/30" />
              <p className="text-white/40 text-sm">В процессе...</p>
              <p className="text-white/20 text-xs">Поднимаем контейнер и настраиваем SSL</p>
            </div>
          )}

          {/* Agent working overlay — semi-transparent, blocks interaction */}
          {!isBuilding && isAgentWorking && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] gap-5 pointer-events-all">
              {/* Animated ring */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full border-2 border-white/10 animate-ping" />
                <div className="absolute w-14 h-14 rounded-full border border-white/20 animate-pulse" />
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-white/80 text-sm font-medium">Агент работает</p>
                <p className="text-white/40 text-xs max-w-[200px] text-center leading-relaxed">
                  {agentStep || 'Обрабатываю запрос...'}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>

              <p className="text-white/20 text-[11px]">
                Предпросмотр обновится автоматически после завершения
              </p>
            </div>
          )}

          {/* The actual iframe (always mounted so scroll position is preserved) */}
          <iframe
            key={previewKey}
            ref={undefined}
            src={previewUrl}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
