import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PromptInput } from './components/chat/PromptInput';
import { ProjectView } from './components/project/ProjectView';
import { Login } from './components/auth/Login';
import { apiFetch, getAccessToken } from './services/api';
import type { Project } from './services/projectsApi';
import { listProjects, createProject } from './services/projectsApi';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (getAccessToken()) {
        setIsAuthenticated(true);
        return;
      }
      try {
        const response = await apiFetch('/api/apps/auth/refresh', { method: 'POST' });
        if (response.ok) setIsAuthenticated(true);
      } catch {
        // user needs to login
      }
    };
    checkAuth();
  }, []);

  // Load projects after auth
  useEffect(() => {
    if (!isAuthenticated) return;
    listProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, [isAuthenticated]);

  const handleNewProject = async (prompt: string) => {
    setIsCreating(true);
    try {
      const project = await createProject(prompt);
      setProjects((prev) => [project, ...prev]);
      setActiveProject(project);
    } catch (e) {
      console.error('Failed to create project:', e);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // If a project is open, show ProjectView (full screen, no sidebar)
  if (activeProject) {
    return (
      <ProjectView
        project={activeProject}
        onBack={() => setActiveProject(null)}
      />
    );
  }

  // Default: home screen with project list
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar onProjectSelect={setActiveProject} projects={projects} />
      <PromptInput onGenerate={handleNewProject} isLoading={isCreating} />
    </div>
  );
}

export default App;
