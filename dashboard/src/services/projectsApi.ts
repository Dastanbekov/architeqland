import { getAccessToken } from './api';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.architeq.tech';
const WS_BASE = API_BASE.replace('https://', 'wss://').replace('http://', 'ws://');

export interface Project {
  id: string;
  name: string;
  display_name: string;
  subdomain: string;
  url: string;
  status: 'creating' | 'building' | 'live' | 'error';
  github_repo_url: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export async function createProject(prompt: string): Promise<Project> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/api/apps/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`Failed to create project: ${res.statusText}`);
  return res.json();
}

export async function listProjects(): Promise<Project[]> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/api/apps/projects`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json();
}

export async function getProjectMessages(projectId: string): Promise<ChatMessage[]> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/api/apps/projects/${projectId}/messages`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export function connectProjectWebSocket(
  projectId: string,
  onMessage: (data: any) => void,
): WebSocket {
  const token = getAccessToken();
  const ws = new WebSocket(`${WS_BASE}/ws/projects/${projectId}/?token=${token}`);
  ws.onmessage = (e) => {
    try {
      onMessage(JSON.parse(e.data));
    } catch {
      // ignore parse errors
    }
  };
  return ws;
}
