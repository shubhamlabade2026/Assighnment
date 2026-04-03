import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const recordSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, "Category is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  notes: z.string().optional(),
});
