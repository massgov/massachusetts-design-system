module "static_site" {
  source = "../../template/static-site"

  name    = "massachusetts-design-system-stage"
  comment = "designsystem.mass.gov (stage)"

  aliases             = ["designsystem.stage.tss.mass.gov"]
  acm_certificate_arn = "arn:aws:acm:us-east-1:748039698304:certificate/be3fc473-1e85-4b11-8887-252d9a128288"
}
