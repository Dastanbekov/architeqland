"""
Summary Agent — uses cheap DeepSeek V3 (non-pro) to write a short,
human-readable summary of what the executor just did.
Shown in the chat panel as the assistant's message.
"""
import logging
from typing import List
from openai import AsyncOpenAI
from django.conf import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a concise technical assistant.
Summarize what was just implemented in 2-4 short sentences.
Write in plain language that a non-developer can understand.
Do NOT list every file. Focus on what the user will SEE or experience.
Start with what was done, end with what they can do next.
"""


class SummaryAgent:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.DEEPSEEK_API_KEY,
            base_url=settings.DEEPSEEK_BASE_URL,
        )

    async def summarize(self, original_prompt: str, results: List[dict]) -> str:
        """Generate a short summary from task results."""
        completed = [r for r in results if r.get("success")]
        failed = [r for r in results if not r.get("success")]

        task_summary = "\n".join(
            f"- ✅ {r['title']}" for r in completed
        )
        if failed:
            task_summary += "\n" + "\n".join(
                f"- ⚠️ {r['title']} (with issues)" for r in failed
            )

        try:
            response = await self.client.chat.completions.create(
                model="deepseek-v4-flash",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": (
                        f"User asked: {original_prompt}\n\n"
                        f"Tasks completed:\n{task_summary}"
                    )},
                ],
                temperature=0.5,
                max_tokens=300,
            )
            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.warning(f"[Summary] Failed to generate summary: {e}")
            done_count = len(completed)
            return f"Выполнено {done_count} задач. Сайт обновлён — проверь в превью!"


summary_agent = SummaryAgent()
