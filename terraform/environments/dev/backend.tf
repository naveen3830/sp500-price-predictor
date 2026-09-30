terraform {
  backend "gcs" {
    bucket = "stock-price-prediction-510204-tfstate"
    prefix = "terraform/environments/dev/state"
  }
}
