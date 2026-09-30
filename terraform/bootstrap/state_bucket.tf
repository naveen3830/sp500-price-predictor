locals {
  state_bucket_name = var.tfstate_bucket_name != "" ? var.tfstate_bucket_name : "${var.project_id}-tfstate"
}

resource "google_storage_bucket" "tfstate" {
  name                        = local.state_bucket_name
  location                    = var.region
  force_destroy               = false
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      num_newer_versions = 5
      with_state         = "ARCHIVED"
    }
  }

  depends_on = [
    google_project_service.bootstrap_services["storage.googleapis.com"]
  ]
}
