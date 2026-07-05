import os
import uuid
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class ProjectService:
    def __init__(self):
        # We store projects in a temporary directory on the host (or inside the container if we stream the build context)
        self.base_dir = Path("/tmp/architeq_projects")
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def create_project_files(self, project_data: dict) -> tuple[str, str]:
        """
        Creates the physical project files on disk and generates a Dockerfile.
        Returns: (project_id, absolute_path_to_project_dir)
        """
        project_id = str(uuid.uuid4())[:8]
        project_dir = self.base_dir / project_id
        project_dir.mkdir(parents=True, exist_ok=True)

        logger.info(f"Creating project {project_id} at {project_dir}")

        # Write files returned by LLM
        files = project_data.get("files", [])
        for file_info in files:
            file_path = project_dir / file_info["path"]
            
            # Ensure subdirectories exist
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(file_info["content"])

        # Write Dockerfile for Nginx Static Hosting
        dockerfile_content = (
            "FROM nginx:alpine\n"
            "COPY . /usr/share/nginx/html\n"
            "EXPOSE 80\n"
        )
        
        with open(project_dir / "Dockerfile", "w", encoding="utf-8") as f:
            f.write(dockerfile_content)

        return project_id, str(project_dir.absolute())

project_service = ProjectService()
