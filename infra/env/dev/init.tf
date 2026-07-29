###############################################################################
# Dev environment for designsystem.mass.gov
#
# Backend, provider, and managed tags follow massgov/SSR conventions:
#  - shared remote state bucket terraform.secure.digital.mass.gov
#  - tags sourced from the central mds-terraform-common//tagging module
###############################################################################

module "tagging" {
  source = "github.com/massgov/mds-terraform-common//tagging?ref=1.x"
  org    = "massgov"
  repo   = "massachusetts-design-system"
  additional_tags = {
    environment           = "dev"
    terraform_module_path = "massgov/massachusetts-design-system/infra/env/dev"
  }
}

terraform {
  required_version = "~> 1.7.0"
  backend "s3" {
    bucket         = "application-configurations"
    key            = "terraform/state/common.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = module.tagging.tags
  }
}