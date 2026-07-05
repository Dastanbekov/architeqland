import docker
import uuid
import logging

logger = logging.getLogger(__name__)

class DockerService:
    def __init__(self):
        try:
            self.client = docker.from_env()
            self.network_name = "architeq_network"
        except Exception as e:
            logger.error(f"Failed to connect to Docker daemon: {e}")
            self.client = None

    def deploy_app(self, project_data: dict) -> dict:
        if not self.client:
            raise RuntimeError("Docker client is not initialized.")

        project_id = str(uuid.uuid4())[:8]
        subdomain = f"{project_id}.architeq.tech"
        container_name = f"app-{project_id}"
        
        labels = {
            "traefik.enable": "true",
            f"traefik.http.routers.{container_name}.rule": f"Host(`{subdomain}`)",
            f"traefik.http.routers.{container_name}.entrypoints": "web",
            f"traefik.http.services.{container_name}.loadbalancer.server.port": "80",
            "traefik.docker.network": self.network_name,
        }

        try:
            logger.info(f"Deploying {container_name} at {subdomain}...")
            container = self.client.containers.run(
                "nginxdemos/hello:plain-text",
                name=container_name,
                labels=labels,
                network=self.network_name,
                detach=True,
                restart_policy={"Name": "unless-stopped"}
            )
            return {
                "project_id": project_id,
                "container_id": container.id,
                "url": f"http://{subdomain}",
                "status": "running"
            }
        except Exception as e:
            logger.error(f"Error deploying container {container_name}: {e}")
            raise e

docker_service = DockerService()
