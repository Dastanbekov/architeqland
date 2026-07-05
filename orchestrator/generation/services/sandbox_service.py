"""
Sandbox Service — provisions a new project sandbox:
1. Creates a GitHub repository from the Django+Next.js template
2. Clones it to the droplet's /sandboxes/{project_id} directory
3. Generates a docker-compose.yml with Traefik labels for the subdomain
4. Spins up the container
"""
import asyncio
import logging
import os
import textwrap
from django.conf import settings

logger = logging.getLogger(__name__)

DJANGO_NEXTJS_TEMPLATE_REPO = "Dastanbekov/architeq-sandbox-template"


class SandboxService:

    async def provision(self, project_id: str, project_name: str, owner_username: str) -> dict:
        """
        Full provisioning flow. Returns {"subdomain": ..., "github_repo_url": ..., "status": ...}
        """
        subdomain = f"{project_name}.{settings.SANDBOX_DOMAIN}"
        github_repo_url = ""

        try:
            # Step 1: Create GitHub repo
            github_repo_url = await self._create_github_repo(project_name)
            logger.info(f"[Sandbox] GitHub repo created: {github_repo_url}")

            # Step 2: Clone to droplet via SSH
            repo_path = os.path.join(settings.SANDBOX_BASE_DIR, project_id)
            await self._clone_repo(github_repo_url, repo_path)

            # Step 3: Write docker-compose.yml with Traefik labels
            await self._write_docker_compose(repo_path, project_name, subdomain)

            # Step 4: Build and start container
            await self._docker_up(repo_path)

            return {
                "subdomain": subdomain,
                "github_repo_url": github_repo_url,
                "status": "live",
            }

        except Exception as e:
            logger.exception(f"[Sandbox] Provisioning failed for {project_name}: {e}")
            return {
                "subdomain": subdomain,
                "github_repo_url": github_repo_url,
                "status": "error",
            }

    async def _create_github_repo(self, project_name: str) -> str:
        """Create a GitHub repo from the template using PyGithub."""
        from github import Github, GithubException

        g = Github(settings.GITHUB_TOKEN)
        auth_user = g.get_user()
        
        if auth_user.login == settings.GITHUB_ORG:
            creator = auth_user
        else:
            creator = g.get_organization(settings.GITHUB_ORG)

        try:
            # Try creating from template
            template_repo = g.get_repo(DJANGO_NEXTJS_TEMPLATE_REPO)
            new_repo = creator.create_repo_from_template(
                name=f"sandbox-{project_name}",
                repo=template_repo,
                private=False,
                description=f"Architeq sandbox: {project_name}",
            )
        except GithubException as e:
            logger.warning(f"Template repo not found or failed, creating empty: {e}")
            # Fallback: create empty repo
            new_repo = creator.create_repo(
                name=f"sandbox-{project_name}",
                private=False,
                auto_init=True,
                description=f"Architeq sandbox: {project_name}",
            )

        return new_repo.clone_url

    async def _clone_repo(self, clone_url: str, repo_path: str):
        """Clone the GitHub repo to the sandboxes directory on the droplet."""
        # Inject GitHub token for auth
        authed_url = clone_url.replace(
            "https://",
            f"https://{settings.GITHUB_TOKEN}@"
        )
        os.makedirs(os.path.dirname(repo_path), exist_ok=True)

        proc = await asyncio.create_subprocess_exec(
            "git", "clone", authed_url, repo_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await asyncio.wait_for(proc.communicate(), timeout=60)
        if proc.returncode != 0:
            raise RuntimeError(f"git clone failed: {stderr.decode()}")

    async def _write_docker_compose(self, repo_path: str, project_name: str, subdomain: str):
        """Write a docker-compose.yml that hooks into Traefik with the sandbox subdomain."""
        compose_content = textwrap.dedent(f"""\
            version: "3.8"
            services:
              backend:
                build: ./backend
                container_name: sandbox_{project_name}_backend
                restart: always
                environment:
                  - DEBUG=False
                  - ALLOWED_HOSTS={subdomain}
                networks:
                  - architeq_network
                labels:
                  - "traefik.enable=true"
                  - "traefik.http.routers.{project_name}-api.rule=Host(`{subdomain}`) && PathPrefix(`/api`)"
                  - "traefik.http.routers.{project_name}-api.entrypoints=websecure"
                  - "traefik.http.routers.{project_name}-api.tls.certresolver=myresolver"
                  - "traefik.http.services.{project_name}-api.loadbalancer.server.port=8000"

              frontend:
                build: ./frontend
                container_name: sandbox_{project_name}_frontend
                restart: always
                environment:
                  - NEXT_PUBLIC_API_URL=https://{subdomain}
                networks:
                  - architeq_network
                labels:
                  - "traefik.enable=true"
                  - "traefik.http.routers.{project_name}.rule=Host(`{subdomain}`)"
                  - "traefik.http.routers.{project_name}.entrypoints=websecure"
                  - "traefik.http.routers.{project_name}.tls.certresolver=myresolver"
                  - "traefik.http.services.{project_name}.loadbalancer.server.port=3000"

            networks:
              architeq_network:
                external: true
        """)

        compose_path = os.path.join(repo_path, "docker-compose.yml")
        with open(compose_path, "w") as f:
            f.write(compose_content)

    async def _docker_up(self, repo_path: str):
        """Start the sandbox containers."""
        proc = await asyncio.create_subprocess_exec(
            "docker", "compose", "up", "-d", "--build",
            cwd=repo_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=600)
        if proc.returncode != 0:
            raise RuntimeError(f"docker-compose failed: {stderr.decode()}")


sandbox_service = SandboxService()
