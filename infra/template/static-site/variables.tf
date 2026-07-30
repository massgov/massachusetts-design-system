variable "name" {
  description = "Base name for resources, e.g. \"massachusetts-design-system-dev\". Used for the bucket and OAC naming."
  type        = string
}

variable "comment" {
  description = "Human-readable CloudFront distribution comment, e.g. \"designsystem.mass.gov (dev)\"."
  type        = string
}

variable "tags" {
  description = "Tags applied to resources created directly (provider default_tags covers the rest)."
  type        = map(string)
  default     = {}
}

variable "default_root_object" {
  description = "Object served at the distribution root."
  type        = string
  default     = "index.html"
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_100 = US/Canada/Europe, sufficient for a US gov site."
  type        = string
  default     = "PriceClass_100"
}

variable "aliases" {
  description = "Custom domain aliases (CNAMEs). Empty until the designsystem.mass.gov domain is wired in."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ARN of an ACM certificate in us-east-1 for the aliases. Null uses the default *.cloudfront.net certificate."
  type        = string
  default     = null
}

variable "error_response_path" {
  description = "Path returned for 403/404 origin responses (the built 404 page)."
  type        = string
  default     = "/404.html"
}
