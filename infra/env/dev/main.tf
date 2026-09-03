module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-dev"
  comment = "designsystem.mass.gov (dev)"

  # Custom domain deferred until the ACM cert for designsystem.dev.tss.mass.gov is issued:
  # aliases             = ["designsystem.dev.tss.mass.gov"]
  # acm_certificate_arn = "<us-east-1 ACM cert arn>"
}
