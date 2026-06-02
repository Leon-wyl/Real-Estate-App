export class ApiError extends Error {
  status: number
  details?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    details?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(message, 400, details)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Please log in to continue') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'You do not have permission') {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409)
    this.name = 'ConflictError'
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error. Please check your connection.') {
    super(message, 0)
    this.name = 'NetworkError'
  }
}

export function createErrorFromStatus(
  status: number,
  message: string,
  details?: Record<string, string[]>,
): ApiError {
  switch (status) {
    case 400:
      return new ValidationError(message, details)
    case 401:
      return new UnauthorizedError(message)
    case 403:
      return new ForbiddenError(message)
    case 404:
      return new NotFoundError(message)
    case 409:
      return new ConflictError(message)
    default:
      return new ApiError(message, status, details)
  }
}
