module "static_site" {
  source = "github.com/massgov/mds-terraform-common//static-site?ref=1.109"
  name   = "massachusetts-design-system-stage"
  bucket_name = "massachusetts-design-system-stage"
  environments = ["stage"]
  zone_id = data.aws_route53_zone.zone_id
  tags = module.tagging.tags
}

data "aws_route53_zone" "primary" {
  name = "Z39CCHR590O423"
}