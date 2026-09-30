variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
  default     = "stock-price-prediction-510204"
}

variable "region" {
  description = "The default GCP region for regional resources"
  type        = string
  default     = "asia-south1"
}

variable "github_repository" {
  description = "The GitHub repository in owner/repo format allowed to authenticate via Workload Identity Federation"
  type        = string
  default     = "naveen3830/sp500-price-predictor"
}

variable "tfstate_bucket_name" {
  description = "Name of the GCS bucket to store Terraform remote state (leave empty to use project_id-tfstate)"
  type        = string
  default     = ""
}
