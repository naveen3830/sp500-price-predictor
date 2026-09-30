variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
  default     = "stock-price-prediction-510204"
}

variable "region" {
  description = "The default GCP region for resources"
  type        = string
  default     = "asia-south1"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "deploy_cloud_run_services" {
  description = "Whether to provision Cloud Run services immediately with placeholder images"
  type        = bool
  default     = true
}
