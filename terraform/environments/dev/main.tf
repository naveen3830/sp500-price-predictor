# Artifact Registry Repository for Docker container images
module "artifact_registry" {
  source = "../../modules/artifact_registry"

  project_id    = var.project_id
  region        = var.region
  repository_id = "sp500-predictor-${var.environment}"
  description   = "Docker container images for S&P 500 Price Predictor (${var.environment})"

  depends_on = [
    google_project_service.services["artifactregistry.googleapis.com"]
  ]
}

# Backend FastAPI Cloud Run Service
module "backend_service" {
  count  = var.deploy_cloud_run_services ? 1 : 0
  source = "../../modules/cloud_run"

  project_id            = var.project_id
  region                = var.region
  service_name          = "sp500-backend-${var.environment}"
  container_port        = 8000
  cpu                   = "1"
  memory                = "1Gi" # Allocated for LSTM / Scikit-learn inferences
  min_instances         = 0     # Cost-effective scale-to-zero
  max_instances         = 2     # Cap for personal account cost safety
  allow_unauthenticated = true

  environment_variables = {
    ENV = var.environment
  }

  depends_on = [
    google_project_service.services["run.googleapis.com"]
  ]
}

# Frontend Vite React Cloud Run Service
module "frontend_service" {
  count  = var.deploy_cloud_run_services ? 1 : 0
  source = "../../modules/cloud_run"

  project_id            = var.project_id
  region                = var.region
  service_name          = "sp500-frontend-${var.environment}"
  container_port        = 80
  cpu                   = "1"
  memory                = "512Mi"
  min_instances         = 0
  max_instances         = 2
  allow_unauthenticated = true

  environment_variables = {
    VITE_ENV = var.environment
  }

  depends_on = [
    google_project_service.services["run.googleapis.com"]
  ]
}
