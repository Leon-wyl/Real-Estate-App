import {
  loginSchema,
  registerSchema,
  createListingSchema,
  messageSchema,
} from '@/lib/types'

describe('loginSchema', () => {
  it('valid login passes', () => {
    const result = loginSchema.safeParse({
      username: 'john',
      password: 'secret123',
    })
    expect(result.success).toBe(true)
  })

  it('empty username fails', () => {
    const result = loginSchema.safeParse({ username: '', password: 'secret' })
    expect(result.success).toBe(false)
  })

  it('empty password fails', () => {
    const result = loginSchema.safeParse({ username: 'john', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('valid registration passes', () => {
    const result = registerSchema.safeParse({
      username: 'john',
      email: 'john@example.com',
      password: 'secret123',
    })
    expect(result.success).toBe(true)
  })

  it('short username (< 3 chars) fails', () => {
    const result = registerSchema.safeParse({
      username: 'ab',
      email: 'john@example.com',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
  })

  it('invalid email fails', () => {
    const result = registerSchema.safeParse({
      username: 'john',
      email: 'not-an-email',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
  })

  it('short password (< 6 chars) fails', () => {
    const result = registerSchema.safeParse({
      username: 'john',
      email: 'john@example.com',
      password: '12345',
    })
    expect(result.success).toBe(false)
  })
})

describe('createListingSchema', () => {
  const validListing = {
    postData: {
      title: 'Beautiful House',
      price: 500000,
      images: ['image1.jpg'],
      address: '123 Main St',
      city: 'NYC',
      bedroom: 3,
      bathroom: 2,
      latitude: '40.7128',
      longitude: '-74.0060',
      type: 'buy' as const,
      property: 'house' as const,
    },
    postDetail: {
      desc: 'A beautiful house in the city',
    },
  }

  it('valid listing passes', () => {
    const result = createListingSchema.safeParse(validListing)
    expect(result.success).toBe(true)
  })

  it('missing title fails', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      postData: { ...validListing.postData, title: '' },
    })
    expect(result.success).toBe(false)
  })

  it('negative price fails', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      postData: { ...validListing.postData, price: -100 },
    })
    expect(result.success).toBe(false)
  })
})

describe('messageSchema', () => {
  it('valid message passes', () => {
    const result = messageSchema.safeParse({ text: 'Hello there' })
    expect(result.success).toBe(true)
  })

  it('empty string fails', () => {
    const result = messageSchema.safeParse({ text: '' })
    expect(result.success).toBe(false)
  })

  it('whitespace-only fails', () => {
    const result = messageSchema.safeParse({ text: '   ' })
    expect(result.success).toBe(false)
  })
})
