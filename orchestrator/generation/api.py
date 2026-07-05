from ninja import Router, Schema
import logging

logger = logging.getLogger(__name__)
# CI/CD Test trigger comment 2
from typing import Dict, Any
from .services.llm_service import llm_service
from .services.project_service import project_service
from .services.docker_service import docker_service

router = Router()

class GenerateRequest(Schema):
    prompt: str

class GenerateResponse(Schema):
    project_id: str
    url: str
    status: str
    details: Dict[str, Any]

@router.post("/generate", response=GenerateResponse)
async def generate_app(request, data: GenerateRequest):
    """
    Accepts a user prompt, connects to Deepseek to generate a structured app,
    spins up a Docker container, and returns the unique subdomain URL.
    """
    # Step 1: Generate Project Structure (Deepseek Async)
    project_data = await llm_service.generate_project_structure(data.prompt)
    
    # Step 2: Write Files and Generate Dockerfile
    project_id, project_dir = project_service.create_project_files(project_data)
    
    # Step 3: Deploy Container (Docker + Traefik Labels)
    deployment_info = docker_service.build_and_deploy_app(project_id, project_dir)
    
    return GenerateResponse(
        project_id=deployment_info["project_id"],
        url=deployment_info["url"],
        status=deployment_info["status"],
        details=project_data
    )
