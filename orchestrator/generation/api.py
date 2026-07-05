from ninja import Router, Schema
from typing import Dict, Any
from .services.llm_service import llm_service
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
    
    # Step 2: Deploy Container (Docker + Traefik Labels, sync call wrapper)
    deployment_info = docker_service.deploy_app(project_data)
    
    return GenerateResponse(
        project_id=deployment_info["project_id"],
        url=deployment_info["url"],
        status=deployment_info["status"],
        details=project_data
    )
