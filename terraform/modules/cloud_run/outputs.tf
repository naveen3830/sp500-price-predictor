output "service_name" {
  description = "Name of the deployed Cloud Run service"
  value       = google_cloud_run_v2_service.service.name
}

output "service_uri" {
  description = "Public URL endpoint of the Cloud Run service"
  value       = google_cloud_run_v2_service.service.uri
}

output "service_account_email" {
  description = "Email of the dedicated runtime service account"
  value       = google_service_account.service_sa.email
}
