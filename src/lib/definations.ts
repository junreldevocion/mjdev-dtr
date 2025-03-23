import { z } from 'zod'

export const DTRFormSchema = z.object({
  timeInOutDate: z.date(),
  timeIn: z.string().min(1, { message: 'Time in should be greater than 00:00' }),
  timeOut: z.string().min(1, { message: 'Time out should be greater than 00:00' }),
  id: z.string().optional(),
  isDoubleTime: z.boolean().optional()
})

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(2, { message: 'Be at least 2 characters long' })
    .trim(),
})

export const UpdateUserFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  oldPassword: z
    .string()
    .min(2, { message: 'Be at least 2 characters long' })
    .trim(),
  newPassword: z
    .string()
    .min(2, { message: 'Be at least 2 characters long' })
    .trim(),
})

export const SigninFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(2, { message: 'Be at least 2 characters long' })
    .trim(),
})

export type FormState =
  | {
    errors?: {
      name?: string[]
      email?: string[]
      password?: string[]
    }
    message?: string
  }
  | undefined


export type SessionPayload = {
  userId: string;
  expiresAt: Date;
}