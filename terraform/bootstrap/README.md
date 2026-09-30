# Terraform Bootstrap for GCP & GitHub Actions

This bootstrap module sets up the initial foundation required for managing infrastructure through Terraform and GitHub Actions without storing long-lived service account keys.

## What is Created

1. **Required Google APIs**:
   - `iam.googleapis.com`
   - `iamcredentials.googleapis.com`
   - `sts.googleapis.com`
   - `cloudresourcemanager.googleapis.com`
   - `storage.googleapis.com`
   - `serviceusage.googleapis.com`
   - `run.googleapis.com`
   - `artifactregistry.googleapis.com`
2. **Remote State Storage**:
   - Google Cloud Storage (GCS) bucket: `stock-price-prediction-510204-tfstate`
   - Object versioning enabled (prevents accidental state loss)
   - Uniform bucket-level access & public access prevention enforced
   - Lifecycle policy to retain the last 5 versions of archived state objects
3. **Workload Identity Federation (WIP)**:
   - Workload Identity Pool: `github-actions-pool`
   - Workload Identity Provider: `github-actions-provider`
   - Configured specifically for GitHub repository `naveen3830/sp500-price-predictor`
4. **Terraform CI/CD Service Account**:
   - `sa-terraform-cicd@stock-price-prediction-510204.iam.gserviceaccount.com`
   - Granular IAM roles assigned (`storage.admin`, `run.admin`, `artifactregistry.admin`, `iam.serviceAccountUser`, `iam.serviceAccountAdmin`, `serviceusage.serviceUsageAdmin`, `resourcemanager.projectIamAdmin`)
   - Impersonation permission granted to GitHub Actions via Workload Identity Provider

---

## How to Run Bootstrap (One-Time Execution)

### Step 1: Authenticate with Google Cloud
Ensure your local `gcloud` CLI is pointing to your personal Google account (`naveenrr1729@gmail.com`) and target project:

```powershell
gcloud config set account naveenrr1729@gmail.com
gcloud config set project stock-price-prediction-510204
gcloud auth application-default login
```

### Step 2: Initialize & Apply Bootstrap Terraform
From the repository root:

```powershell
cd terraform/bootstrap
terraform init
terraform plan
terraform apply
```

### Step 3: Note the Outputs
Upon successful completion, Terraform outputs:
- `tfstate_bucket`: `stock-price-prediction-510204-tfstate`
- `workload_identity_provider`: `projects/1000490214833/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider`
- `service_account_email`: `sa-terraform-cicd@stock-price-prediction-510204.iam.gserviceaccount.com`

These values are already wired into `terraform/environments/dev/backend.tf` and `.github/workflows/terraform-*.yml`.
