output "site_url" {
  description = "Shareable stage URL for UAT."
  value       = "https://${module.static_site.site_fqdn}"
}

output "site_bucket_id" {
  description = "Origin bucket — set as STAGE_BUCKET repo variable for the deploy workflow."
  value       = module.static_site.site_bucket_id
}

output "cloudfront_distro_id" {
  description = "CloudFront distribution ID — set as STAGE_DISTRIBUTION_ID repo variable."
  value       = module.static_site.cloudfront_distro_id
}
