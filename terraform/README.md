# Infrastructure as Code (Terraform + GCP + GitHub Actions WIP)

This directory contains the complete Infrastructure as Code (IaC) configuration for the **S&P 500 Price Predictor** on Google Cloud Platform, automated with GitHub Actions via **Workload Identity Federation (WIP)**.

---

## Directory Structure

```
terraform/
├── bootstrap/               # Step 1: One-time local bootstrap (WIP, State Bucket, Service Account)
│   ├── versions.tf          # Provider definition (Google Cloud)
│   ├── apis.tf              # Base APIs (IAM, STS, Storage, ResourceManager)
│   ├── state_bucket.tf      # Remote GCS state bucket with versioning
│   ├── workload_identity.tf # Workload Identity Pool & Provider for GitHub Actions
│   ├── service_account.tf   # sa-terraform-cicd + least privilege IAM roles
│   ├── variables.tf         # Variables
│   ├── terraform.tfvars     # Local dev values
│   ├── outputs.tf           # Output values (Bucket name, WIP provider, SA email)
│   └── README.md            # Bootstrap execution guide
│
├── environments/
│   └── dev/                 # Step 2: Main infrastructure managed via GitHub Actions
│       ├── versions.tf      # Provider constraints
│       ├── backend.tf       # Remote state in GCS (points to bootstrap bucket)
│       ├── apis.tf          # Project services (Cloud Run, Artifact Registry, etc.)
│       ├── main.tf          # Environment topology wiring modules
│       ├── variables.tf     # Configurable variables
│       ├── terraform.tfvars # Dev configuration values
│       └── outputs.tf       # Service URLs & Artifact Registry registry endpoints
│
└── modules/
    ├── artifact_registry/   # Reusable Artifact Registry module with automated cleanup
    └── cloud_run/           # Reusable Cloud Run v2 module with cost-conscious autoscaling
```

---

## Architecture & Best Practices

1. **Secretless CI/CD via Workload Identity Federation (WIP)**:
   - Eliminates static, high-risk service account JSON keys in GitHub Secrets.
   - GitHub Actions exchanges an OpenID Connect (OIDC) JWT token for a short-lived GCP access token dynamically.
   - Bound specifically to the repository `naveen3830/sp500-price-predictor`.

2. **State Management & Locking**:
   - Remote state stored in Google Cloud Storage (`stock-price-prediction-510204-tfstate`).
   - Object versioning is enabled with retention policies.
   - Public access prevention is enforced.

3. **Cost Optimization for Personal Account**:
   - Cloud Run services scale to **0 instances** when idle (zero compute cost).
   - Maximum instances capped at **2**.
   - Artifact Registry includes an automated lifecycle cleanup policy deleting untagged Docker images older than 14 days and keeping only the 5 most recent versions.

4. **Continuous Integration & Delivery (CI/CD)**:
   - **`terraform-plan.yml`**: Triggers on Pull Requests touching `terraform/**`. Runs `fmt -check`, `validate`, generates an execution plan, and posts an interactive summary comment to the PR.
   - **`terraform-apply.yml`**: Triggers on push to `main` (or manual dispatch). Applies changes with atomic concurrency protection (`concurrency.group = terraform-dev-apply`).

---

## Getting Started

### Step 1: Run Local Bootstrap (One-Time)
Run from your local workstation where `gcloud` is authenticated to your personal account:

```powershell
# Authenticate gcloud to personal project
gcloud config set account naveenrr1729@gmail.com
gcloud config set project stock-price-prediction-510204
gcloud auth application-default login

# Execute bootstrap
cd terraform/bootstrap
terraform init
terraform apply
```

### Step 2: Deploy Through GitHub Actions
Once the bootstrap is applied, your GCS state bucket and Workload Identity Federation provider will be active in Google Cloud. Any subsequent commit or PR pushed to GitHub will run `terraform plan` and `terraform apply` automatically via GitHub Actions!
