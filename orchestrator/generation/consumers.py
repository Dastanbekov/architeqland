import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger(__name__)


class ProjectConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for a project session.
    Clients connect to: wss://api.architeq.tech/ws/projects/{project_id}/
    Messages flow: user → consumer → agent pipeline → broadcast back to client.
    """

    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.group_name = f"project_{self.project_id}"

        # Reject unauthenticated connections
        user = self.scope.get("user")
        if not user or isinstance(user, AnonymousUser) or not user.is_authenticated:
            await self.close(code=4001)
            return

        # Verify project belongs to this user
        project = await self._get_project(self.project_id, user)
        if not project:
            await self.close(code=4004)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Send current project status on connect
        await self.send(json.dumps({
            "type": "project_status",
            "project_id": str(project.id),
            "status": project.status,
            "url": project.url,
            "name": project.name,
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Handle incoming message from the browser.
        Kicks off the agent pipeline asynchronously.
        """
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        msg_type = data.get("type")

        if msg_type == "chat_message":
            prompt = data.get("content", "").strip()
            if not prompt:
                return

            user = self.scope["user"]

            # Save user message to DB
            await self._save_message(self.project_id, "user", prompt)

            # Notify client: agent is thinking
            await self.send(json.dumps({
                "type": "agent_thinking",
                "message": "Агент анализирует задачу...",
            }))

            # Launch the full agent pipeline in background
            from channels.db import database_sync_to_async
            import asyncio
            asyncio.create_task(self._run_agent_pipeline(self.project_id, prompt))

    async def _run_agent_pipeline(self, project_id: str, prompt: str):
        """
        Full agent pipeline: Planner → Executor → Summary
        Sends progress updates via WebSocket throughout.
        """
        from .services.planner_agent import planner_agent
        from .services.executor_agent import executor_agent
        from .services.summary_agent import summary_agent

        try:
            # Step 1: Planner breaks prompt into tasks
            await self.channel_layer.group_send(self.group_name, {
                "type": "agent_update",
                "event": "planning",
                "message": "🧠 Планирую задачи...",
            })
            tasks = await planner_agent.plan(prompt, project_id)

            # Step 2: Executor implements each task
            await self.channel_layer.group_send(self.group_name, {
                "type": "agent_update",
                "event": "building",
                "message": f"⚙️ Начинаю реализацию ({len(tasks)} задач)...",
            })

            results = await executor_agent.execute(
                project_id=project_id,
                tasks=tasks,
                on_progress=lambda msg: self.channel_layer.group_send(
                    self.group_name,
                    {"type": "agent_update", "event": "progress", "message": msg}
                ),
            )

            # Step 3: Summary agent writes a short human-readable summary
            summary = await summary_agent.summarize(prompt, results)
            await self._save_message(project_id, "assistant", summary)

            # Send final summary to client
            await self.channel_layer.group_send(self.group_name, {
                "type": "agent_update",
                "event": "done",
                "message": summary,
            })

            # Signal frontend to reload the preview iframe
            project = await self._get_project_by_id(project_id)
            await self.channel_layer.group_send(self.group_name, {
                "type": "agent_update",
                "event": "reload_preview",
                "url": project.url if project else "",
            })

        except Exception as e:
            logger.exception(f"Agent pipeline failed for project {project_id}: {e}")
            await self.channel_layer.group_send(self.group_name, {
                "type": "agent_update",
                "event": "error",
                "message": f"❌ Ошибка: {str(e)}",
            })

    # ── Channel layer message handlers ─────────────────────────────────────
    async def agent_update(self, event):
        await self.send(json.dumps({
            "type": "agent_update",
            "event": event.get("event"),
            "message": event.get("message", ""),
            "url": event.get("url", ""),
        }))

    async def project_status(self, event):
        await self.send(json.dumps(event))

    # ── DB helpers ──────────────────────────────────────────────────────────
    @database_sync_to_async
    def _get_project(self, project_id: str, user):
        from .models import Project
        try:
            return Project.objects.get(id=project_id, owner=user)
        except Project.DoesNotExist:
            return None

    @database_sync_to_async
    def _get_project_by_id(self, project_id: str):
        from .models import Project
        try:
            return Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return None

    @database_sync_to_async
    def _save_message(self, project_id: str, role: str, content: str):
        from .models import Project, ChatMessage
        try:
            project = Project.objects.get(id=project_id)
            return ChatMessage.objects.create(project=project, role=role, content=content)
        except Project.DoesNotExist:
            return None
