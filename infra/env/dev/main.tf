module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-dev"
  comment = "designsystem.mass.gov (dev)"

  aliases             = ["designsystem.dev.tss.mass.gov"]
  acm_certificate_arn = "arn:aws:acm:us-east-1:748039698304:certificate/168fa57e-37a7-4fbf-aeaf-57ad2fd88539"
}
