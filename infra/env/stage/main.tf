module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-stage"
  comment = "designsystem.mass.gov (stage)"

  # aliases             = ["dev.massachusetts-design-system.mass.gov"]
  # acm_certificate_arn = "<us-east-1 ACM cert arn>"
}

