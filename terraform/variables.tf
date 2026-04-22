variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "database_url" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret_key" {
  description = "Secret key for JWT"
  type        = string
  sensitive   = true
}

variable "client_url" {
  description = "URL of the frontend application"
  type        = string
  default     = "http://localhost:5173"
}
