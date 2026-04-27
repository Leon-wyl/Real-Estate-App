output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "apprunner_service_url" {
  value = aws_apprunner_service.api.service_url
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
}
