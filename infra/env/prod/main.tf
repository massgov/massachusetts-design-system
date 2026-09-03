module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-prod"
  comment = "designsystem.mass.gov (prod)"

  aliases             = ["designsystem.mass.gov"]
  acm_certificate_arn = "arn:aws:acm:us-east-1:748039698304:certificate/8bf7c2b4-f8b4-4df2-a3e7-b876c5836f48"
}
