###############################################################################
# Prod environment for designsystem.mass.gov
#
# Backend, provider, and managed tags follow the same conventions as dev/stage:
#  - shared remote state bucket application-configurations
#  - tags sourced from the central mds-terraform-common//tagging module
###############################################################################

module "tagging" {
  source = "github.com/massgov/mds-terraform-common//tagging?ref=1.x"
  org    = "massgov"
  repo   = "massachusetts-design-system"
  additional_tags = {
    environment           = "prod"
    terraform_module_path = "massgov/massachusetts-design-system/infra/env/prod"
  }
}

terraform {
  backend "s3" {
    bucket         = "application-configurations"
    key            = "terraform/state/prod/design-mass-gov-prod.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform"
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = module.tagging.tags
  }
}
