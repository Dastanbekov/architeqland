import os
import json
from openai import AsyncOpenAI

class LLMService:
    def __init__(self):
        # Using OpenAI SDK pointing to Deepseek API
        self.client = AsyncOpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY", "dummy-key"),
            base_url="https://api.deepseek.com",
        )

    async def generate_project_structure(self, prompt: str) -> dict:
        system_prompt = (
            "You are an expert AI software architect and full-stack developer. "
            "Based on the user's prompt, generate a completely functional Static Web Application. "
            "You MUST output raw, valid JSON only, with no markdown formatting or extra text. "
            "The app MUST be built with pure HTML, CSS, and JS (no build tools like React or Vite). "
            "You must include an 'index.html' at the root of the 'files' array. "
            "Required JSON schema: { 'appName': 'string', 'framework': 'html', 'description': 'string', 'files': [ { 'path': 'string', 'content': 'string' } ] }"
        )

        try:
            response = await self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            raise RuntimeError(f"Deepseek LLM generation failed: {e}")

llm_service = LLMService()
