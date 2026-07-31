###############################################################################
# Custom static-site module: private S3 origin + OAC + CloudFront.
#
# Why custom instead of mds-terraform-common//static-site:
# the shared module hard-requires a domain + Route53 zone (it names the bucket
# after the domain and always provisions an ACM cert + DNS CNAME). This repo
# stands dev and stage up on the default *.cloudfront.net URL with NO domain
# yet — the designsystem.mass.gov domain is wired in later via the optional
# `aliases` / `acm_certificate_arn` inputs. This module supports that
# domain-less state.
#
# Tagging and the deploy role follow house conventions (mds-terraform-common
# //tagging and //gha_pipeline) at the env layer — see infra/env/dev.
###############################################################################

resource "aws_s3_bucket" "site" {
  bucket = var.name
  tags   = merge(var.tags, { Name = var.name })
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.name}-oac"
  description                       = "OAC for ${var.name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_function" "rewrite_index" {
  name    = "${var.name}-rewrite-index"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite directory-style URIs to index.html for ${var.name}"
  publish = true
  code    = file("${path.module}/rewrite-index.js")
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  comment             = var.comment
  default_root_object = var.default_root_object
  price_class         = var.price_class
  aliases             = var.aliases
  tags                = merge(var.tags, { Name = var.name })

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-${aws_s3_bucket.site.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${aws_s3_bucket.site.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_index.arn
    }
  }

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = var.error_response_path
  }

  custom_error_response {
    # OAC returns 403 for keys that don't exist in the bucket.
    error_code         = 403
    response_code      = 404
    response_page_path = var.error_response_path
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.acm_certificate_arn == null
    acm_certificate_arn            = var.acm_certificate_arn
    ssl_support_method             = var.acm_certificate_arn == null ? null : "sni-only"
    minimum_protocol_version       = var.acm_certificate_arn == null ? "TLSv1" : "TLSv1.2_2021"
  }
}

# Grant read access ONLY to this CloudFront distribution (via OAC).
data "aws_iam_policy_document" "site" {
  statement {
    sid       = "AllowCloudFrontOAC"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site.json
}
