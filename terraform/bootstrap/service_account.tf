resource "google_service_account" "terraform_cicd" {
  account_id   = "sa-terraform-cicd"
  display_name = "Terraform CI/CD Service Account"
  description  = "Service Account used by GitHub Actions to manage infrastructure via Terraform"

  depends_on = [
    google_project_service.bootstrap_services["iam.googleapis.com"]
  ]
}

# Allow GitHub Actions repository via Workload Identity Provider to impersonate this Service Account
resource "google_service_account_iam_member" "wif_impersonation" {
  service_account_id = google_service_account.terraform_cicd.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repository}"
}

# Allow Service Account Token Creator role for Workload Identity credential generation
resource "google_service_account_iam_member" "token_creator" {
  service_account_id = google_service_account.terraform_cicd.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repository}"
}

# Project-level IAM roles for Terraform CI/CD automation
locals {
  terraform_roles = [
    "roles/storage.admin",
    "roles/run.admin",
    "roles/artifactregistry.admin",
    "roles/iam.serviceAccountUser",
    "roles/iam.serviceAccountAdmin",
    "roles/serviceusage.serviceUsageAdmin",
    "roles/resourcemanager.projectIamAdmin"
  ]
}

resource "google_project_iam_member" "terraform_roles" {
  for_each = toset(local.terraform_roles)

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.terraform_cicd.email}"
}
