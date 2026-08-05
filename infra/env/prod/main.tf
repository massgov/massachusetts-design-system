module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-prod"
  comment = "designsystem.mass.gov (prod)"

  # Domain-less for now: prod serves on its default *.cloudfront.net URL and
  # is ready to receive the production domain when DNS cutover is scheduled:
  # aliases             = ["designsystem.mass.gov"]
  # acm_certificate_arn = "<us-east-1 ACM cert arn>"
}
