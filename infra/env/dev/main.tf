module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-dev"
  comment = "designsystem.mass.gov (dev)"

  # Custom domain deferred until designsystem.mass.gov DNS is ready:
  # aliases             = ["dev.designsystem.mass.gov"]
  # acm_certificate_arn = "<us-east-1 ACM cert arn>"
}
