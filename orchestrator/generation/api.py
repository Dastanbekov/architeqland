import logging
import random
import string
from typing import List
from ninja import Router, Schema
from ninja_jwt.authentication import JWTAuth
from django.http import HttpResponse
from channels.db import database_sync_to_async
from .auth import router as auth_router
from .models import Project, ChatMessage

logger = logging.getLogger(__name__)
router = Router()
router.add_router("/auth", auth_router)


def _random_slug(length: int = 10) -> str:
    """Generate a random DNS-safe slug like 'violet-moon-4x2k'."""
    adjectives = ["violet", "amber", "swift", "calm", "bold", "sage", "jade"]
    nouns = ["moon", "star", "wave", "peak", "mist", "lake", "vale"]
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=4))
    return f"{random.choice(adjectives)}-{random.choice(nouns)}-{suffix}"


# ── Schemas ─────────────────────────────────────────────────────────────────

class CreateProjectRequest(Schema):
    prompt: str  # the initial idea / prompt for the project


class ProjectSchema(Schema):
    id: str
    name: str
    display_name: str
    subdomain: str
    url: str
    status: str
    github_repo_url: str
    created_at: str


class MessageSchema(Schema):
    id: str
    role: str
    content: str
    created_at: str


# ── Projects ─────────────────────────────────────────────────────────────────

@router.post("/projects", response=ProjectSchema, auth=JWTAuth())
async def create_project(request, data: CreateProjectRequest):
    """
    Creates a new project sandbox:
    - Picks a random subdomain name
    - Creates GitHub repo from template
    - Spins up Docker sandbox on the droplet
    - Runs the initial agent pipeline against the prompt
    """
    from .services.sandbox_service import sandbox_service
    from django.conf import settings

    slug = _random_slug()
    subdomain = f"{slug}.{settings.SANDBOX_DOMAIN}"

    # Create DB record immediately so the UI can show "creating" state
    project = await _create_project_record(
        owner=request.auth,
        slug=slug,
        display_name=data.prompt[:80],
        subdomain=subdomain,
    )

    # Provision the sandbox (async — does not block the HTTP response)
    import asyncio
    asyncio.create_task(
        _provision_and_notify(str(project.id), slug, request.auth.username)
    )

    return _project_to_schema(project)


@router.get("/projects", response=List[ProjectSchema], auth=JWTAuth())
async def list_projects(request):
    """Returns all projects owned by the current user."""
    projects = await _get_user_projects(request.auth)
    return [_project_to_schema(p) for p in projects]


@router.get("/projects/{project_id}", response=ProjectSchema, auth=JWTAuth())
async def get_project(request, project_id: str):
    """Get a single project."""
    project = await _get_project(project_id, request.auth)
    if not project:
        from ninja import errors
        raise errors.HttpError(404, "Project not found")
    return _project_to_schema(project)


@router.get("/projects/{project_id}/messages", response=List[MessageSchema], auth=JWTAuth())
async def get_messages(request, project_id: str):
    """Return chat history for a project."""
    project = await _get_project(project_id, request.auth)
    if not project:
        from ninja import errors
        raise errors.HttpError(404, "Project not found")
    messages = await _get_project_messages(project_id)
    return [_message_to_schema(m) for m in messages]


# ── Helpers ──────────────────────────────────────────────────────────────────

def _project_to_schema(p: Project) -> ProjectSchema:
    return ProjectSchema(
        id=str(p.id),
        name=p.name,
        display_name=p.display_name,
        subdomain=p.subdomain,
        url=p.url,
        status=p.status,
        github_repo_url=p.github_repo_url,
        created_at=p.created_at.isoformat(),
    )


def _message_to_schema(m: ChatMessage) -> MessageSchema:
    return MessageSchema(
        id=str(m.id),
        role=m.role,
        content=m.content,
        created_at=m.created_at.isoformat(),
    )


async def _provision_and_notify(project_id: str, slug: str, username: str):
    """Background task: provision sandbox and update project status."""
    from .services.sandbox_service import sandbox_service
    from channels.layers import get_channel_layer

    channel_layer = get_channel_layer()
    group_name = f"project_{project_id}"

    result = await sandbox_service.provision(project_id, slug, username)
    await _update_project_status(project_id, result["status"], result["github_repo_url"])

    await channel_layer.group_send(group_name, {
        "type": "project_status",
        "project_id": project_id,
        "status": result["status"],
        "url": f"https://{result['subdomain']}",
    })


# ── DB sync helpers ───────────────────────────────────────────────────────────

@database_sync_to_async
def _create_project_record(owner, slug: str, display_name: str, subdomain: str) -> Project:
    return Project.objects.create(
        owner=owner,
        name=slug,
        display_name=display_name,
        subdomain=subdomain,
        status=Project.Status.CREATING,
    )


@database_sync_to_async
def _get_user_projects(user) -> list:
    return list(Project.objects.filter(owner=user).order_by("-created_at"))


@database_sync_to_async
def _get_project(project_id: str, user) -> Project | None:
    try:
        return Project.objects.get(id=project_id, owner=user)
    except Project.DoesNotExist:
        return None


@database_sync_to_async
def _get_project_messages(project_id: str) -> list:
    return list(ChatMessage.objects.filter(project_id=project_id).order_by("created_at"))


@database_sync_to_async
def _update_project_status(project_id: str, status: str, github_repo_url: str = ""):
    Project.objects.filter(id=project_id).update(
        status=status,
        github_repo_url=github_repo_url or "",
    )
