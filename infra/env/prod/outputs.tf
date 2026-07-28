output "site_bucket_arn" {
  description = "Origin bucket ARN. The bucket name is the last ARN segment."
  value       = module.static_site.bucket_arn
}

output "cloudfront_distribution_arns" {
  description = "CloudFront distribution ARNs. The distribution ID is the last ARN segment."
  value       = module.static_site.cloudfront_distribution_arns
}
