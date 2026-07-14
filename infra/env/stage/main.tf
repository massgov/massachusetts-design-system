module "static_site" {
  source = "github.com/massgov/mds-terraform-common//static-site?ref=1.109"
  name   = "massachusetts-design-system-stage"
  bucket_name = "massachusetts-design-system-stage"
  environments = ["stage"]
  tags = module.tagging.tags
}

module "tagging" {
  source = "github.com/massgov/mds-terraform-common//tagging?ref=1.x"
  org    = "massgov"
  repo   = "mymassgov"
  additional_tags = {
    environment           = "stage"
    terraform             = true
    terraform_module_path = "massgov/massachusetts-design-system/infra/env/stage"
  }
}