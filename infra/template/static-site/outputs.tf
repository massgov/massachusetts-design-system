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
  description = "The site hostname: the first alias when a custom domain is wired in, otherwise the *.cloudfront.net domain."
  value       = length(var.aliases) > 0 ? var.aliases[0] : aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_domain_name" {
  description = "The *.cloudfront.net domain (DNS CNAME target)."
  value       = aws_cloudfront_distribution.site.domain_name
}
