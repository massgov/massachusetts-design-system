output "site_url" {
  description = "Production URL (https://designsystem.mass.gov)."
  value       = "https://${module.static_site.site_fqdn}"
}

output "site_bucket_id" {
  description = "Origin bucket — set as PROD_BUCKET environment variable for the deploy workflow."
  value       = module.static_site.site_bucket_id
}

output "cloudfront_distro_id" {
  description = "CloudFront distribution ID — set as PROD_DISTRIBUTION_ID for cache invalidation."
  value       = module.static_site.cloudfront_distro_id
}
