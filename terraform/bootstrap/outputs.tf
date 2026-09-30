output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "tfstate_bucket" {
  description = "GCS bucket created for Terraform remote state"
  value       = google_storage_bucket.tfstate.name
}

output "workload_identity_provider" {
  description = "Full identifier of the Workload Identity Provider for GitHub Actions"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "service_account_email" {
  description = "Email of the Terraform CI/CD Service Account"
  value       = google_service_account.terraform_cicd.email
}

output "github_actions_auth_snippet" {
  description = "Code snippet ready to paste into GitHub Actions workflows"
  value       = <<-EOT
    - name: Authenticate to Google Cloud
      uses: google-github-actions/auth@v2
      with:
        workload_identity_provider: "${google_iam_workload_identity_pool_provider.github_provider.name}"
        service_account: "${google_service_account.terraform_cicd.email}"
  EOT
}
