"""
Executor Agent — runs Aider CLI with DeepSeek V3 Pro to implement each task.
After each task: builds the Docker container, checks logs for errors,
auto-fixes if needed, then pushes to GitHub.
"""
import asyncio
import logging
import os
import subprocess
from typing import Callable, List, Optional
from django.conf import settings
from .planner_agent import Task

logger = logging.getLogger(__name__)

AIDER_SYSTEM_PROMPT = """You are an expert full-stack engineer implementing features in a Django + Next.js project.
- Write clean, production-quality code
- Follow Django best practices for the backend
- Follow Next.js App Router conventions for the frontend
- Always handle errors gracefully
- Add necessary imports
- Do not remove existing functionality unless explicitly asked
"""


class ExecutorAgent:
    def __init__(self):
        self.sandbox_base = settings.SANDBOX_BASE_DIR

    def _repo_path(self, project_id: str) -> str:
        return os.path.join(self.sandbox_base, project_id)

    async def execute(
        self,
        project_id: str,
        tasks: List[Task],
        on_progress: Optional[Callable] = None,
    ) -> List[dict]:
        """
        Execute each task in order using Aider.
        After all tasks: build + health check + push to GitHub.
        Returns a list of result dicts.
        """
        repo_path = self._repo_path(project_id)
        results = []

        for task in tasks:
            if on_progress:
                coro = on_progress(f"🔨 [{task.id}/{len(tasks)}] {task.title}")
                if asyncio.iscoroutine(coro):
                    await coro

            result = await self._run_aider_task(task, repo_path)
            results.append(result)

            if not result["success"]:
                # Try to auto-fix using build logs
                if on_progress:
                    coro = on_progress(f"🔧 Обнаружена ошибка, исправляю...")
                    if asyncio.iscoroutine(coro):
                        await coro
                fix_result = await self._auto_fix(task, repo_path, result.get("error", ""))
                results.append(fix_result)

        # Build the sandbox Docker container
        if on_progress:
            coro = on_progress("🐳 Собираю Docker образ...")
            if asyncio.iscoroutine(coro):
                await coro

        build_ok, build_logs = await self._docker_build(project_id, repo_path)

        if not build_ok:
            # Feed build errors back to Aider for a fix attempt
            if on_progress:
                coro = on_progress("🔧 Ошибка сборки, исправляю...")
                if asyncio.iscoroutine(coro):
                    await coro
            await self._aider_fix_build_error(repo_path, build_logs)
            build_ok, build_logs = await self._docker_build(project_id, repo_path)

        # Push to GitHub
        if on_progress:
            coro = on_progress("📤 Пушу изменения в GitHub...")
            if asyncio.iscoroutine(coro):
                await coro
        await self._git_push(repo_path)

        return results

    async def _run_aider_task(self, task: Task, repo_path: str) -> dict:
        """Run a single task through Aider CLI."""
        try:
            message = f"{task.title}\n\n{task.description}"

            cmd = [
                "aider",
                "--model", "deepseek/deepseek-v4-pro",
                "--yes-always",
                "--no-auto-commits",
                "--no-stream",
                "--chat-history-file", "/dev/null",
                "--message", message,
            ]

            # Add specific files if provided
            if task.files:
                cmd.extend(task.files)

            proc = await asyncio.create_subprocess_exec(
                *cmd,
                cwd=repo_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env={
                    **os.environ, 
                    "OPENAI_API_KEY": settings.DEEPSEEK_API_KEY,
                    "OPENAI_API_BASE": settings.DEEPSEEK_BASE_URL,
                },
            )
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=300)

            success = proc.returncode == 0
            return {
                "task_id": task.id,
                "title": task.title,
                "success": success,
                "output": stdout.decode("utf-8", errors="replace"),
                "error": stderr.decode("utf-8", errors="replace") if not success else "",
            }

        except asyncio.TimeoutError:
            return {"task_id": task.id, "title": task.title, "success": False, "error": "Timeout after 5 minutes"}
        except Exception as e:
            logger.exception(f"[Executor] Aider task failed: {e}")
            return {"task_id": task.id, "title": task.title, "success": False, "error": str(e)}

    async def _auto_fix(self, task: Task, repo_path: str, error_log: str) -> dict:
        """Feed error logs back to Aider to self-fix."""
        fix_message = f"""The following task failed with an error. Please fix it:

Task: {task.title}
Description: {task.description}

Error output:
{error_log[:3000]}

Fix the code to resolve this error."""

        fix_task = Task(
            id=task.id,
            title=f"[Fix] {task.title}",
            description=fix_message,
            files=task.files,
            type="modify",
        )
        return await self._run_aider_task(fix_task, repo_path)

    async def _docker_build(self, project_id: str, repo_path: str) -> tuple[bool, str]:
        """Build and restart the sandbox Docker container."""
        try:
            proc = await asyncio.create_subprocess_exec(
                "docker", "compose", "up", "-d", "--build",
                cwd=repo_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=600)
            success = proc.returncode == 0
            logs = (stdout + stderr).decode("utf-8", errors="replace")
            return success, logs
        except asyncio.TimeoutError:
            return False, "Docker build timed out after 10 minutes"
        except Exception as e:
            return False, str(e)

    async def _aider_fix_build_error(self, repo_path: str, build_logs: str):
        """Ask Aider to fix Docker build errors."""
        fix_task = Task(
            id=0,
            title="Fix Docker build error",
            description=f"""The Docker build failed with the following logs. Fix all errors:

{build_logs[:4000]}""",
            files=[],
            type="modify",
        )
        await self._run_aider_task(fix_task, repo_path)

    async def _git_push(self, repo_path: str):
        """Commit and push all changes to GitHub."""
        try:
            cmds = [
                ["git", "add", "-A"],
                ["git", "commit", "-m", "feat: ai agent update"],
                ["git", "push", "origin", "main"],
            ]
            for cmd in cmds:
                proc = await asyncio.create_subprocess_exec(
                    *cmd,
                    cwd=repo_path,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                await asyncio.wait_for(proc.communicate(), timeout=60)
        except Exception as e:
            logger.warning(f"[Executor] Git push failed: {e}")


executor_agent = ExecutorAgent()
