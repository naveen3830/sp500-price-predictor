variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region for the repository"
  type        = string
  default     = "asia-south1"
}

variable "repository_id" {
  description = "The ID of the Artifact Registry repository"
  type        = string
  default     = "sp500-predictor-repo"
}

variable "description" {
  description = "Description for the Artifact Registry repository"
  type        = string
  default     = "Docker repository for S&P 500 Price Predictor services"
}
