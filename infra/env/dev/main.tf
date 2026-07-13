module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-dev"
  comment = "designsystem.mass.gov (dev)"

  # aliases             = ["dev.designsystem.mass.gov"]
  # acm_certificate_arn = "<us-east-1 ACM cert arn>"
}
