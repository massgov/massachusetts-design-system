module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-stage"
  comment = "designsystem.mass.gov (stage)"

  # Custom domain deferred until the ACM cert for designsystem.stage.tss.mass.gov is issued:
  # aliases             = ["designsystem.stage.tss.mass.gov"]
  # acm_certificate_arn = "<us-east-1 ACM cert arn>"
}
