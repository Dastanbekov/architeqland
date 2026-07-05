import docker
import logging
import shutil

logger = logging.getLogger(__name__)

class DockerService:
    def __init__(self):
        try:
            self.client = docker.from_env()
            self.network_name = "architeq_network"
        except Exception as e:
            logger.error(f"Failed to connect to Docker daemon: {e}")
            self.client = None

    def build_and_deploy_app(self, project_id: str, project_dir: str) -> dict:
        if not self.client:
            raise RuntimeError("Docker client is not initialized.")

        image_tag = f"architeq-app:{project_id}"
        subdomain = f"{project_id}.architeq.tech"
        container_name = f"app-{project_id}"

        # 1. Build the Docker Image
        try:
            logger.info(f"Building Docker image {image_tag} from {project_dir}...")
            # We stream the context to the docker daemon, so it works even if Orchestrator is in a container
            self.client.images.build(path=project_dir, tag=image_tag, rm=True)
        except Exception as e:
            logger.error(f"Error building image {image_tag}: {e}")
            raise e

        # 2. Deploy the Container
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
                image_tag,
                name=container_name,
                labels=labels,
                network=self.network_name,
                detach=True,
                restart_policy={"Name": "unless-stopped"}
            )
            
            # Clean up the temp directory after successful deployment
            try:
                shutil.rmtree(project_dir)
            except Exception as cleanup_err:
                logger.warning(f"Failed to clean up {project_dir}: {cleanup_err}")

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
