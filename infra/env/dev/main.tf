module "static_site" {
  source = "github.com/massgov/mds-terraform-common//static-site?ref=1.109"
  name   = "massachusetts-design-system-dev"
  bucket_name = "massachusetts-design-system-dev"
  environments = ["dev"] 
  tags = module.tagging.tags
}

module "tagging" {
  source = "github.com/massgov/mds-terraform-common//tagging?ref=1.x"
  org    = "massgov"
  repo   = "mymassgov"
  additional_tags = {
    environment           = "dev"
    terraform             = true
    terraform_module_path = "massgov/massachusetts-design-system/infra/env/dev"
  }
}