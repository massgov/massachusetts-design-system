module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-stage"
  comment = "designsystem.mass.gov (stage)"

  # Custom domain deferred until designsystem.mass.gov DNS is ready:
  # aliases             = ["stage.designsystem.mass.gov"]
  # acm_certificate_arn = "<us-east-1 ACM cert arn>"
}
