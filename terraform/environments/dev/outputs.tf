output "artifact_registry_url" {
  description = "Docker repository URL for pushing container images"
  value       = module.artifact_registry.repository_url
}

output "backend_service_uri" {
  description = "Public URL of the FastAPI backend Cloud Run service"
  value       = length(module.backend_service) > 0 ? module.backend_service[0].service_uri : ""
}

output "frontend_service_uri" {
  description = "Public URL of the Vite React frontend Cloud Run service"
  value       = length(module.frontend_service) > 0 ? module.frontend_service[0].service_uri : ""
}
