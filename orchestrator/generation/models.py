import uuid
from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    class Status(models.TextChoices):
        CREATING = 'creating', 'Creating'
        BUILDING = 'building', 'Building'
        LIVE = 'live', 'Live'
        ERROR = 'error', 'Error'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    name = models.SlugField(max_length=63, unique=True)  # used as subdomain
    display_name = models.CharField(max_length=255, blank=True)
    github_repo_url = models.URLField(blank=True)
    subdomain = models.CharField(max_length=127, blank=True)  # {name}.sandbox.architeq.tech
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.status})"

    @property
    def url(self):
        return f"https://{self.subdomain}"


class ChatMessage(models.Model):
    class Role(models.TextChoices):
        USER = 'user', 'User'
        ASSISTANT = 'assistant', 'Assistant'
        SYSTEM = 'system', 'System'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=Role.choices)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.role}] {self.content[:60]}"
