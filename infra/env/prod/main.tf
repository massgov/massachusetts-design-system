data "aws_route53_zone" "digital" {
  name = "digital.mass.gov"
}

module "static_site" {
  source      = "github.com/massgov/mds-terraform-common//static-site?ref=1.109"
  name        = "massachusetts-design-system-prod"
  bucket_name = "massachusetts-design-system-prod"
  zone_id     = data.aws_route53_zone.digital.zone_id
  environments = [
    {
      # Interim domain until designsystem.mass.gov DNS is ready to cut over.
      name         = "prod"
      domain       = "designsystem.digital.mass.gov"
      edge_lambdas = []
    }
  ]
  tags = module.tagging.tags
}
