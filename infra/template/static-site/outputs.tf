output "site_bucket_id" {
  description = "Origin S3 bucket name (sync target for the deploy workflow)."
  value       = aws_s3_bucket.site.id
}

output "site_bucket_arn" {
  description = "Origin S3 bucket ARN (for scoping deploy IAM policies)."
  value       = aws_s3_bucket.site.arn
}

output "cloudfront_distro_id" {
  description = "CloudFront distribution ID (for cache invalidations)."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_distro_arn" {
  description = "CloudFront distribution ARN (for scoping deploy IAM policies)."
  value       = aws_cloudfront_distribution.site.arn
}

output "site_fqdn" {
  description = "The *.cloudfront.net domain — the shareable test URL until a custom domain is wired in."
  value       = aws_cloudfront_distribution.site.domain_name
}