import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['ngo', 'volunteer', 'govt', 'admin']).default('volunteer'),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional(),
});

export const profileSetupSchema = z.object({
  clerkId: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['ngo', 'volunteer', 'govt', 'admin']),
  location: z.object({
    area: z.string().min(2),
    city: z.string().min(2),
    country: z.string().min(2),
    pincode: z.string().regex(/^\d{5,10}$/),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;