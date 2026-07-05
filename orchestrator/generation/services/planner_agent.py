"""
Planner Agent — uses DeepSeek V3 Pro to decompose a user prompt
into a structured list of atomic coding tasks.
"""
import json
import logging
from dataclasses import dataclass
from typing import List
from openai import AsyncOpenAI
from django.conf import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a senior software architect and lead engineer.
Your job is to break down a user's app idea into a precise, ordered list of implementation tasks.

Rules:
- Each task must be atomic and actionable (one file change / one feature)
- Order tasks from foundation to features (models → API → frontend)
- Output ONLY valid JSON — an array of task objects
- Each task object: {"id": number, "title": string, "description": string, "files": [string], "type": "create|modify|delete"}

Example output:
[
  {"id": 1, "title": "Create Django User model extension", "description": "Add profile fields to Django user", "files": ["app/models.py"], "type": "create"},
  {"id": 2, "title": "Create REST API endpoint for users", "description": "GET /api/users/ endpoint with JWT auth", "files": ["app/api.py"], "type": "modify"}
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

    async def plan(self, prompt: str, project_id: str) -> List[Task]:
        """
        Takes a user prompt and returns an ordered list of Tasks.
        """
        logger.info(f"[Planner] Planning for project {project_id}: {prompt[:100]}")

        try:
            response = await self.client.chat.completions.create(
                model="deepseek-chat",  # DeepSeek V3 Pro
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"App idea: {prompt}"},
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=4096,
            )

            raw = response.choices[0].message.content
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

            logger.info(f"[Planner] Generated {len(tasks)} tasks")
            return tasks

        except Exception as e:
            logger.exception(f"[Planner] Failed to plan: {e}")
            # Return a single fallback task so executor can still try
            return [Task(
                id=1,
                title="Implement user request",
                description=prompt,
                files=[],
                type="modify",
            )]


planner_agent = PlannerAgent()
