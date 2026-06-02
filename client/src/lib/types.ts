import { z } from 'zod'

// ─── Domain Types ───

export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  createdAt: string
}

export interface Post {
  id: string
  title: string
  price: number
  images: string[]
  address: string
  city: string
  bedroom: number
  bathroom: number
  latitude: string
  longitude: string
  type: 'buy' | 'rent'
  property: 'house' | 'apartment' | 'condo' | 'land'
  createdAt: string
  userId: string
  user?: Pick<User, 'username' | 'avatar'>
  postDetail?: PostDetail
  isSaved?: boolean
}

export interface PostDetail {
  id: string
  desc: string
  utilities?: string
  pet?: string
  income?: string
  size?: number
  school?: number
  bus?: number
  restaurant?: number
  postId: string
}

export interface Chat {
  id: string
  userIDs: string[]
  createdAt: string
  seenBy: string[]
  messages?: Message[]
  lastMessage?: string
  users?: Pick<User, 'id' | 'username' | 'avatar'>[]
}

export interface Message {
  id: string
  text: string
  userId: string
  chatId: string
  createdAt: string
  user?: Pick<User, 'id' | 'username' | 'avatar'>
}

// ─── API Request/Response Types ───

export interface PostFilters {
  city?: string
  type?: 'buy' | 'rent'
  property?: 'house' | 'apartment' | 'condo' | 'land'
  bedroom?: number
  minPrice?: number
  maxPrice?: number
  userId?: string
}

export interface CreatePostData {
  postData: {
    title: string
    price: number
    images: string[]
    address: string
    city: string
    bedroom: number
    bathroom: number
    latitude: string
    longitude: string
    type: 'buy' | 'rent'
    property: 'house' | 'apartment' | 'condo' | 'land'
  }
  postDetail: {
    desc: string
    utilities?: string
    pet?: string
    income?: string
    size?: number
    school?: number
    bus?: number
    restaurant?: number
  }
}

export interface UpdatePostData {
  title?: string
  price?: number
  images?: string[]
  address?: string
  city?: string
  bedroom?: number
  bathroom?: number
  latitude?: string
  longitude?: string
  type?: 'buy' | 'rent'
  property?: 'house' | 'apartment' | 'condo' | 'land'
  postDetail?: {
    desc?: string
    utilities?: string
    pet?: string
    income?: string
    size?: number
    school?: number
    bus?: number
    restaurant?: number
  }
}

// ─── Zod Validation Schemas ───

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const profileUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  avatar: z.string().optional(),
})

export const searchSchema = z.object({
  city: z.string().optional(),
  type: z.enum(['buy', 'rent']).optional(),
  property: z.enum(['house', 'apartment', 'condo', 'land']).optional(),
  bedroom: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
})

export const postDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  bedroom: z.coerce.number().int(),
  bathroom: z.coerce.number().int(),
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
  type: z.enum(['buy', 'rent']),
  property: z.enum(['house', 'apartment', 'condo', 'land']),
})

export const postDetailSchema = z.object({
  desc: z.string().min(1, 'Description is required'),
  utilities: z.string().optional(),
  pet: z.string().optional(),
  income: z.string().optional(),
  size: z.preprocess(
    (val) => (val === '' || val == null ? undefined : Number(val)),
    z.number().int().optional(),
  ),
  school: z.preprocess(
    (val) => (val === '' || val == null ? undefined : Number(val)),
    z.number().int().optional(),
  ),
  bus: z.preprocess(
    (val) => (val === '' || val == null ? undefined : Number(val)),
    z.number().int().optional(),
  ),
  restaurant: z.preprocess(
    (val) => (val === '' || val == null ? undefined : Number(val)),
    z.number().int().optional(),
  ),
})

export const createListingSchema = z.object({
  postData: postDataSchema,
  postDetail: postDetailSchema,
})

export const updateListingSchema = z.object({
  title: z.string().min(1).optional(),
  price: z.coerce.number().positive().optional(),
  images: z.array(z.string()).min(1).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  bedroom: z.coerce.number().int().optional(),
  bathroom: z.coerce.number().int().optional(),
  latitude: z.string().min(1).optional(),
  longitude: z.string().min(1).optional(),
  type: z.enum(['buy', 'rent']).optional(),
  property: z.enum(['house', 'apartment', 'condo', 'land']).optional(),
  postDetail: postDetailSchema.partial().optional(),
})

export const messageSchema = z.object({
  text: z.string().trim().min(1, 'Message cannot be empty'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
export type MessageInput = z.infer<typeof messageSchema>
