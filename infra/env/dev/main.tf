module "static_site" {
  source       = "github.com/massgov/mds-terraform-common//static-site?ref=1.109"
  name         = "massachusetts-design-system-dev"
  bucket_name  = "massachusetts-design-system-dev"
  environments = ["dev"]
  tags         = module.tagging.tags
  zone_id      = data.aws_route53_zone.zone_id
}

data "aws_route53_zone" "primary" {
  name = "Z39CCHR590O423"
}