variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region for the Cloud Run service"
  type        = string
  default     = "asia-south1"
}

variable "service_name" {
  description = "Name of the Cloud Run service"
  type        = string
}

variable "image" {
  description = "Docker image URL for the service"
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "container_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 8080
}

variable "cpu" {
  description = "CPU allocation for the container"
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory allocation for the container"
  type        = string
  default     = "512Mi"
}

variable "min_instances" {
  description = "Minimum number of instances (set to 0 for cost-free idle)"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum number of instances (capped for personal project cost safety)"
  type        = number
  default     = 2
}

variable "allow_unauthenticated" {
  description = "Whether to allow unauthenticated public invocations"
  type        = bool
  default     = true
}

variable "environment_variables" {
  description = "Map of environment variables to inject into the container"
  type        = map(string)
  default     = {}
}
