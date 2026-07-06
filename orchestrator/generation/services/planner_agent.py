"""
Planner Agent — uses DeepSeek V3 Pro to decompose a user prompt
into a structured list of atomic coding tasks.

IMPORTANT: Before planning, it reads the real repository structure and
key existing files so it never re-creates things that already exist.
"""
import json
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import List

from openai import AsyncOpenAI
from django.conf import settings

logger = logging.getLogger(__name__)

# Files/dirs to always skip when building context
SKIP_DIRS = {
    ".git", "__pycache__", "node_modules", ".next", "venv", ".venv",
    "dist", "build", "migrations", ".mypy_cache", ".pytest_cache",
    "static", "media",
}
SKIP_EXTENSIONS = {
    ".pyc", ".pyo", ".lock", ".log", ".map", ".ico",
    ".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif",
    ".woff", ".woff2", ".ttf", ".eot",
}

# Key files whose CONTENT we send to the LLM (not just names)
KEY_FILE_PATTERNS = {
    "backend/api/models.py",
    "backend/api/views.py",
    "backend/api/urls.py",
    "backend/api/serializers.py",
    "backend/config/settings.py",
    "backend/config/urls.py",
    "frontend/app/page.tsx",
    "frontend/app/layout.tsx",
    "frontend/package.json",
    "requirements.txt",
    "backend/requirements.txt",
}

SYSTEM_PROMPT = """You are a senior software architect and lead engineer.
Your job is to create a MINIMAL, PRECISE list of changes needed to fulfill the user's request.

CRITICAL RULES:
1. You will receive the EXISTING repository structure and key file contents.
2. NEVER recreate files that already exist — only MODIFY them.
3. Only plan what is ACTUALLY NEEDED to fulfill the request. Do not add unrelated tasks.
4. If something already exists and works, leave it alone.
5. Order tasks: backend models → migrations → backend API → frontend.
6. Each task must be atomic (one file = one task ideally).

REPOSITORY STRUCTURE:
- `frontend/` — Next.js App Router (React). All UI goes here.
- `backend/` — Django. All API/models go here.
- Frontend makes API calls using RELATIVE paths like `/api/...` (reverse proxy handles routing).
- NEVER use `localhost:8000` in frontend — always relative `/api/` paths.

OUTPUT FORMAT — valid JSON array only, no extra text:
[
  {
    "id": 1,
    "title": "Short task title",
    "description": "Detailed instructions for the AI coder. Include exact field names, logic, and requirements.",
    "files": ["path/to/file.py"],
    "type": "create | modify | delete"
  }
]
"""


@dataclass
class Task:
    id: int
    title: str
    description: str
    files: List[str]
    type: str  # create | modify | delete


class PlannerAgent:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.DEEPSEEK_API_KEY,
            base_url=settings.DEEPSEEK_BASE_URL,
        )

    # ── Public API ────────────────────────────────────────────────────────────

    async def plan(self, prompt: str, project_id: str) -> List[Task]:
        """
        Takes a user prompt and the project repo path,
        reads existing code context, then returns an ordered list of Tasks.
        """
        repo_path = os.path.join(settings.SANDBOX_BASE_DIR, project_id)
        logger.info(f"[Planner] Planning for project {project_id}: {prompt[:120]}")

        # Build context from the real repo
        file_tree = self._build_file_tree(repo_path)
        key_files_content = self._read_key_files(repo_path)

        user_message = self._build_user_message(prompt, file_tree, key_files_content)

        try:
            response = await self.client.chat.completions.create(
                model="deepseek-chat",          # DeepSeek V3 (latest stable alias)
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": user_message},
                ],
                temperature=0.2,
                max_tokens=4096,
            )

            raw = response.choices[0].message.content.strip()

            # Strip markdown code fences if present
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip()

            data = json.loads(raw)

            # Handle both {"tasks": [...]} and [...] responses
            if isinstance(data, dict):
                tasks_data = data.get("tasks", list(data.values())[0] if data else [])
            else:
                tasks_data = data

            tasks = [
                Task(
                    id=t.get("id", i + 1),
                    title=t.get("title", f"Task {i + 1}"),
                    description=t.get("description", ""),
                    files=t.get("files", []),
                    type=t.get("type", "modify"),
                )
                for i, t in enumerate(tasks_data)
            ]

            logger.info(f"[Planner] Generated {len(tasks)} tasks: {[t.title for t in tasks]}")
            return tasks

        except Exception as e:
            logger.exception(f"[Planner] Failed to plan: {e}")
            # Fallback: one generic task so executor can still try
            return [Task(
                id=1,
                title="Implement user request",
                description=prompt,
                files=[],
                type="modify",
            )]

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _build_file_tree(self, repo_path: str, max_files: int = 300) -> str:
        """Walk the repo and return a compact file tree string."""
        if not os.path.isdir(repo_path):
            return "(repository not found — likely a brand-new project)"

        lines: list[str] = []
        count = 0

        for root, dirs, files in os.walk(repo_path):
            # Prune skip dirs in-place so os.walk doesn't descend into them
            dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)

            rel_root = os.path.relpath(root, repo_path)
            depth = 0 if rel_root == "." else rel_root.count(os.sep) + 1
            indent = "  " * depth

            if rel_root != ".":
                lines.append(f"{indent}{os.path.basename(root)}/")

            for fname in sorted(files):
                ext = Path(fname).suffix.lower()
                if ext in SKIP_EXTENSIONS:
                    continue
                lines.append(f"{'  ' * (depth + 1)}{fname}")
                count += 1
                if count >= max_files:
                    lines.append("  ... (truncated)")
                    return "\n".join(lines)

        return "\n".join(lines) if lines else "(empty repository)"

    def _read_key_files(self, repo_path: str, max_chars_per_file: int = 3000) -> str:
        """Read the content of key existing files for context."""
        if not os.path.isdir(repo_path):
            return ""

        sections: list[str] = []

        for rel_path in sorted(KEY_FILE_PATTERNS):
            abs_path = os.path.join(repo_path, rel_path)
            if not os.path.isfile(abs_path):
                continue
            try:
                content = Path(abs_path).read_text(encoding="utf-8", errors="replace")
                if len(content) > max_chars_per_file:
                    content = content[:max_chars_per_file] + "\n... (truncated)"
                sections.append(f"### {rel_path}\n```\n{content}\n```")
            except Exception:
                pass

        return "\n\n".join(sections)

    @staticmethod
    def _build_user_message(prompt: str, file_tree: str, key_files: str) -> str:
        parts = [
            f"## User Request\n{prompt}",
            f"## Existing Repository Structure\n```\n{file_tree}\n```",
        ]
        if key_files:
            parts.append(f"## Key Existing File Contents\n{key_files}")

        parts.append(
            "## Your Task\n"
            "Based on the EXISTING code above, generate the MINIMUM set of changes "
            "needed to fulfill the user's request. Do NOT recreate anything that already exists. "
            "Output ONLY a JSON array of task objects."
        )
        return "\n\n".join(parts)


planner_agent = PlannerAgent()
