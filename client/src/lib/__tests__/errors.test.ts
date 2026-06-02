import {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  NetworkError,
  createErrorFromStatus,
} from '@/lib/api/errors'

describe('ApiError', () => {
  it('constructor sets message, status, details', () => {
    const err = new ApiError('Bad request', 400, { field: ['error'] })
    expect(err.message).toBe('Bad request')
    expect(err.status).toBe(400)
    expect(err.details).toEqual({ field: ['error'] })
    expect(err.name).toBe('ApiError')
  })
})

describe('ValidationError', () => {
  it('has status 400', () => {
    const err = new ValidationError('Invalid')
    expect(err.status).toBe(400)
    expect(err.name).toBe('ValidationError')
  })
})

describe('UnauthorizedError', () => {
  it('has status 401', () => {
    const err = new UnauthorizedError()
    expect(err.status).toBe(401)
    expect(err.name).toBe('UnauthorizedError')
    expect(err.message).toBe('Please log in to continue')
  })
})

describe('ForbiddenError', () => {
  it('has status 403', () => {
    const err = new ForbiddenError()
    expect(err.status).toBe(403)
    expect(err.name).toBe('ForbiddenError')
    expect(err.message).toBe('You do not have permission')
  })
})

describe('NotFoundError', () => {
  it('has status 404', () => {
    const err = new NotFoundError()
    expect(err.status).toBe(404)
    expect(err.name).toBe('NotFoundError')
    expect(err.message).toBe('Resource not found')
  })
})

describe('ConflictError', () => {
  it('has status 409', () => {
    const err = new ConflictError('Already exists')
    expect(err.status).toBe(409)
    expect(err.name).toBe('ConflictError')
    expect(err.message).toBe('Already exists')
  })
})

describe('NetworkError', () => {
  it('has status 0', () => {
    const err = new NetworkError()
    expect(err.status).toBe(0)
    expect(err.name).toBe('NetworkError')
  })
})

describe('instanceof checks', () => {
  it('ValidationError is instance of ApiError', () => {
    const err = new ValidationError('Invalid')
    expect(err instanceof ApiError).toBe(true)
    expect(err instanceof ValidationError).toBe(true)
  })

  it('UnauthorizedError is instance of ApiError', () => {
    const err = new UnauthorizedError()
    expect(err instanceof ApiError).toBe(true)
    expect(err instanceof UnauthorizedError).toBe(true)
  })

  it('ForbiddenError is instance of ApiError', () => {
    const err = new ForbiddenError()
    expect(err instanceof ApiError).toBe(true)
    expect(err instanceof ForbiddenError).toBe(true)
  })

  it('NotFoundError is instance of ApiError', () => {
    const err = new NotFoundError()
    expect(err instanceof ApiError).toBe(true)
    expect(err instanceof NotFoundError).toBe(true)
  })

  it('ConflictError is instance of ApiError', () => {
    const err = new ConflictError('Already exists')
    expect(err instanceof ApiError).toBe(true)
    expect(err instanceof ConflictError).toBe(true)
  })

  it('NetworkError is instance of ApiError', () => {
    const err = new NetworkError()
    expect(err instanceof ApiError).toBe(true)
    expect(err instanceof NetworkError).toBe(true)
  })
})

describe('createErrorFromStatus', () => {
  it('creates ValidationError for status 400', () => {
    const err = createErrorFromStatus(400, 'Bad request')
    expect(err).toBeInstanceOf(ValidationError)
  })

  it('creates UnauthorizedError for status 401', () => {
    const err = createErrorFromStatus(401, 'Unauthorized')
    expect(err).toBeInstanceOf(UnauthorizedError)
  })

  it('creates ForbiddenError for status 403', () => {
    const err = createErrorFromStatus(403, 'Forbidden')
    expect(err).toBeInstanceOf(ForbiddenError)
  })

  it('creates NotFoundError for status 404', () => {
    const err = createErrorFromStatus(404, 'Not found')
    expect(err).toBeInstanceOf(NotFoundError)
  })

  it('creates ConflictError for status 409', () => {
    const err = createErrorFromStatus(409, 'Conflict')
    expect(err).toBeInstanceOf(ConflictError)
  })

  it('creates ApiError for unknown status codes', () => {
    const err = createErrorFromStatus(500, 'Server error')
    expect(err).toBeInstanceOf(ApiError)
    expect(err).not.toBeInstanceOf(ValidationError)
    expect(err.status).toBe(500)
  })
})
